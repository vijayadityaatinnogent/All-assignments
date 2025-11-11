import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './css/HomePage.css';

const HomePage = ({ searchTerm: headerSearchTerm = '' }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['all', 'men\'s clothing', 'jewelery', 'footwear', 'accessories', 'women\'s clothing', 'electronics'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, headerSearchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from API...');
      const response = await productsAPI.getAllProducts();
      console.log('API Response:', response);
      console.log('Products data:', response.data);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
      console.error('Error details:', err.response);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    console.log('Filtering products...');
    console.log('All products:', products);
    console.log('Selected category:', selectedCategory);
    console.log('Search term:', headerSearchTerm);
    
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (headerSearchTerm && headerSearchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(headerSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(headerSearchTerm.toLowerCase())
      );
    }

    console.log('Filtered products:', filtered);
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchProducts} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-header">
            <h2>Shop by Category</h2>
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h2>
              {selectedCategory === 'all' ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              <span className="product-count">({filteredProducts.length})</span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;