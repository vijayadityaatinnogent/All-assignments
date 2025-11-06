import {Link} from "react-router-dom";

export default function ProductCard({ product }) {
    return(
        <Link to = {`/product/${product.id}`}
        className = "border rounded-xl shadow p-12 hover:shadow-lg transition bg-white">
            <img
            src = {product.image}
            alt = {product.title}
            className = "h-40 w-full object-contain mb-2"
            />

            <h2 className="text-sm font-semibold"> { product.title} </h2>
            <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                
        </Link>
    );
}