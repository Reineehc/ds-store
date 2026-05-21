"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Customer = {
  id: number;
  name: string;
  email: string;
};

export default function CustomerSettingsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch("/api/customer/me");

        if (res.ok) {
          const data = await res.json();

          if (data.customer) {
            setCustomer(data.customer);
            setName(data.customer.name);
            setEmail(data.customer.email);
          }
        }
      } catch (error) {
        console.error("CUSTOMER SETTINGS FETCH ERROR:", error);
      }
    }

    fetchCustomer();
  }, []);

  async function handleUpdateSettings(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/customer/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account settings updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setMessage(data.message || "Failed to update account settings.");
      }
    } catch (error) {
      console.error("CUSTOMER SETTINGS ERROR:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!customer) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] px-6 py-16 text-[#24243F]">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-md ring-1 ring-black/5">
          <h1 className="text-3xl font-extrabold">Account Settings</h1>
          <p className="mt-3 text-zinc-600">
            Please log in to manage your account.
          </p>

          <Link
            href="/customer/login"
            className="mt-6 inline-block rounded-full px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
            style={{
              background: "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
            }}
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-16 text-[#24243F]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
              Account Settings
            </p>

            <h1 className="text-4xl font-extrabold">My Account</h1>

            <p className="mt-3 text-zinc-600">
              Update your profile details and password.
            </p>
          </div>

          <Link
            href="/my-orders"
            className="rounded-full border border-[#33D6D1] px-6 py-3 font-semibold text-[#24243F] transition hover:bg-[#33D6D1] hover:text-white"
          >
            My Orders
          </Link>
        </div>

        <form
          onSubmit={handleUpdateSettings}
          className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
        >
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-bold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Phone</label>
              <input
                type="text"
                placeholder="Optional"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            <div className="border-t border-zinc-200 pt-5">
              <h2 className="text-xl font-bold">Security</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Enter your current password to save changes.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Required"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                New Password
              </label>
              <input
                type="password"
                placeholder="Leave empty if you do not want to change it"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            {message && (
              <p
                className={`rounded-2xl p-4 text-sm font-medium ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full px-8 py-4 font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}