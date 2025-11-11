import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart, clearCart } from '../store/cartSlice';
import { promoAPI } from '../services/api';
import './css/CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim().toUpperCase()) {
      setPromoMessage('Please enter a promo code');
      return;
    }

    try {
      setPromoLoading(true);
      const response = await promoAPI.validatePromoCode(promoCode, totalAmount);
      
      if (response.data.valid) {
        setPromoDiscount(response.data.discountAmount);
        setPromoMessage(`✅ ${response.data.message}`);
      } else {
        setPromoDiscount(0);
        setPromoMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      setPromoDiscount(0);
      setPromoMessage('❌ Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoMessage('');
  };

  const finalAmount = totalAmount - promoDiscount;

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout', { 
      state: { 
        cartItems: items, 
        totalAmount, 
        promoDiscount, 
        finalAmount,
        promoCode: promoDiscount > 0 ? promoCode : null
      } 
    });
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add some products to your cart to get started!</p>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart ({totalQuantity} items)</h1>
          <button 
            onClick={() => dispatch(clearCart())} 
            className="clear-cart-btn"
          >
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/100x100?text=Product'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                    }}
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">₹{item.price}</p>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">₹{item.totalPrice}</p>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-btn"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              {/* Promo Code Section */}
              <div className="promo-section">
                <h4>Promo Code</h4>
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="promo-input"
                    disabled={promoDiscount > 0}
                  />
                  {promoDiscount > 0 ? (
                    <button 
                    onClick={handleRemovePromo}
                    className="btn btn-secondary"
                    >
                      Remove
                    </button>
                  ) : (
                    <button 
                    onClick={handleApplyPromo}
                    className="btn btn-outline"
                    disabled={promoLoading}
                    >
                      {promoLoading ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
                {promoMessage && (
                  <p className={`promo-message ${promoDiscount > 0 ? 'success' : 'error'}`}>
                    {promoMessage}
                  </p>
                )}
                <h6>Promos: WELCOME20, FLAT30, SAVE10, WINTER20</h6>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>₹{totalAmount}</span>
                </div>
                
                {promoDiscount > 0 && (
                  <div className="price-row discount">
                    <span>Discount ({promoCode})</span>
                    <span>-₹{promoDiscount}</span>
                  </div>
                )}
                
                <div className="price-row shipping">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>
                
                <hr />
                
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="btn btn-primary checkout-btn"
              >
                Proceed to Checkout
              </button>

              <button 
                onClick={() => navigate('/')}
                className="btn btn-outline continue-shopping"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;