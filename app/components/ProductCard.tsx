import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  slug: string;
  stock: number;
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  slug,
  stock,
}: ProductCardProps) {
  return (
    <div className="group rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${slug}`}>
        <div className="relative mb-4 h-64 overflow-hidden rounded-2xl bg-zinc-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="px-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#FF4F7A]">
            {category}
          </p>

          <h4 className="text-lg font-bold">{name}</h4>

          <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
            {description}
          </p>

          <p className="mt-4 text-xl font-bold">${price}</p>
          <p className="mt-1 text-sm text-zinc-500">
            {stock === 0
              ? "Out of Stock"
              : stock <= 3
              ? `Only ${stock} left`
              : "In Stock"}
          </p>
        </div>
      </Link>

<div className="mt-4">
  <AddToCartButton
    product={{
      id,
      name,
      description,
      price,
      image,
      category,
      stock,
    }}
  />
</div>
    </div>
  );
}