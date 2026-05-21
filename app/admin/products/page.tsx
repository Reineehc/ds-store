"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      setMessage("Failed to load products.");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();

    const productData = {
      name,
      description,
      price,
      image,
      category,
      stock,
    };

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      setMessage(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
      setStock("");
      setEditingId(null);

      fetchProducts();
    } else {
      const errorData = await res.json();
      setMessage(errorData.message || "Failed to save product.");
    }
  }

  function handleStartEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setImage(product.image);
    setCategory(product.category);
    setStock(String(product.stock));
  }

  async function handleDeleteProduct(id: number) {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessage("Product deleted successfully!");
      fetchProducts();
    } else {
      setMessage("Failed to delete product.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    setStock("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-12 text-[#24243F]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
              Admin Products
            </p>
            <h1 className="text-4xl font-extrabold">Manage Products</h1>
            <p className="mt-3 text-zinc-600">
              Add, edit, delete products, and update stock quantities.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-[#33D6D1] px-6 py-3 font-semibold text-[#24243F] transition hover:bg-[#33D6D1] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <form
          onSubmit={handleAddProduct}
          className="mb-10 rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
        >
          <h2 className="mb-6 text-2xl font-bold">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <input
              type="number"
              placeholder="Product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <input
              type="number"
              placeholder="Stock quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <input
              type="text"
              placeholder="Category, example: Bracelets"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <input
              type="text"
              placeholder="Image path, example: /products/blue-bracelet.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="md:col-span-2 rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <textarea
              placeholder="Product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="md:col-span-2 rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-full px-8 py-4 font-semibold text-white shadow-md transition hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
              }}
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-full border border-zinc-300 px-8 py-4 font-semibold text-[#24243F] transition hover:bg-[#F7F5EF]"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {message && (
            <p
              className={`mt-5 rounded-2xl p-4 text-sm font-medium ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">All Products</h2>
            <p className="text-sm text-zinc-500">
              {products.length} product(s)
            </p>
          </div>

          <div className="grid gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-extrabold">
                        {product.name}
                      </h3>

                      <span className="rounded-full bg-[#F7F5EF] px-3 py-1 text-sm font-semibold text-[#FF4F7A]">
                        {product.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          product.stock === 0
                            ? "bg-red-50 text-red-600"
                            : product.stock <= 3
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>

                    <p className="max-w-3xl text-zinc-600">
                      {product.description}
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-zinc-500 sm:grid-cols-2">
                      <p>
                        <strong className="text-[#24243F]">Price:</strong> $
                        {product.price}
                      </p>
                      <p>
                        <strong className="text-[#24243F]">Image:</strong>{" "}
                        {product.image}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStartEdit(product)}
                      className="rounded-full bg-[#24243F] px-6 py-3 font-semibold text-white transition hover:scale-[1.02]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}