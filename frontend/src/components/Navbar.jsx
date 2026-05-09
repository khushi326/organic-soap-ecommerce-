import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span style={{color: 'var(--accent-color)'}}>🌿</span> PureSoap
      </Link>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/products" className="nav-link">Shop All</Link>
      </div>

      <div className="nav-icons">
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-link" title="Admin Dashboard">
            <Shield size={20} />
          </Link>
        )}
        
        <Link to="/cart" className="cart-icon-wrapper">
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="cart-badge">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Link>
        
        {user ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{fontWeight: 500}}>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-color)'}}>
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-link">
            <User size={24} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
