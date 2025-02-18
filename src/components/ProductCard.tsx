// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";

type ProductProps = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

const ProductCard = ({ id, name, price, imageUrl }: ProductProps) => {
  return (
    <Link href={`/product/${id}`} className="block">
      <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
        <Image
          src={imageUrl}
          alt={name}
          width={200}
          height={200}
          className="rounded-md object-cover"
        />
        <h3 className="mt-2 text-lg font-semibold">{name}</h3>
        <p className="text-gray-700">${price.toFixed(2)}</p>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Comprar
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
