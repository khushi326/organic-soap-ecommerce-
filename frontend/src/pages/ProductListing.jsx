import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import soap1 from '../assets/soap1.jpg';
import soap2 from '../assets/soap2.jpg';
import soap3 from '../assets/soap3.jpg';
import soap4 from '../assets/soap4.jpg';

const ProductListing = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Soap Images
  const soapImages = [soap1, soap2, soap3, soap4];
  
  const soapNames = [
    "Chandan Glow",
    "Neem Tulsi Fresh",
    "Rose Sandal Luxury",
    "Herbal Freshness"
  ];

  // ✅ Categories
  const soapCategories = [
    "Ayurvedic Care",
    "Herbal Freshness",
    "Luxury Bath",
    "Deep Cleansing"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>

      <h2 style={{ marginBottom: '2rem' }}>
        All Organic Soaps
      </h2>

      <div className="product-grid">

        {products.map((product, index) => (

          <div key={product._id} className="product-card">

            {/* ✅ Soap Image */}
            <img
              src={soapImages[index]}
              alt={soapNames[index]}
              className="product-image"
            />

            <div className="product-info">

              {/* ✅ Custom Soap Name */}
              <h3 className="product-title">
                {soapNames[index]}
              </h3>

              {/* ✅ Custom Category */}
              <p
                style={{
                  color: '#666',
                  marginBottom: '1rem',
                  flex: 1
                }}
              >
                {soapCategories[index]}
              </p>

              <p className="product-price">
                ${product.price}
              </p>

              <Link
                to={`/product/${product._id}`}
                className="btn btn-primary"
                style={{
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                View Product
              </Link>

            </div>
          </div>

        ))}

      </div>
    </div>
  );
};

export default ProductListing;