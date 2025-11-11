import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const renderStars = (rating) => {
    if (!rating || !rating.rate) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating.rate);
    const hasHalfStar = rating.rate % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating.rate);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.imageUrl || product.image || 'https://via.placeholder.com/300x200?text=Product'} 
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Product';
            }}
          />
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name || product.title}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-category">
            <span className="category-tag">{product.category}</span>
          </div>
          
          {product.rating && (
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-text">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>
          )}
          
          <div className="product-price">₹{product.price}</div>
        </div>
      </Link>
      
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
      >
        Add to Cart 🛒
      </button>
    </div>
  );
};

export default ProductCard;