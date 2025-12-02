import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orders } from '../../data/orders'
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'
import AdminLayout from '../components/AdminLayout'

const Reports: React.FC = () => {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  })

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated')
    if (!isAuthenticated) {
      navigate('/admin')
    }
  }, [navigate])

  // Filter orders by date range (mock implementation)
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.orderTime).toISOString().split('T')[0]
    return orderDate >= dateRange.start && orderDate <= dateRange.end
  })

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = filteredOrders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    const data = {
      dateRange,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      orders: filteredOrders
    }

    if (format === 'pdf') {
      console.log('Exporting PDF:', data)
      alert('PDF export functionality would be implemented here')
    } else {
      console.log('Exporting Excel:', data)
      alert('Excel export functionality would be implemented here')
    }
  }

  return (
    <AdminLayout title="Sales Reports">
      <div className="container-fluid mt-4" style={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold text-primary mb-4">
              Sales Reports
            </h1>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Date Range</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="start" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="start"
                      name="start"
                      value={dateRange.start}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="end" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="end"
                      name="end"
                      value={dateRange.end}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Export Options</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleExport('pdf')}
                  >
                    <FaFilePdf className="me-2" />
                    Export as PDF
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => handleExport('excel')}
                  >
                    <FaFileExcel className="me-2" />
                    Export as Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h3 className="fw-bold text-primary">{totalOrders}</h3>
                <p className="text-muted mb-0">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h3 className="fw-bold text-success">
                  ₹{totalRevenue.toFixed(2)}
                </h3>
                <p className="text-muted mb-0">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h3 className="fw-bold text-info">
                  ₹{averageOrderValue.toFixed(2)}
                </h3>
                <p className="text-muted mb-0">Average Order Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Report */}
        <div className="row">
  <div className="col-12">
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-semibold">Detailed Sales Report</h5>
        <span className="badge bg-light text-dark fw-semibold">
          {filteredOrders.length} Orders
        </span>
      </div>

      <div className="card-body">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">
              No orders found for the selected date range.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td className="fw-bold">{order.id}</td>
                      <td>{new Date(order.orderTime).toLocaleDateString()}</td>
                      <td>
                        <div>
                          <div className="fw-bold">{order.customerName}</div>
                          <small className="text-muted">{order.customerEmail}</small>
                        </div>
                      </td>
                      <td>
                        {order.items.map(item => (
                          <div key={item.id} className="small">
                            {item.name} <span className="text-muted">x{item.quantity}</span>{' '}
                            {item.spiceLevel && (
                              <span className="badge bg-warning text-dark ms-1">
                                {item.spiceLevel}
                              </span>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="fw-bold text-success">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === 'Served'
                              ? 'bg-success'
                              : order.status === 'Preparing'
                              ? 'bg-info text-white'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="d-md-none">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-3 mb-3 bg-white rounded shadow-sm"
                  style={{
                    borderLeft: '5px solid #0d6efd',
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-bold text-dark">{order.customerName}</div>
                      <small className="text-muted">{order.customerEmail}</small>
                    </div>
                    <div>
                      <span
                        className={`badge ${
                          order.status === 'Served'
                            ? 'bg-success'
                            : order.status === 'Preparing'
                            ? 'bg-info text-white'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 small text-muted">
                    Date: {new Date(order.orderTime).toLocaleDateString()}
                  </div>

                  <div className="mt-2">
                    {order.items.map(item => (
                      <div key={item.id} className="d-flex align-items-center small">
                        <span className="me-2 text-dark">{item.name}</span>
                        <span className="badge bg-light text-dark me-2">
                          x{item.quantity}
                        </span>
                        {item.spiceLevel && (
                          <span className="badge bg-warning text-dark">
                            {item.spiceLevel}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-success">
                      ₹{order.total.toFixed(2)}
                    </span>
                    <span className="text-muted small">#{order.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
</div>

      </div>
    </AdminLayout>
  )
}

export default Reports