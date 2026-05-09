import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { data } = await axios.post('/api/orders', {
        products: orderItems,
        shippingAddress,
        totalAmount: getCartTotal()
      }, config);
      
      clearCart();
      alert('Order Placed Successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{display: 'flex', gap: '4rem'}}>
      <div style={{flex: 2}}>
        <h2>Shipping Information</h2>
        <form onSubmit={handlePlaceOrder} style={{marginTop: '2rem'}}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" required onChange={handleChange} />
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>City</label>
              <input type="text" name="city" required onChange={handleChange} />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Postal Code</label>
              <input type="text" name="postalCode" required onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" required onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', fontSize: '1.2rem', padding: '1rem'}}>Place Order (${getCartTotal().toFixed(2)})</button>
        </form>
      </div>
      <div style={{flex: 1}}>
        <div style={{background: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)'}}>
          <h3 style={{marginBottom: '1rem'}}>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item._id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold'}}>
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
