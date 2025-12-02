import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaTimes, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa'

const OrderTrackingPopup: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)

  useEffect(() => {
    // Check if user just completed payment (came from payment page)
    const shouldShowPopup = sessionStorage.getItem('showOrderPopup') === 'true'
    const orderTotal = parseFloat(sessionStorage.getItem('orderTotal') || '0')

    if (shouldShowPopup && orderTotal > 0) {
      // Create a mock order with the actual total from payment
      const mockOrder = {
        id: 'FF' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'Pending',
        total: orderTotal
      }
      setCurrentOrder(mockOrder)
      setIsVisible(true)
      sessionStorage.removeItem('showOrderPopup')
    }
  }, [location.pathname])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleTrackOrder = () => {
    navigate('/order-tracking')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#FFA500'
      case 'Preparing': return '#FF6B00'
      case 'Served': return '#28a745'
      default: return '#6c757d'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return '⏳'
      case 'Preparing': return '👨‍🍳'
      case 'Served': return '✅'
      default: return '📦'
    }
  }

  if (!isVisible || !currentOrder) return null

  return (
    <div
      className="position-fixed"
      style={{
        top: '20px',
        right: '20px',
        zIndex: 1050,
        width: '320px'
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          borderRadius: '12px',
          background: 'white',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <div className="card-header d-flex justify-content-between align-items-center py-3"
             style={{
               background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
               color: 'white',
               borderRadius: '12px 12px 0 0'
             }}>
          <div className="d-flex align-items-center">
            <FaMapMarkerAlt className="me-2" />
            <span className="fw-bold">Order Tracking</span>
          </div>
          <button
            className="btn btn-sm p-0"
            onClick={handleClose}
            style={{ color: 'white', border: 'none', background: 'transparent' }}
          >
            <FaTimes />
          </button>
        </div>

        <div className="card-body p-3">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Order ID</span>
              <span className="fw-bold" style={{ fontSize: '12px' }}>{currentOrder.id}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Status</span>
              <div className="d-flex align-items-center">
                <span className="me-1">{getStatusIcon(currentOrder.status)}</span>
                <span
                  className="badge fw-semibold"
                  style={{
                    backgroundColor: getStatusColor(currentOrder.status),
                    color: 'white',
                    fontSize: '10px'
                  }}
                >
                  {currentOrder.status}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">Total</span>
              <span className="fw-bold" style={{ color: '#FF6A00' }}>₹{currentOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn btn-sm w-100 fw-semibold"
            onClick={handleTrackOrder}
            style={{
              background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          >
            <FaMapMarkerAlt className="me-2" />
            Track Order
          </button>
        </div>
      </div>

      <style>
        {`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        `}
      </style>
    </div>
  )
}

export default OrderTrackingPopup