require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const WEB_APP_URL = process.env.WEB_APP_URL;

// Middleware
app.use(cors());
app.use(express.json());

// --- Telegram Bot Logic ---
bot.start((ctx) => {
  ctx.reply('Assalomu alaykum! Pizza buyurtma qilish uchun quyidagi tugmani bosing 🍕:', {
    reply_markup: {
      keyboard: [
        [{ text: '🍕 Menyuni ochish', web_app: { url: WEB_APP_URL } }]
      ],
      resize_keyboard: true
    }
  });
});

// Launch bot
bot.launch(() => {
  console.log('Bot successfully started!');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// --- API Endpoints ---

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { telegramId, name, phone, address, items, totalAmount } = req.body;

    if (!telegramId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    // Process order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find or create user
      let user = await tx.user.findUnique({
        where: { telegramId: telegramId.toString() }
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            telegramId: telegramId.toString(),
            name,
            phone
          }
        });
      } else if (phone && !user.phone) {
        // Update phone if it was previously empty
        user = await tx.user.update({
          where: { id: user.id },
          data: { phone, name }
        });
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: parseFloat(totalAmount),
          address: address || 'No address provided',
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true
        }
      });

      return newOrder;
    });

    // Notify Admin
    if (process.env.ADMIN_ID) {
      const orderDetails = order.items
        .map(i => `${i.product.name} (x${i.quantity}) - ${i.price * i.quantity} so'm`)
        .join('\n');
      
      const adminMessage = `
🔴 <b>Yangi buyurtma! (#${order.id})</b>

👤 <b>Mijoz:</b> ${order.user.name}
📞 <b>Tel:</b> ${order.user.phone || 'Noma\'lum'}
📍 <b>Manzil:</b> ${order.address}

🛒 <b>Buyurtmalar:</b>
${orderDetails}

💰 <b>Jami:</b> ${order.totalAmount} so'm
`;
      
      try {
        await bot.telegram.sendMessage(process.env.ADMIN_ID, adminMessage, { parse_mode: 'HTML' });
      } catch (err) {
        console.error('Error sending admin notification:', err);
      }
    }

    // Notify User
    try {
      await bot.telegram.sendMessage(
        telegramId, 
        `🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi va bazamizga saqlandi!</b> (#${order.id})\n\nKuryerimiz tez orada bog'lanadi.`,
        { parse_mode: 'HTML' }
      );
    } catch (err) {
      console.error('Error sending user notification:', err);
    }

    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
app.get('/api/orders/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { telegramId: telegramId.toString() }
    });

    if (!user) {
      return res.json([]);
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
