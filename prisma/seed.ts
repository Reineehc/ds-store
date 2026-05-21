import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "1234",
    10
  );

  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });