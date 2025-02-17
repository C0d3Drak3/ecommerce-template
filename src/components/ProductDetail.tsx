// components/ProductDetail.tsx
interface ProductDetailProps {
  name: string;
  image: string;
  price: number;
  description: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  name,
  image,
  price,
  description,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <img
        src={image}
        alt={name}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-gray-600 text-lg font-semibold">${price.toFixed(2)}</p>
      <p className="mt-2 text-gray-700">{description}</p>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductDetail;
