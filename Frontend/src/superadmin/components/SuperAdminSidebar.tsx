import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUtensils,
  FaSignOutAlt,
} from "react-icons/fa";
import "./SuperAdminSidebar.css";
import { useAuth } from "../../context/AuthContext";

interface SuperAdminSidebarProps {
  onToggle?: (collapsed: boolean) => void;
  isOpen?: boolean;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ onToggle, isOpen = false }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  // ✅ Detect window resize to update mobile mode dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      // Toggle full sidebar visibility on mobile
      onToggle?.(!isOpen);
    } else {
      // Collapse on desktop
      const newCollapsed = !collapsed;
      setCollapsed(newCollapsed);
      onToggle?.(newCollapsed);
    }
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (isMobile) {
      onToggle?.(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const menuItems = [
    { path: "/admin/super-dashboard", icon: <FaTachometerAlt />, text: "Super Dashboard" },
    { path: "/", icon: <FaUtensils />, text: "Customer Menu" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`super-admin-sidebar ${collapsed ? "collapsed" : ""} ${
          isMobile && isOpen ? "open" : ""
        }`}
        style={{
          background: "linear-gradient(180deg, #fff8e1, #ffe082)",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          borderRight: "1px solid #ffe082",
          overflow: "hidden",
          zIndex: 1040,
        }}
      >
        {/* Header */}
        <div className="sidebar-header d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
          {!collapsed && (
            <h5 className="mb-0 fw-bold" style={{ color: "#8d6e63" }}>
              🍽️ Super Admin
            </h5>
          )}
          <button
            className="sidebar-toggle-btn btn btn-link text-dark border-0"
            onClick={toggleSidebar}
            style={{
              color: "#8d6e63",
              fontSize: "1.2rem",
              padding: "0.25rem 0.5rem",
            }}
          >
            <FaBars />
          </button>
        </div>

        {/* Menu */}
        <ul className="sidebar-menu list-unstyled mt-3 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`sidebar-link d-flex align-items-center ${
                  isActive(item.path) ? "active" : ""
                }`}
                style={{
                  color: isActive(item.path) ? "#ff6b35" : "#8d6e63",
                  textDecoration: "none",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  margin: "4px 6px",
                  backgroundColor: isActive(item.path)
                    ? "#fff3e0"
                    : "transparent",
                  transition: "all 0.3s ease",
                }}
              >
                <span className="me-3" style={{ fontSize: "1.1rem" }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="fw-medium sidebar-text">{item.text}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="sidebar-footer mt-auto p-3 border-top">
          <button
            onClick={handleLogout}
            className="logout-btn w-100 fw-semibold"
            style={{
              background: "#fff3e0",
              border: "1px solid #ffe082",
              borderRadius: "8px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8d6e63",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#ffe082")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#fff3e0")
            }
          >
            <FaSignOutAlt className="me-2" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobile && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => onToggle?.(false)}
          style={{
            position: "fixed",
            top: "56px",
            left: 0,
            width: "100%",
            height: "calc(100vh - 56px)",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1030,
          }}
        />
      )}
    </>
  );
};

export default SuperAdminSidebar;