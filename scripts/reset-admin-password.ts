import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

async function main() {
  const { prisma } = await import("../lib/prisma");

  const currentAdminEmail = "admin@example.com";

  const newAdminEmail = "dsstoreadmin@gmail.com";
  const newPassword = "darsheb2$@";

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.admin.update({
    where: {
      email: currentAdminEmail,
    },
    data: {
      email: newAdminEmail,
      password: hashedPassword,
    },
  });

  console.log("Admin email and password updated successfully.");

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
});