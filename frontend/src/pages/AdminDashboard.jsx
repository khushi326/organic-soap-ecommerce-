import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [{ data: pData }, { data: oData }] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders', config)
        ]);
        setProducts(pData);
        setOrders(oData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user, navigate]);

  return (
    <div>
      <h2 style={{marginBottom: '2rem'}}>Admin Dashboard</h2>
      
      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <h3>Products ({products.length})</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: 'var(--card-bg)'}}>
              <thead>
                <tr style={{background: 'var(--primary-color)', color: 'white', textAlign: 'left'}}>
                  <th style={{padding: '1rem'}}>Name</th>
                  <th style={{padding: '1rem'}}>Price</th>
                  <th style={{padding: '1rem'}}>Category</th>
                  <th style={{padding: '1rem'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{borderBottom: '1px solid #ddd'}}>
                    <td style={{padding: '1rem'}}>{product.name}</td>
                    <td style={{padding: '1rem'}}>${product.price}</td>
                    <td style={{padding: '1rem'}}>{product.category}</td>
                    <td style={{padding: '1rem'}}>
                      <button className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3>Orders ({orders.length})</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: 'var(--card-bg)'}}>
              <thead>
                <tr style={{background: 'var(--primary-color)', color: 'white', textAlign: 'left'}}>
                  <th style={{padding: '1rem'}}>Order ID</th>
                  <th style={{padding: '1rem'}}>User</th>
                  <th style={{padding: '1rem'}}>Total</th>
                  <th style={{padding: '1rem'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{borderBottom: '1px solid #ddd'}}>
                    <td style={{padding: '1rem'}}>{order._id}</td>
                    <td style={{padding: '1rem'}}>{order.user?.name || 'Guest'}</td>
                    <td style={{padding: '1rem'}}>${order.totalAmount}</td>
                    <td style={{padding: '1rem'}}>
                      <span style={{padding: '0.25rem 0.5rem', background: order.status === 'Pending' ? '#f39c12' : '#27ae60', color: 'white', borderRadius: '4px', fontSize: '0.875rem'}}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
