import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurants as initialRestaurants } from '../../data/restaurants';
import type { Restaurant } from '../../data/restaurants';
import { subscriptions as initialSubscriptions } from '../../data/subscriptions';
import type { Subscription } from '../../data/subscriptions';
import { payments as initialPayments } from '../../data/payments';
import type { Payment } from '../../data/payments';
import { invoices as initialInvoices } from '../../data/invoices';
import type { Invoice } from '../../data/invoices';
import {
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaFileInvoice,
  FaChartLine,
  FaHeadset,
  FaCalendarAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';
import AdminLayout from '../../admin/components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    subscriptionTier: 'basic' as 'basic' | 'premium' | 'enterprise',
    subscriptionExpiry: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
  });

  useEffect(() => {
    if (!user || user.role !== 'superadmin') navigate('/admin');
  }, [navigate, user]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      setActiveTab(hash);
    };
    if (!window.location.hash) {
      window.location.hash = 'dashboard';
    } else {
      handleHashChange();
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;
    if (name === 'phone') {
      filteredValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [name]: filteredValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRestaurant) {
      setRestaurants(prev =>
        prev.map(r => r.id === editingRestaurant.id ? { ...r, ...formData } : r)
      );
      setEditingRestaurant(null);
    } else {
      const newRestaurant: Restaurant = {
        id: Date.now().toString(),
        ...formData,
      };
      setRestaurants(prev => [...prev, newRestaurant]);
    }
    setFormData({ name: '', address: '', phone: '', subscriptionTier: 'basic', subscriptionExpiry: '', status: 'active' });
    setShowAddForm(false);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      subscriptionTier: restaurant.subscriptionTier,
      subscriptionExpiry: restaurant.subscriptionExpiry,
      status: restaurant.status,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
  };

  const cancelEdit = () => {
    setEditingRestaurant(null);
    setFormData({ name: '', address: '', phone: '', subscriptionTier: 'basic', subscriptionExpiry: '', status: 'active' });
    setShowAddForm(false);
  };

  const methodCounts = payments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const methods = Object.keys(methodCounts);
  const maxCount = Math.max(...Object.values(methodCounts));

  return (
    <AdminLayout title="Super Admin Dashboard">
      <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header */}
        <div className="mb-4">
          <h1 className="display-6 fw-bold text-primary">Super Admin Dashboard</h1>
        </div>


        {/* Tab Content */}
        {activeTab === 'restaurants' && (
          <div>
            {/* Header */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">Restaurant Management</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <FaPlus className="me-2" />
                Add Restaurant
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="card mb-4">
                <div className="card-body">
                  <h5>{editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Subscription Tier</label>
                        <select
                          className="form-control"
                          name="subscriptionTier"
                          value={formData.subscriptionTier}
                          onChange={handleInputChange}
                        >
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="subscriptionExpiry"
                          value={formData.subscriptionExpiry}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">

                        <label className="form-label">Status</label>
                        

                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button type="submit" className="btn btn-success me-2">
                        {editingRestaurant ? 'Update' : 'Add'} Restaurant
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Restaurants List */}
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold d-flex align-items-center">
                  <FaBuilding className="me-2 text-primary" /> Restaurants
                </h5>
                <span className="badge bg-primary">{restaurants.length} restaurants</span>
              </div>

              <div className="row">
                {restaurants.map(restaurant => (
                  <div key={restaurant.id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title">{restaurant.name}</h6>
                        <p className="card-text">

                          <FaMapMarkerAlt className="me-2" />
                          {restaurant.address}
                        </p>
                        <p className="card-text">
                          <FaPhone className="me-2" />
                          {restaurant.phone}
                        </p>
                        <p className="card-text">
                          <span className={`badge ${restaurant.status === 'active' ? 'bg-success' : restaurant.status === 'inactive' ? 'bg-warning' : 'bg-danger'}`}>
                            {restaurant.status}
                          </span>
                          <span className="badge bg-info ms-2">{restaurant.subscriptionTier}</span>
                        </p>
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(restaurant)}
                          >
                            <FaEdit />
                          </button>


                          <button
                            className="btn btn-sm btn-outline-danger"

                            onClick={() => handleDelete(restaurant.id)}

                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'subscriptions' && (
          <div>
            <h2 className="h4 mb-4">Subscription Management</h2>
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Tier</th>
                      <th>Price</th>
                      <th>Billing Cycle</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map(sub => {
                      const restaurant = restaurants.find(r => r.id === sub.restaurantId);
                      return (
                        <tr key={sub.id}>
                          <td>{restaurant?.name || 'Unknown'}</td>
                          <td><span className="badge bg-primary">{sub.tier}</span></td>
                          <td>₹{sub.price}</td>
                          <td>{sub.billingCycle}</td>
                          <td>{sub.startDate}</td>
                          <td>{sub.endDate}</td>
                          <td>
                            <span className={`badge ${sub.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h2 className="h4 mb-4">Payment Management</h2>
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => {
                      const restaurant = restaurants.find(r => r.id === payment.restaurantId);
                      return (
                        <tr key={payment.id}>
                          <td>{restaurant?.name || 'Unknown'}</td>
                          <td>₹{payment.amount}</td>
                          <td>{payment.date}</td>
                          <td>{payment.method}</td>
                          <td>
                            <span className={`badge ${payment.status === 'completed' ? 'bg-success' : payment.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <h2 className="h4 mb-4">Invoice Management</h2>
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(invoice => {
                      const restaurant = restaurants.find(r => r.id === invoice.restaurantId);
                      return (
                        <tr key={invoice.id}>
                          <td>{restaurant?.name || 'Unknown'}</td>
                          <td>₹{invoice.amount}</td>
                          <td>{invoice.dueDate}</td>
                          <td>
                            <span className={`badge ${invoice.status === 'paid' ? 'bg-success' : invoice.status === 'unpaid' ? 'bg-warning' : 'bg-danger'}`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td>{invoice.items.length} items</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="h4 mb-4">Global Analytics</h2>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0 fw-bold">Revenue Overview</h5>
                  </div>
                  <div className="card-body">
                    <svg width="100%" height="300" viewBox="0 0 400 300">
                      {/* Grid lines */}
                      {[0, 50, 100, 150, 200].map((val, i) => (
                        <g key={val}>
                          <line x1="50" y1={250 - (val / 200) * 180} x2="350" y2={250 - (val / 200) * 180} stroke="#e9ecef" strokeWidth="1" />
                          <text x="35" y={255 - (val / 200) * 180} textAnchor="end" fill="#666" fontSize="10">₹{val}</text>
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1="50" y1="250" x2="350" y2="250" stroke="#333" strokeWidth="2" />
                      <line x1="50" y1="250" x2="50" y2="40" stroke="#333" strokeWidth="2" />
                      {/* Bars */}
                      <rect x="120" y="150" width="60" height="100" fill="#007bff" rx="4" />
                      <text x="150" y="200" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">₹{payments.reduce((sum, p) => sum + p.amount, 0)}</text>
                      <text x="150" y="270" textAnchor="middle" fill="#333" fontSize="12">Total Revenue</text>
                      {/* Labels */}
                      <text x="200" y="275" fill="#333" fontSize="12" fontWeight="bold">Revenue</text>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0 fw-bold">Subscription Status</h5>
                  </div>
                  <div className="card-body">
                    <svg width="100%" height="300" viewBox="0 0 400 300">
                      {/* Grid lines */}
                      {[0, 20, 40, 60, 80, 100].map((val, i) => (
                        <g key={val}>
                          <line x1="50" y1={250 - (val / 100) * 180} x2="350" y2={250 - (val / 100) * 180} stroke="#e9ecef" strokeWidth="1" />
                          <text x="35" y={255 - (val / 100) * 180} textAnchor="end" fill="#666" fontSize="10">{val}</text>
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1="50" y1="250" x2="350" y2="250" stroke="#333" strokeWidth="2" />
                      <line x1="50" y1="250" x2="50" y2="40" stroke="#333" strokeWidth="2" />
                      {/* Bars */}
                      <rect x="100" y="130" width="50" height="120" fill="#28a745" rx="4" />
                      <text x="125" y="190" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{subscriptions.filter(s => s.status === 'active').length}</text>
                      <text x="125" y="270" textAnchor="middle" fill="#333" fontSize="12">Active</text>
                      <rect x="200" y="150" width="50" height="100" fill="#dc3545" rx="4" />
                      <text x="225" y="200" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{subscriptions.filter(s => s.status !== 'active').length}</text>
                      <text x="225" y="270" textAnchor="middle" fill="#333" fontSize="12">Inactive</text>
                      {/* Labels */}
                      <text x="200" y="275" fill="#333" fontSize="12" fontWeight="bold">Subscriptions</text>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mb-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0 fw-bold">Payment Methods Distribution</h5>
                  </div>
                  <div className="card-body">
                    <svg width="100%" height="350" viewBox="0 0 600 350">
                      {/* Grid lines */}
                      {[0, 10, 20, 30, 40, 50].map((val, i) => (
                        <g key={val}>
                          <line x1="60" y1={300 - (val / 50) * 200} x2="540" y2={300 - (val / 50) * 200} stroke="#e9ecef" strokeWidth="1" />
                          <text x="45" y={305 - (val / 50) * 200} textAnchor="end" fill="#666" fontSize="10">{val}</text>
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1="60" y1="300" x2="540" y2="300" stroke="#333" strokeWidth="2" />
                      <line x1="60" y1="300" x2="60" y2="80" stroke="#333" strokeWidth="2" />
                      {/* Data */}
                      {methods.map((method, i) => {
                        const count = methodCounts[method];
                        const barHeight = (count / maxCount) * 200;
                        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];
                        return (
                          <g key={method}>
                            <rect x={80 + i * 80} y={300 - barHeight} width="50" height={barHeight} fill={colors[i % colors.length]} rx="4" />
                            <text x={105 + i * 80} y={290 - barHeight} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{count}</text>
                            <text x={105 + i * 80} y="320" textAnchor="middle" fill="#333" fontSize="12">{method}</text>
                          </g>
                        );
                      })}
                      {/* Legend */}
                      <g transform="translate(450, 50)">
                        <text x="0" y="0" fill="#333" fontSize="12" fontWeight="bold">Legend</text>
                        {methods.map((method, i) => {
                          const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];
                          return (
                            <g key={method} transform={`translate(0, ${20 + i * 15})`}>
                              <rect x="0" y="-10" width="10" height="10" fill={colors[i % colors.length]} />
                              <text x="15" y="0" fill="#333" fontSize="10">{method}</text>
                            </g>
                          );
                        })}
                      </g>
                      {/* Labels */}
                      <text x="300" y="335" fill="#333" fontSize="12" fontWeight="bold">Payment Methods</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="h4 mb-4">Dashboard Overview</h2>
            <div className="row g-4 mb-5">
              {[
                { icon: <FaBuilding />, label: 'Total Restaurants', value: restaurants.length, color: '#FF6B00' },
                { icon: <FaMoneyBillWave />, label: 'Total Revenue', value: `₹${payments.reduce((sum, p) => sum + p.amount, 0)}`, color: '#00B050' },
                { icon: <FaCreditCard />, label: 'Completed Payments', value: payments.filter(p => p.status === 'completed').length, color: '#FF9500' },
                { icon: <FaFileInvoice />, label: 'Paid Invoices', value: invoices.filter(i => i.status === 'paid').length, color: '#17A2B8' },
                { icon: <FaCalendarAlt />, label: 'Total Subscriptions', value: subscriptions.length, color: '#DC3545' },
                { icon: <FaCalendarAlt />, label: 'Active Subscriptions', value: subscriptions.filter(s => s.status === 'active').length, color: '#28A745' },
                { icon: <FaCreditCard />, label: 'Pending Payments', value: payments.filter(p => p.status === 'pending').length, color: '#FFC107' },
                { icon: <FaFileInvoice />, label: 'Unpaid Invoices', value: invoices.filter(i => i.status === 'unpaid').length, color: '#6C757D' },
              ].map((card, i) => (
                <div className="col-6 col-md-3" key={i}>
                  <div
                    className="card shadow-sm border-0 h-100 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)`,
                      color: 'white',
                      borderRadius: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="card-body">
                      <div className="fs-1 mb-3">{card.icon}</div>
                      <h3 className="fw-bold mb-1">{card.value}</h3>
                      <p className="mb-0">{card.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div>
            <h2 className="h4 mb-4">Support Center</h2>
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
              <div className="text-center py-5">
                <FaHeadset size={50} className="text-muted mb-3" />
                <h5>Support Features</h5>
                <p className="text-muted">Support ticket management and customer service tools would be implemented here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;