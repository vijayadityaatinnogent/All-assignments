import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ onSearch }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cartItems = useSelector(state => state.cart.totalQuantity);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (location.pathname === '/' && onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <h2>ECommerce</h2>
        </Link>

        {/* Search Bar */}
        <form className="search-container" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        {/* Header Icons */}
        <div className="header-icons">
          {/* Cart */}
          <Link to="/cart" className="icon-container">
            <span className="icon">🛒</span>
            {cartItems > 0 && <span className="badge">{cartItems}</span>}
          </Link>

          {/* Notifications */}
          <div className="icon-container">
            <span className="icon">🔔</span>
          </div>

          {/* Profile */}
          <div className="profile-container">
            <div 
              className="icon-container"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="icon">👤</span>
            </div>
            
            {showProfileMenu && (
              <div className="profile-menu">
                <Link to="/profile" onClick={() => setShowProfileMenu(false)}>
                  Profile
                </Link>
                <Link to="/orders" onClick={() => setShowProfileMenu(false)}>
                  My Orders
                </Link>
                <button onClick={() => setShowProfileMenu(false)}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;