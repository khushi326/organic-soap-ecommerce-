import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

import soap1 from '../assets/soap1.jpg';
import soap2 from '../assets/soap2.jpg';
import soap3 from '../assets/soap3.jpg';
import soap4 from '../assets/soap4.jpg';

const ProductDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [productIndex, setProductIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ SAME PRODUCTS AS LIST PAGE
  const products = [
    {
      id: "1",
      name: "Chandan Glow",
      image: soap1,
      category: "Ayurvedic Care",
      price: 12.99,
      description:
        "Natural sandalwood soap enriched with herbal oils for glowing and healthy skin."
    },
    {
      id: "2",
      name: "Neem Tulsi Fresh",
      image: soap2,
      category: "Herbal Freshness",
      price: 10.99,
      description:
        "Neem and tulsi soap that deeply cleanses and refreshes your skin naturally."
    },
    {
      id: "3",
      name: "Rose Sandal Luxury",
      image: soap3,
      category: "Luxury Bath",
      price: 14.99,
      description:
        "A premium rose sandal soap with luxurious fragrance and moisturizing care."
    },
    {
      id: "4",
      name: "Charcoal Detox",
      image: soap4,
      category: "Deep Cleansing",
      price: 11.99,
      description:
        "Activated charcoal soap for deep detoxification and oil control."
    }
  ];

  useEffect(() => {
    const fetchProductIndex = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const index = data.findIndex(p => p._id === id);
        setProductIndex(index !== -1 ? index : 0);
      } catch (err) {
        console.error(err);
        setProductIndex(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProductIndex();
  }, [id]);

  const handleAddToCart = () => {
    const product = products[productIndex];
    addToCart(
      {
        ...product,
        _id: id,
        quantity: 1
      },
      1
    );

    navigate('/cart');
  };

  if (loading) return <h2>Loading...</h2>;

  const product = products[productIndex];
  if (!product) return <h2>Product not found</h2>;

  return (

    <div
      style={{
        display: 'flex',
        gap: '4rem',
        marginTop: '2rem',
        alignItems: 'center'
      }}
    >

      <img
        src={product.image}
        alt={product.name}
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '500px',
          borderRadius: 'var(--border-radius)',
          objectFit: 'cover'
        }}
      />

      <div style={{ flex: 1 }}>

        <h2
          style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: 'var(--primary-color)'
          }}
        >
          {product.name}
        </h2>

        <p
          style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '1rem'
          }}
        >
          {product.category}
        </p>

        <p
          className="product-price"
          style={{ fontSize: '2rem' }}
        >
          ${product.price}
        </p>

        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            marginBottom: '2rem'
          }}
        >
          {product.description}
        </p>

        <button
          onClick={handleAddToCart}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem'
          }}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default ProductDetail;