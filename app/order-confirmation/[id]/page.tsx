import Link from "next/link";

type OrderConfirmationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-16 text-[#24243F]">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white p-10 text-center shadow-md ring-1 ring-black/5">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl">
            ✓
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
            Order Confirmed
          </p>

          <h1 className="text-4xl font-extrabold">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-zinc-600">
            Your order has been placed successfully. We received your order and
            will contact you soon to confirm the delivery details.
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-3xl bg-[#F7F5EF] p-6">
            <p className="text-sm text-zinc-500">Your order number</p>
            <p className="mt-2 text-3xl font-extrabold text-[#24243F]">
              #{id}
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full px-8 py-4 font-semibold text-white shadow-md transition hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
              }}
            >
              Continue Shopping
            </Link>

            <Link
              href="/my-orders"
              className="rounded-full border border-[#33D6D1] px-8 py-4 font-semibold text-[#24243F] transition hover:bg-[#33D6D1] hover:text-white"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}