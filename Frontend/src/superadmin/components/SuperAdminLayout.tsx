import React, { useState, useEffect } from 'react';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import SuperAdminSidebar from './SuperAdminSidebar';
import './SuperAdminLayout.css';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Detect window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    setShowProfileMenu(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`super-admin-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* 🔹 Navbar */}
      <nav className="super-admin-navbar navbar navbar-expand-lg navbar-light bg-light" style={{
        background: 'linear-gradient(90deg, #f8f9fa, #e9ecef)',
        position: 'sticky',
        top: 0,
        zIndex: 1020,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #dee2e6'
      }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <button
            className="btn btn-link text-dark border-0 me-3 d-lg-none"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            style={{
              fontSize: '1.2rem',
              padding: '0.5rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ☰
          </button>

          {!isMobile && <span className="navbar-brand mb-0 fw-bold"></span>}

          <div className="d-flex align-items-center flex-grow-1 justify-content-center">
            {title && (
              <h5 className="text-dark mb-0 d-none d-md-block fw-semibold">{title}</h5>
            )}
          </div>

          {/* User Profile Section */}
          <div className="d-flex align-items-center position-relative profile-menu-container">
            <button
              className="btn btn-link text-dark border-0 d-flex align-items-center gap-2"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                textDecoration: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaUserCircle size={24} />
              <span className="d-none d-md-inline fw-semibold">Super Admin</span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div
                className="position-absolute bg-white shadow-lg rounded-3 border-0"
                style={{
                  top: '100%',
                  right: 0,
                  minWidth: '200px',
                  zIndex: 1050,
                  marginTop: '8px'
                }}
              >
                <div className="p-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <FaUserCircle size={32} className="text-primary" />
                    <div>
                      <div className="fw-semibold text-dark">Super Administrator</div>
                      <small className="text-muted">superadmin@restom.com</small>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-dark">
                    <FaUserCircle size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-dark">
                    <FaBars size={16} />
                    <span>Account Settings</span>
                  </button>
                </div>

                <div className="border-top">
                  <button className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger">
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🔹 Sidebar */}
      <SuperAdminSidebar
        onToggle={setSidebarCollapsed}
        isOpen={isMobile ? sidebarOpen : true}
      />

      {/* 🔹 Overlay for Mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1030
          }}
        />
      )}


      {/* 🔹 Main Content */}
      <main
        className={`super-admin-main ${
          sidebarCollapsed ? 'sidebar-collapsed' : ''
        } ${sidebarOpen ? 'sidebar-open' : ''}`}
      >
        {children}
      </main>
    </div>
  );
};

export default SuperAdminLayout;