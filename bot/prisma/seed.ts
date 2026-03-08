const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding products...')

  // Check if products already exist
  const existingProducts = await prisma.product.count()
  if (existingProducts > 0) {
    console.log('Products already seeded. Skipping...')
    return
  }

  const products = [
    {
      name: 'Margarita',
      description: 'Classic pizza with tomatoes, mozzarella cheese, and basil.',
      price: 50000,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2938&auto=format&fit=crop',
    },
    {
      name: 'Peperoni',
      description: 'Zesty pepperoni and mozzarella cheese on a traditional crust.',
      price: 65000,
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2680&auto=format&fit=crop',
    },
    {
      name: 'Qazi pizza',
      description: 'Special local taste with traditional Qazi meat and cheese.',
      price: 85000,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2881&auto=format&fit=crop',
    },
    {
      name: 'Pishloqli',
      description: 'Extra cheese pizza for true cheese lovers. Multiple types of cheese.',
      price: 55000,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2940&auto=format&fit=crop',
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
