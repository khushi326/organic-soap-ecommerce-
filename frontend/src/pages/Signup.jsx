import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-color)'}}>Create Account</h2>
      {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Sign Up</button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1.5rem'}}>
        Already have an account? <Link to="/login" style={{color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: 'bold'}}>Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
