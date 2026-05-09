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
  
  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user, navigate]);

  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingProductId) {
        await axios.put(`/api/products/${editingProductId}`, productForm, config);
        alert('Product updated successfully!');
      } else {
        await axios.post('/api/products', productForm, config);
        alert('Product added successfully!');
      }
      setShowProductForm(false);
      setEditingProductId(null);
      setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error saving product', err);
      alert('Error saving product');
    }
  };

  const editProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock || 0
    });
    setShowProductForm(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/products/${id}`, config);
      alert('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product', err);
      alert('Error deleting product');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status', err);
      alert('Error updating order status');
    }
  };

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
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Products ({products.length})</h3>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowProductForm(!showProductForm);
                if (showProductForm) {
                  setEditingProductId(null);
                  setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
                }
              }}
            >
              {showProductForm ? 'Cancel' : 'Add New Product'}
            </button>
          </div>

          {showProductForm && (
            <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', marginTop: '1rem', border: '1px solid #ddd' }}>
              <h4>{editingProductId ? 'Edit Product' : 'Add Product'}</h4>
              <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" name="name" placeholder="Product Name" value={productForm.name} onChange={handleProductChange} required className="form-input" style={{padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc'}} />
                <textarea name="description" placeholder="Description" value={productForm.description} onChange={handleProductChange} required className="form-input" style={{padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px'}} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleProductChange} required className="form-input" style={{flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc'}} />
                  <input type="number" name="stock" placeholder="Stock Quantity" value={productForm.stock} onChange={handleProductChange} required className="form-input" style={{flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc'}} />
                </div>
                <input type="text" name="category" placeholder="Category" value={productForm.category} onChange={handleProductChange} required className="form-input" style={{padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc'}} />
                <input type="text" name="image" placeholder="Image URL" value={productForm.image} onChange={handleProductChange} required className="form-input" style={{padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc'}} />
                <button type="submit" className="btn btn-primary" style={{alignSelf: 'flex-start'}}>
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </button>
              </form>
            </div>
          )}

          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: 'var(--card-bg)'}}>
              <thead>
                <tr style={{background: 'var(--primary-color)', color: 'white', textAlign: 'left'}}>
                  <th style={{padding: '1rem'}}>Name</th>
                  <th style={{padding: '1rem'}}>Price</th>
                  <th style={{padding: '1rem'}}>Stock</th>
                  <th style={{padding: '1rem'}}>Category</th>
                  <th style={{padding: '1rem'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{borderBottom: '1px solid #ddd'}}>
                    <td style={{padding: '1rem'}}>{product.name}</td>
                    <td style={{padding: '1rem'}}>${product.price}</td>
                    <td style={{padding: '1rem'}}>{product.stock || 0}</td>
                    <td style={{padding: '1rem'}}>{product.category}</td>
                    <td style={{padding: '1rem'}}>
                      <button onClick={() => editProduct(product)} className="btn btn-secondary" style={{padding: '0.5rem 1rem', marginRight: '0.5rem'}}>Edit</button>
                      <button onClick={() => deleteProduct(product._id)} className="btn" style={{padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
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
                  <th style={{padding: '1rem'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{borderBottom: '1px solid #ddd'}}>
                    <td style={{padding: '1rem'}}>{order._id}</td>
                    <td style={{padding: '1rem'}}>{order.user?.name || 'Guest'}</td>
                    <td style={{padding: '1rem'}}>${order.totalAmount}</td>
                    <td style={{padding: '1rem'}}>
                      <span style={{padding: '0.25rem 0.5rem', background: order.status === 'Pending' ? '#f39c12' : order.status === 'Delivered' ? '#27ae60' : order.status === 'Cancelled' ? '#e74c3c' : '#3498db', color: 'white', borderRadius: '4px', fontSize: '0.875rem'}}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer'}}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
