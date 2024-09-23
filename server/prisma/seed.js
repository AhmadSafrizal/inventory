const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  // seed category
  const category1 = await prisma.category.create({
    data: {
      category_name: "Makanan",
    },
  });

  const category2 = await prisma.category.create({
    data: {
      category_name: "Elektronik",
    },
  });

  // Seed untuk User
  const user1 = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: "$2b$10$5QUpM08HC3.FYkde1Musue5h/Ule75w7zCmvZbimiGNCA51x4k53y",
    },
  });

  // Seed untuk TransactionType
  const transactionType1 = await prisma.transactionType.create({
    data: {
      type: "masuk",
    },
  });

  const transactionType2 = await prisma.transactionType.create({
    data: {
      type: "keluar",
    },
  });
}

seed()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
