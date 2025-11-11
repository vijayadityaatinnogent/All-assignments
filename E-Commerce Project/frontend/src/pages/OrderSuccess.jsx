import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { order, totalAmount } = location.state || {};

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="order-success-page">
      <div className="container-2">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          <div className="order-details">
            <h2>Order Details</h2>
            <div className="order-info">
              <div className="info-row">
                <span>Order Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span>Total Amount:</span>
                <span className="amount">₹{totalAmount}</span>
              </div>
              <div className="info-row">
                <span>Order ID:</span>
                <span>#{order.id}</span>
              </div>
              <div className="info-row">
                <span>Number of Items:</span>
                <span>{order.orderItems ? order.orderItems.length : 0}</span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span className="status">Processing</span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>📧 You'll receive an order confirmation email</li>
              <li>📦 Your order will be processed within 2 hours</li>
              <li>🚚 Estimated delivery: Just after 6 Hrs</li>
              <li>📱 Track your order in "My Orders" section</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button 
              onClick={() => navigate('/orders')}
              className="btn btn-primary"
            >
              View My Orders
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;