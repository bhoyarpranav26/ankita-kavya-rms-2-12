import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaShoppingCart, FaUtensils } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
// import {lg} from 'Logo.png';
 
const Navbar: React.FC = () => {
  const { getTotalItems, cartAnimation } = useCart()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
 
  if (isAdminRoute) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/admin/dashboard">
            <FaUtensils className="me-2" />
            Restaurant Admin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/menu">Menu Management</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/analytics">Analytics</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/reports">Reports</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
 
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-0 position-sticky top-0" style={{ zIndex: 1000 }}>
      <div className="container d-flex justify-content-between align-items-center">
       
        {/* 🍴 Brand */}
        <Link className="navbar-brand fw-bold text-success fs-4 d-flex align-items-center" to="/">
          <img
            src="/assets/images/Logo.png"
            alt="Logo"
            className="me-2"
            style={{ width: '200px', height: '70px', objectFit: 'cover' }}
          />
          {/* <span className="text-primary">RestoM</span> */}
        </Link>
 
        {/* 🛒 Cart - aligned right */}
        <div className="d-none d-lg-flex align-items-center">
          {/* <Link
            to="/menu"
            className="me-4 text-dark fw-semibold nav-link"
            style={{ transition: 'color 0.3s' }}
          >
            Menu
          </Link> */}
          <Link
            to="/cart"
            className={`position-relative text-dark nav-link ${cartAnimation ? 'cart-bounce' : ''}`}
            style={{
              transition: 'transform 0.2s',
              background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white'
            }}
          >
            <FaShoppingCart size={22} className="me-1" />
            {getTotalItems() > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-dark fw-bold">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>
 
        {/* 📱 Mobile Cart (same design retained) */}
        <div className="d-lg-none">
          <Link
            className={`nav-link position-relative text-white ${cartAnimation ? 'cart-bounce' : ''}`}
            to="/cart"
            style={{
              background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          >
            <FaShoppingCart size={20} />
            {getTotalItems() > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-dark fw-bold">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
 
export default Navbar