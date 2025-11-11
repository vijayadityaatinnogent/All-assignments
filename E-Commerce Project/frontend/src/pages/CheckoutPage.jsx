import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ordersAPI } from '../services/api';
import { clearCart } from '../store/cartSlice';
import { addOrder } from '../store/orderSlice';
import './css/CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get current cart state from Redux
  const currentCart = useSelector(state => state.cart);
  
  const { cartItems, totalAmount, promoDiscount, finalAmount, promoCode } = location.state || {};
  
  const [formData, setFormData] = useState({
    addressLine1: '',
    state: '',
    pincode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate cart on component mount and when cart changes
  useEffect(() => {
    // Check if cart is empty or if checkout data doesn't match current cart
    if (!cartItems || cartItems.length === 0 || currentCart.items.length === 0) {
      navigate('/cart', { replace: true });
      return;
    }
    
    // Additional validation: check if cart items match current cart state
    const cartItemIds = cartItems.map(item => item.id).sort();
    const currentCartIds = currentCart.items.map(item => item.id).sort();
    
    if (JSON.stringify(cartItemIds) !== JSON.stringify(currentCartIds)) {
      // Cart has changed, redirect to cart page
      navigate('/cart', { replace: true });
      return;
    }
  }, [cartItems, currentCart.items, navigate]);

  // Show loading or return null while redirecting
  if (!cartItems || cartItems.length === 0 || currentCart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="loading-container">
            <p>Redirecting to cart...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Create single order with multiple cart items
      const orderData = {
        addressLine1: formData.addressLine1,
        state: formData.state,
        pincode: formData.pincode,
        cartItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        originalPrice: totalAmount,
        promoCode: promoCode || '',
        status: 'PENDING'
      };
      
      const orderResponse = await ordersAPI.createOrder(orderData);
      
      // Add order to Redux store
      dispatch(addOrder(orderResponse.data));
      
      // Clear cart
      dispatch(clearCart());
      
      // Navigate to success page
      navigate('/order-success', { 
        state: { 
          order: orderResponse.data,
          totalAmount: finalAmount
        } 
      });
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <button 
            onClick={() => navigate('/cart')} 
            className="back-to-cart"
          >
            ← Back to Cart
          </button>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/60x60?text=Product'} 
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <div className="item-total">
                    ₹{item.totalPrice}
                  </div>
                </div>
              ))}
            </div>

            <div className="price-summary">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              
              {promoDiscount > 0 && (
                <div className="price-row discount">
                  <span>Discount ({promoCode})</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}
              
              <div className="price-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              
              <hr />
              
              <div className="price-row total">
                <span>Total</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="address-form">
            <h2>Delivery Address</h2>
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="addressLine1">Address *</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  className={`form-input ${errors.addressLine1 ? 'error' : ''}`}
                />
                {errors.addressLine1 && (
                  <span className="error-message">{errors.addressLine1}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className={`form-input ${errors.state ? 'error' : ''}`}
                  />
                  {errors.state && (
                    <span className="error-message">{errors.state}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    className={`form-input ${errors.pincode ? 'error' : ''}`}
                  />
                  {errors.pincode && (
                    <span className="error-message">{errors.pincode}</span>
                  )}
                </div>
              </div>

              <div className="delivery-info">
                <h3>📦 Delivery Information</h3>
                <ul>
                  <li>✅ Free delivery on all orders</li>
                  <li>🚚 Estimated delivery: Just after 6 Hrs</li>
                  <li>📞 We'll call you before delivery</li>
                  <li>💰 Cash on Delivery available</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn btn-primary place-order-btn"
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${finalAmount}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;