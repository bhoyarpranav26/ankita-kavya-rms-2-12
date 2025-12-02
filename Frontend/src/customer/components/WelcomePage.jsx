import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import { useAuth } from '../../context/AuthContext'

const WelcomePage = () => {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const handleStart = () => {
    setShowAuthModal(true)
  }

  const handleCloseAuth = () => {
    setShowAuthModal(false)
  }

  const handleSwitchToSignup = () => {
    setAuthMode('signup')
  }

  const handleSwitchToLogin = () => {
    setAuthMode('login')
  }

  const handleLogin = (email, password) => {
    // This function is now called from Login component with (token, user)
    // but keep a fallback behavior if email/password are provided instead
    (async () => {
      try {
        if (typeof email === 'string' && typeof password === 'object') {
          // Called as onLogin(token, user)
          const token = email
          const user = password
          // store token
          if (token) localStorage.setItem('token', token)
          if (user) localStorage.setItem('user', JSON.stringify(user))
          setShowAuthModal(false)
          navigate('/Category')
          return
        }

        // Fallback: if called with email/password strings, attempt login
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Login failed')
        if (data.token) localStorage.setItem('token', data.token)
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
        setShowAuthModal(false)
        navigate('/Category')
      } catch (err) {
        alert(err.message || 'Login failed')
      }
    })()
  }

  const handleSignup = (userData) => {
    // After OTP verification, Signup component will call this with the user's data
    // Attempt to login automatically using provided credentials
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userData.email, password: userData.password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Auto-login failed')
        if (data.token) localStorage.setItem('token', data.token)
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
        setShowAuthModal(false)
        navigate('/Category')
      } catch (err) {
        alert(err.message || 'Signup succeeded but auto-login failed. Please login manually.')
      }
    })()
  }
 
  return (
    <div
      className="relative d-flex flex-column justify-content-center align-items-center vh-100 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #fffaf4, #fff3e0)',
        color: '#333',
      }}
    >
      {/* 🌟 Floating Stars Background */}
      {/* <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="star absolute text-warning opacity-50"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 18 + 8}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div> */}
 
      {/* Logo */}
      <img
        src="/assets/images/Logo.png"
        alt="Logo"
        className="mb-4"
        style={{
          width: '220px',
          height: '80px',
          objectFit: 'contain',
          marginBottom: '40px',
        }}
      />
 
      {/* Tagline */}
      <p
        className="text-danger fw-semibold mb-3"
        style={{
          fontSize: '16px',
          letterSpacing: '0.5px',
        }}
      >
        Authentic Flavors Delivered
      </p>
 
      {/* Description */}
      <p
        className="text-muted mb-4"
        style={{
          maxWidth: '320px',
          fontSize: '15px',
          lineHeight: '1.6',
        }}
      >
      Experience the finest culinary delights from our kitchen to your table — fresh, fast, and bursting with flavor.
      </p>
 
      {/* Button */}
      <button
        className="btn text-white px-5 py-2 fw-semibold"
        style={{
          background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
          borderRadius: '25px',
          boxShadow: '0px 4px 10px rgba(255, 107, 0, 0.3)',
          fontSize: '15px',
        }}
        onClick={handleStart}
      >
        Ready to Order
      </button>
 
      {/* Auth Modal */}
      {showAuthModal && (
        authMode === 'login' ? (
          <Login
            onClose={handleCloseAuth}
            onSwitchToSignup={handleSwitchToSignup}
            onLogin={handleLogin}
          />
        ) : (
          <Signup
            onClose={handleCloseAuth}
            onSwitchToLogin={handleSwitchToLogin}
            onSignup={handleSignup}
          />
        )
      )}

      {/* ⭐ Floating Stars Animation CSS */}
      <style>{`
        // @keyframes float {
        //   0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
        //   25% { transform: translate(-10px, 10px) scale(1.1); opacity: 0.6; }
        //   50% { transform: translate(10px, -10px) scale(0.9); opacity: 0.5; }
        //   75% { transform: translate(-5px, 5px) scale(1.05); opacity: 0.7; }
        //   100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
        // }

        // .star {
        //   position: absolute;
        //   animation: float infinite ease-in-out;
        //   color: gold;
        //   text-shadow: 0 0 6px rgba(255, 215, 0, 0.8);
        //   pointer-events: none;
        //   user-select: none;
        // }
      `}</style>
    </div>
  )
}
 
export default WelcomePage