import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { prisma } from "../../../lib/prisma";
import AddToCartButton from "../../components/AddToCartButton";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24243F]">
      <Navbar />

      <section className="grid gap-10 px-10 py-12 lg:grid-cols-2">
        <div className="relative h-[500px] overflow-hidden rounded-3xl bg-white shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
            {product.category}
          </p>

          <h1 className="mb-4 text-5xl font-bold">{product.name}</h1>

          <p className="mb-6 text-lg text-zinc-600">{product.description}</p>

          <p className="mb-8 text-3xl font-bold">${product.price}</p>

          <a
            href="/"
            className="mb-6 inline-block text-sm font-medium text-zinc-600 hover:text-pink-500"
          >
            ← Back to products
          </a>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-24 rounded-xl border border-zinc-300 px-4 py-2"
            />
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              category: product.category,
              stock: product.stock,
            }}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}