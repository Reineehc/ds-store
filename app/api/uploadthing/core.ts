import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";
import { verifyAdminToken } from "../../../lib/auth";

const f = createUploadthing();

async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-auth")?.value;

  if (!token) {
    return false;
  }

  const admin = await verifyAdminToken(token);
  return !!admin;
}

export const ourFileRouter = {
  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const isAdmin = await isAdminLoggedIn();

      if (!isAdmin) {
        throw new Error("Unauthorized");
      }

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;