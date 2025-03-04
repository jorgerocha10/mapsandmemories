const { PrismaClient, Role, MapStyle, Material } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedMap.deleteMany();
  await prisma.layer.deleteMany();
  await prisma.frameStyle.deleteMany();
  await prisma.size.deleteMany();
  await prisma.location.deleteMany();
  await prisma.map.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.inventory.deleteMany();

  console.log('Database cleaned');

  // Create users
  const adminPassword = await hash('admin123', 10);
  const customerPassword = await hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@mapsandmemories.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'customer@example.com',
      password: customerPassword,
      role: Role.CUSTOMER,
      addresses: {
        create: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
          isDefault: true,
        },
      },
    },
  });

  console.log('Users created:', { admin: admin.id, customer: customer.id });

  // Create categories
  const framedMapsCategory = await prisma.category.create({
    data: {
      name: 'Framed Maps',
      slug: 'framed-maps',
      description: 'Beautiful laser-cut maps in elegant frames, perfect for home or office decoration.',
    },
  });

  const keyHolderMapsCategory = await prisma.category.create({
    data: {
      name: 'Key Holder Maps',
      slug: 'key-holder-maps',
      description: 'Functional and stylish key holders featuring your favorite locations.',
    },
  });

  console.log('Categories created:', { 
    framedMaps: framedMapsCategory.id, 
    keyHolderMaps: keyHolderMapsCategory.id 
  });

  // Create inventory items for materials
  const materials = Object.values(Material);
  for (const material of materials) {
    await prisma.inventory.create({
      data: {
        material,
        quantity: Math.floor(Math.random() * 50) + 20, // Random quantity between 20-70
        lowThreshold: 10,
      },
    });
  }

  console.log('Inventory items created');

  // Create a framed map product
  const newYorkMap = await prisma.map.create({
    data: {
      name: 'New York City Framed Map',
      description: 'A detailed multi-layer laser-cut map of New York City, featuring Manhattan and surrounding boroughs. This elegant piece showcases the city\'s intricate street layout and waterways in a beautiful wooden frame.',
      price: 149.99,
      isTemplate: true,
      mapStyle: MapStyle.MINIMAL,
      customText: 'New York City',
      categoryId: framedMapsCategory.id,
      images: [
        '/images/product2-framed-1.png',
        '/images/product2-framed-2.png',
        '/images/product2-framed-3.png',
      ],
    },
  });

  // Add location for New York map
  await prisma.location.create({
    data: {
      name: 'New York City',
      latitude: 40.7128,
      longitude: -74.0060,
      zoomLevel: 12,
      mapId: newYorkMap.id,
    },
  });

  // Add frame style for New York map
  await prisma.frameStyle.create({
    data: {
      style: 'Classic',
      material: Material.WOOD_WALNUT,
      color: 'Dark Brown',
      mapId: newYorkMap.id,
    },
  });

  // Add size for New York map
  await prisma.size.create({
    data: {
      width: 300,
      height: 400,
      mapId: newYorkMap.id,
    },
  });

  // Add layers for New York map
  await prisma.layer.create({
    data: {
      depth: 1,
      material: Material.WOOD_MAPLE,
      color: 'Light Brown',
      mapId: newYorkMap.id,
    },
  });

  await prisma.layer.create({
    data: {
      depth: 2,
      material: Material.ACRYLIC_BLUE,
      color: 'Deep Blue',
      mapId: newYorkMap.id,
    },
  });

  await prisma.layer.create({
    data: {
      depth: 3,
      material: Material.WOOD_WALNUT,
      color: 'Dark Brown',
      mapId: newYorkMap.id,
    },
  });

  console.log('New York framed map created:', newYorkMap.id);

  // Create a key holder map product
  const sanFranciscoMap = await prisma.map.create({
    data: {
      name: 'San Francisco Key Holder Map',
      description: 'A functional and stylish key holder featuring a laser-cut map of San Francisco. Perfect for your entryway, this piece combines practicality with a beautiful reminder of the city by the bay.',
      price: 79.99,
      isTemplate: true,
      mapStyle: MapStyle.ROAD,
      customText: 'San Francisco',
      categoryId: keyHolderMapsCategory.id,
      images: [
        '/images/product1-keyholder-1.png',
        '/images/product1-keyholder-2.png',
      ],
    },
  });

  // Add location for San Francisco map
  await prisma.location.create({
    data: {
      name: 'San Francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      zoomLevel: 13,
      mapId: sanFranciscoMap.id,
    },
  });

  // Add frame style for San Francisco map
  await prisma.frameStyle.create({
    data: {
      style: 'Modern',
      material: Material.WOOD_OAK,
      color: 'Natural',
      mapId: sanFranciscoMap.id,
    },
  });

  // Add size for San Francisco map
  await prisma.size.create({
    data: {
      width: 200,
      height: 300,
      mapId: sanFranciscoMap.id,
    },
  });

  // Add layers for San Francisco map
  await prisma.layer.create({
    data: {
      depth: 1,
      material: Material.WOOD_OAK,
      color: 'Natural',
      mapId: sanFranciscoMap.id,
    },
  });

  await prisma.layer.create({
    data: {
      depth: 2,
      material: Material.ACRYLIC_BLACK,
      color: 'Black',
      mapId: sanFranciscoMap.id,
    },
  });

  console.log('San Francisco key holder map created:', sanFranciscoMap.id);

  // Add reviews for the maps
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'This New York map is absolutely stunning! The detail is incredible and it looks perfect in my living room.',
      userId: customer.id,
      mapId: newYorkMap.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Love my San Francisco key holder! It\'s both practical and a beautiful piece of art.',
      userId: customer.id,
      mapId: sanFranciscoMap.id,
    },
  });

  console.log('Reviews created');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 