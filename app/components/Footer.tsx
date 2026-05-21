export default function Footer() {
  return (
    <footer className="mt-20 bg-white px-10 py-10 text-zinc-900 shadow-sm">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-2xl font-bold">DS Store</h2>
          <p className="mt-3 text-sm text-zinc-600">
            Accessories and car fresheners made simple.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Shop</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-600">
            <a href="/#bracelets" className="hover:text-pink-500">
              Bracelets
            </a>
            <a href="/#caps" className="hover:text-pink-500">
              Caps
            </a>
            <a href="/#fresheners" className="hover:text-pink-500">
              DS Fresher
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-600">
            <p>Instagram: @dsstore</p>
            <p>WhatsApp: +961 00 000 000</p>
            <p>Delivery available in Lebanon</p>
          </div>
        </div>
      </div>

      <p className="mt-10 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
        © 2026 DS Store. All rights reserved.
      </p>
    </footer>
  );
}