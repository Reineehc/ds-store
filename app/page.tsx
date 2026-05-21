"use client";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      setProducts([]);
    }
  }

  fetchProducts();
}, []);
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  const bracelets = filteredProducts.filter(
    (product) => product.category === "Bracelets"
  );

  const caps = filteredProducts.filter(
    (product) => product.category === "Caps"
  );

  const fresheners = filteredProducts.filter(
    (product) => product.category === "DS Fresher"
  );

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24243F]">
      <Navbar />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-10 py-20 lg:grid-cols-2">
  <div>
    <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
      Accessories & Car Fresheners
    </p>

    <h2 className="mb-6 text-5xl font-extrabold leading-tight text-[#24243F]">
      Small details that make your style stand out.
    </h2>

    <p className="mb-8 max-w-xl text-lg text-zinc-600">
      Shop bracelets, caps, and DS Freshers designed to add personality to your look and freshness to your car.
    </p>

    <div className="flex gap-4">
      <a
        href="#bracelets"
        className="rounded-full px-8 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
        style={{
          background: "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
        }}
      >
        Shop Now
      </a>

      <a
        href="#fresheners"
        className="rounded-full border border-[#33D6D1] px-8 py-3 font-semibold text-[#24243F] transition hover:bg-[#33D6D1] hover:text-white"
      >
        View Fresheners
      </a>
    </div>
  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">
  <div className="relative h-[420px] overflow-hidden rounded-2xl bg-[#24243F]">
    <Image
      src="/products/ds-store-logo-new.jpg"
      alt="DS Store Logo"
      fill
      className="object-cover"
      priority
    />
  </div>
</div>
</section>
<section className="mx-auto max-w-6xl px-10 pb-12">
  <input
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    type="text"
    placeholder="Search bracelets, caps, fresheners..."
    className="w-full rounded-full border border-zinc-300 bg-white px-6 py-4 outline-none focus:border-[#33D6D1]"
  />
</section>

      {bracelets.length > 0 && (
  <ProductSection id="bracelets" title="Bracelets" products={bracelets} />
)}

{caps.length > 0 && (
  <ProductSection id="caps" title="Caps" products={caps} />
)}

{fresheners.length > 0 && (
  <ProductSection id="fresheners" title="DS Fresher" products={fresheners} />
)}

{filteredProducts.length === 0 && (
  <section className="mx-auto max-w-6xl px-10 pb-20">
    <p className="rounded-2xl bg-white p-6 text-zinc-500 shadow-sm">
      No products found.
    </p>
  </section>
)}
      <Footer />
    </main>
  );
}


function ProductSection({
  id,
  title,
  products,
}: {
  id: string;
  title: string;
  products: Product[];
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-10 pb-20">
  <div className="mb-8 flex items-end justify-between">
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
        Shop by category
      </p>

      <h3 className="text-3xl font-bold">{title}</h3>
    </div>

    <a href="#" className="text-sm font-medium text-zinc-500 hover:text-[#33D6D1]">
      View all
    </a>
  </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            category={product.category}
            slug={String(product.id)}
            stock={product.stock}
          />
        ))}   
      </div>
    </section>
  );
}