import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { productsAPI } from '../services/api';
import { addToCart } from '../store/cartSlice';
import ProductCard from '../components/ProductCard';
import './css/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const [productResponse, relatedResponse] = await Promise.all([
        productsAPI.getProductById(id),
        productsAPI.getRelatedProducts(id)
      ]);
      setProduct(productResponse.data);
      setRelatedProducts(relatedResponse.data);
      setError(null);
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="product-details-content">
          {/* Product Image */}
          <div className="product-image-section">
            <img 
              src={product.imageUrl || product.image || 'https://via.placeholder.com/500x400?text=Product'} 
              alt={product.name}
              className="product-main-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x400?text=Product';
              }}
            />
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-category">
              <span className="category-tag">{product.category}</span>
            </div>
            
            <h1 className="product-title">{product.name || product.title}</h1>
            
            {product.rating && (
              <div className="product-rating-details">
                <div className="stars-large">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span 
                      key={i} 
                      className={`star-large ${i < Math.floor(product.rating.rate) ? 'filled' : 'empty'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="rating-info">
                  <span className="rating-score">{product.rating.rate}/5</span>
                  <span className="rating-count">({product.rating.count} reviews)</span>
                </div>
              </div>
            )}
            
            <div className="product-price">
              <span className="price">₹{product.price.toLocaleString()}</span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                onClick={handleAddToCart}
                className="btn btn-outline add-to-cart"
              >
                🛒 Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="btn btn-primary buy-now"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <h3>Features</h3>
              <ul>
                <li>✅ Free Delivery</li>
                <li>✅ 7 Days Return Policy</li>
                <li>✅ 1 Year Warranty</li>
                <li>✅ Cash on Delivery Available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;