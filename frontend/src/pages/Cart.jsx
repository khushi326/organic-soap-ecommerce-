import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

import soap1 from '../assets/soap1.jpg';
import soap2 from '../assets/soap2.jpg';
import soap3 from '../assets/soap3.jpg';
import soap4 from '../assets/soap4.jpg';

const Cart = () => {

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal
  } = useCart();

  const navigate = useNavigate();

  // ✅ Soap Images
  const soapImages = [soap1, soap2, soap3, soap4];

  // ✅ Soap Names
  const soapNames = [
    "Chandan Glow",
    "Neem Tulsi Fresh",
    "Rose Sandal Luxury",
    "Charcoal Detox"
  ];

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '4rem'
        }}
      >

        <h2>Your Cart is Empty</h2>

        <p style={{ margin: '1rem 0' }}>
          Looks like you haven't added any organic soaps yet.
        </p>

        <Link
          to="/products"
          className="btn btn-primary"
        >
          Start Shopping
        </Link>

      </div>
    );
  }

  return (

    <div>

      <h2 style={{ marginBottom: '2rem' }}>
        Shopping Cart
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '2rem'
        }}
      >

        {/* LEFT SIDE */}
        <div style={{ flex: 2 }}>

          {cartItems.map((item, index) => (

            <div
              key={item._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'var(--card-bg)',
                padding: '1rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow)'
              }}
            >

              {/* ✅ Soap Image */}
              <img
                src={item.image || soapImages[index % soapImages.length]}
                alt={item.name}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />

              {/* ✅ Product Info */}
              <div style={{ flex: 1 }}>

                <h3 style={{ marginBottom: '0.5rem' }}>
                  {item.name}
                </h3>

                <p
                  style={{
                    fontWeight: 'bold',
                    color: 'var(--secondary-color)'
                  }}
                >
                  ${item.price}
                </p>

              </div>

              {/* ✅ Quantity Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >

                <button
                  onClick={() =>
                    updateQuantity(item._id, item.quantity - 1)
                  }
                  style={{
                    padding: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Minus size={16} />
                </button>

                <span style={{ fontWeight: 'bold' }}>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item._id, item.quantity + 1)
                  }
                  style={{
                    padding: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </button>

              </div>

              {/* ✅ Delete Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                style={{
                  color: 'red',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <Trash2 size={24} />
              </button>

            </div>

          ))}

        </div>

        {/* RIGHT SIDE */}
        <div style={{ flex: 1 }}>

          <div
            style={{
              background: 'var(--card-bg)',
              padding: '2rem',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow)'
            }}
          >

            <h3 style={{ marginBottom: '1rem' }}>
              Order Summary
            </h3>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                fontSize: '1.2rem'
              }}
            >

              <span>Total</span>

              <span style={{ fontWeight: 'bold' }}>
                ${getCartTotal().toFixed(2)}
              </span>

            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;