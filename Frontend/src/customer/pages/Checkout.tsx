import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { FaCreditCard, FaMoneyBillWave, FaWallet } from 'react-icons/fa'

interface OrderData {
  name: string
  email: string
  phone: string
  address: string
  paymentMethod: string
}

const Checkout: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<OrderData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  })

  const deliveryFee = 2.99
  const tax = getTotalPrice() * 0.08
  const total = getTotalPrice() + deliveryFee + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    ;(async () => {
      try {
        const token = localStorage.getItem('token')
        const orderPayload = {
          restaurantId: 'default',
          items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity, spiceLevel: item.spiceLevel, subtotal: item.price * item.quantity })),
          total: total
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(orderPayload)
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Order failed')
        clearCart()
        navigate('/order-success', { state: { orderId: data.order._id } })
      } catch (err: any) {
        alert(err.message || 'Order failed')
      }
    })()
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 fw-bold text-center text-primary mb-5">Checkout</h1>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Customer Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={orderData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={orderData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={orderData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Delivery Address</label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows={3}
                      value={orderData.address}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Payment Method</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="card"
                      value="card"
                      checked={orderData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="card">
                      <FaCreditCard className="me-2" />
                      Credit Card
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="upi"
                      value="upi"
                      checked={orderData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="upi">
                      <FaMoneyBillWave className="me-2" />
                      UPI
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="wallet"
                      value="wallet"
                      checked={orderData.paymentMethod === 'wallet'}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="wallet">
                      <FaWallet className="me-2" />
                      Digital Wallet
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold text-primary fs-5">₹{total.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={handleSubmit}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout