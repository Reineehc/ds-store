import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

async function main() {
  const { prisma } = await import("../lib/prisma");

  const adminEmail = "dsstoreadmin@gmail.com";
  const adminPassword = "darsheb2$@";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log("Admin already exists.");
    await prisma.$disconnect();
    return;
  }

  await prisma.admin.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log("Admin created successfully.");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
});