import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import soap1 from '../assets/soap1.jpg';
import soap2 from '../assets/soap2.jpg';
import soap3 from '../assets/soap3.jpg';

const Home = () => {

  const [featured, setFeatured] = useState([]);

  // ✅ Soap Images
  const soapImages = [soap1, soap2, soap3];

  // ✅ Indian Soap Names
  const soapNames = [
    "Chandan Glow",
    "Neem Tulsi Fresh",
    "Rose Sandal Luxury"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setFeatured(data.slice(0, 3)); // Just show top 3 for now
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>

      <section className="hero">
        <h1>Pure, Natural, Organic.</h1>

        <p>
          Elevate your skincare routine with our handcrafted
          organic soaps, made from sustainably sourced ingredients
          for the ultimate clean.
        </p>

        <Link to="/products" className="btn btn-primary">
          Shop Collection
        </Link>
      </section>

      <section>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--primary-color)'
          }}
        >
          Featured Soaps
        </h2>

        <div className="product-grid">

          {featured.map((product, index) => (

            <div key={product._id} className="product-card">

              {/* ✅ Different image for each product */}
              <img
                src={soapImages[index]}
                alt={soapNames[index]}
                className="product-image"
              />

              <div className="product-info">

                {/* ✅ Custom Indian Names */}
                <h3 className="product-title">
                  {soapNames[index]}
                </h3>

                <p className="product-price">
                  ${product.price}
                </p>

                <Link
                  to={`/product/${product._id}`}
                  className="btn btn-secondary"
                  style={{
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}
                >
                  View Details
                </Link>

              </div>
            </div>

          ))}

        </div>
      </section>
    </div>
  );
};

export default Home;