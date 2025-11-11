import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ordersAPI } from '../services/api';
import { setOrders, setLoading, setError } from '../store/orderSlice';
import './css/OrdersPage.css';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ordersAPI.getAllOrders();
      dispatch(setOrders(response.data));
    } catch (err) {
      dispatch(setError('Failed to fetch orders'));
      console.error('Error fetching orders:', err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await ordersAPI.cancelOrder(orderId);
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'shipped': return '#17a2b8';
      case 'out_for_delivery': return '#fd7e14';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'shipped': return '🚚';
      case 'out_for_delivery': return '🚛';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 25;
      case 'shipped': return 50;
      case 'out_for_delivery': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-container">
            <h2>Error Loading Orders</h2>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <div className="order-stats">
            <span>Total Orders: {orders.length}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({orders.filter(o => o.status.toLowerCase() === 'cancelled').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({orders.filter(o => o.status.toLowerCase() === 'pending').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilter('shipped')}
          >
            Shipped ({orders.filter(o => o.status.toLowerCase() === 'shipped').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'out_for_delivery' ? 'active' : ''}`}
            onClick={() => setFilter('out_for_delivery')}
          >
            Out for Delivery ({orders.filter(o => o.status.toLowerCase() === 'out_for_delivery').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered ({orders.filter(o => o.status.toLowerCase() === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No Orders Found</h2>
            <p>
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${filter} orders found.`
              }
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div className="order-actions">
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusIcon(order.status)} {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    {(order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'shipped') && (
                      <button 
                        className="cancel-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            cancelOrder(order.id);
                          }
                        }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                <div className="order-details">
                  <div className="product-info">
                    <h4>Items in this order:</h4>
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, index) => (
                        <div key={index} className="order-item-detail">
                          <div className="item-with-image">
                            <img 
                              src={item.productImageUrl || 'https://via.placeholder.com/50x50?text=Product'} 
                              alt={item.productName}
                              className="order-item-image"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50x50?text=Product';
                              }}
                            />
                            <div className="item-details">
                              <p><strong>{item.productName}</strong></p>
                              <p>Quantity: {item.quantity} × ₹{item.price} = ₹{item.totalPrice}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No items found</p>
                    )}
                    {order.promoCode && (
                      <p className="promo-applied">
                        🎟️ Promo: {order.promoCode} (-₹{order.discountAmount})
                      </p>
                    )}
                  </div>

                  <div className="price-info">
                    <div className="price-row">
                      <span>Original Price:</span>
                      <span>₹{order.originalPrice}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="price-row discount">
                        <span>Discount:</span>
                        <span>-₹{order.discountAmount}</span>
                      </div>
                    )}
                    <div className="price-row total">
                      <span>Final Price:</span>
                      <span>₹{order.finalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="delivery-address">
                  <h5>📍 Delivery Address:</h5>
                  <p>{order.addressLine1}, {order.state} - {order.pincode}</p>
                </div>

                {/* Progress Bar for Active Orders */}
                {!['delivered', 'cancelled'].includes(order.status.toLowerCase()) && (
                  <div className="order-progress">
                    <div className="progress-bar-container">
                      <div className="progress-steps">
                        <div className={`step ${['pending', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status.toLowerCase()) ? 'completed' : ''}`}>
                          <div className="step-icon">📦</div>
                          <span>Order Placed</span>
                        </div>
                        <div className={`step ${['shipped', 'out_for_delivery', 'delivered'].includes(order.status.toLowerCase()) ? 'completed' : ''}`}>
                          <div className="step-icon">🚚</div>
                          <span>Shipped</span>
                        </div>
                        <div className={`step ${['out_for_delivery', 'delivered'].includes(order.status.toLowerCase()) ? 'completed' : ''}`}>
                          <div className="step-icon">🚛</div>
                          <span>Out for Delivery</span>
                        </div>
                        <div className={`step ${order.status.toLowerCase() === 'delivered' ? 'completed' : ''}`}>
                          <div className="step-icon">✅</div>
                          <span>Delivered</span>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${getProgressPercentage(order.status)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="progress-info">
                      <p className="delivery-estimate">
                        🚚 Estimated delivery: 6 hours from order placement
                      </p>
                    </div>
                  </div>
                )}

                {order.status.toLowerCase() === 'cancelled' && (
                  <div className="cancelled-info">
                    <p className="cancelled-text">
                      ❌ This order has been cancelled
                    </p>
                  </div>
                )}

                {order.status.toLowerCase() === 'delivered' && order.deliveryDate && (
                  <div className="delivery-info">
                    <p className="delivered-text">
                      ✅ Delivered on {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;