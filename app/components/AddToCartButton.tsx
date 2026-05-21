"use client";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

type CartItem = Product & {
  quantity: number;
};

export default function AddToCartButton({
  product,
  quantity = 1,
}: {
  product: Product;
  quantity?: number;
}) {
  function handleAddToCart() {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    const savedCart = localStorage.getItem("cart");
    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find((item) => item.id === product.id);

    let updatedCart: CartItem[];

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        alert(`Only ${product.stock} item(s) available in stock.`);
        return;
      }

      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
    } else {
      if (quantity > product.stock) {
        alert(`Only ${product.stock} item(s) available in stock.`);
        return;
      }

      updatedCart = [...cart, { ...product, quantity }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert("Product added to cart!");
    window.dispatchEvent(new Event("cartUpdated"));
  }

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full bg-gray-400 py-3 font-semibold text-white sm:w-64"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
  onClick={handleAddToCart}
  className="w-full rounded-full py-3 font-semibold text-white transition hover:scale-[1.02] sm:w-64"
  style={{
    background: "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
  }}
>
  Add to Cart
</button>
  );
}