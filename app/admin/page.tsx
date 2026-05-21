"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-12 text-[#24243F]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
              Admin Panel
            </p>

            <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>

            <p className="mt-3 text-zinc-600">
              Manage your store products, stock, customer orders, and delivery
              status.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full border border-[#33D6D1] px-6 py-3 font-semibold text-[#24243F] transition hover:bg-[#33D6D1] hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/products"
            className="group rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5EF] text-2xl">
              🛍️
            </div>

            <h2 className="text-2xl font-extrabold group-hover:text-[#FF4F7A]">
              Manage Products
            </h2>

            <p className="mt-3 text-zinc-600">
              Add, edit, delete products, and update stock quantities.
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="group rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5EF] text-2xl">
              📦
            </div>

            <h2 className="text-2xl font-extrabold group-hover:text-[#FF4F7A]">
              View Orders
            </h2>

            <p className="mt-3 text-zinc-600">
              Check customer orders, payment status, and delivery progress.
            </p>
          </Link>

          <Link
            href="/"
            className="group rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5EF] text-2xl">
              🏠
            </div>

            <h2 className="text-2xl font-extrabold group-hover:text-[#FF4F7A]">
              Back to Store
            </h2>

            <p className="mt-3 text-zinc-600">
              Return to the customer shopping website.
            </p>
          </Link>
          <Link
            href="/admin/settings"
            className="group rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F5EF] text-2xl">
              ⚙️
            </div>

            <h2 className="text-2xl font-extrabold group-hover:text-[#FF4F7A]">
              Settings
            </h2>

            <p className="mt-3 text-zinc-600">
              Update admin email and password.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}