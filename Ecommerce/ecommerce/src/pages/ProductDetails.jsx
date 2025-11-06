import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-4 rounded-xl shadow">
      <Link to="/" className="text-blue-500 underline text-sm">← Back</Link>
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-60 w-60 object-contain mx-auto"
        />
        <div>
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="font-semibold text-blue-700 text-lg">
            ${product.price}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Category: {product.category}
          </p>
        </div>
      </div>
    </div>
  );
}
