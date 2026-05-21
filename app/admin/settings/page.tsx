"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdateSettings(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail,
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Admin settings updated successfully.");
        setNewEmail("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setMessage(data.message || "Failed to update admin settings.");
      }
    } catch (error) {
      console.error("ADMIN SETTINGS ERROR:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-12 text-[#24243F]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
              Admin Settings
            </p>

            <h1 className="text-4xl font-extrabold">Settings</h1>

            <p className="mt-3 text-zinc-600">
              Update your admin email or password securely.
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
          onSubmit={handleUpdateSettings}
          className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
        >
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-bold">
                New Email
              </label>
              <input
                type="email"
                placeholder="Leave empty if you do not want to change it"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Required to save changes"
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
                  "linear-gradient(90deg, #24243F 0%, #33D6D1 100%)",
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