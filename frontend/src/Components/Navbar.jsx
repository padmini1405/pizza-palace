import "../Styles/Navbar.css";
import { FiShoppingCart, FiMenu } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  const isAuthPage = location.pathname === "/";
  const isHomePage = location.pathname === "/home";

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutBox, setShowLogoutBox] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const isAdmin = userInfo && userInfo.role === "admin";

  useEffect(() => {
    if (userInfo) {
      setProfileData({
        name: userInfo.name,
        email: userInfo.email,
        password: "",
      });
    }
  }, []);

  // Closes dropdown when clicking anywhere else on the window
  useEffect(() => {
    const closeProfileDropdown = (e) => {
      if (!e.target.closest(".profile-wrapper")) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", closeProfileDropdown);
    return () => window.removeEventListener("click", closeProfileDropdown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutBox(false);
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Profile updated successfully");
        setShowEditModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToSection = (id) => {
    setShowSidebar(false);
    if (location.pathname !== "/home") {
      navigate(`/home#${id}`);
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`navbar ${isAuthPage ? "auth-navbar" : ""}`}>
        <div className="container nav-wrapper">

          {/* LEFT: Sidebar Toggle Icon (Mobile view only) */}
          {!isAuthPage && (
            <div className="mobile-menu-trigger" onClick={() => setShowSidebar(true)}>
              <FiMenu />
            </div>
          )}

          {/* BRAND LOGO */}
          <Link to="/home" className="logo">
            Pizza Palace
          </Link>

          {/* CENTER: Links Menu List */}
          {!isAdmin && !isAuthPage && (
            <ul className="nav-links-desktop">

              <li>
                <Link
                  to="/home"
                  className={location.pathname === "/home" ? "active-nav-link" : ""}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className={location.pathname === "/menu" ? "active-nav-link" : ""}
                >
                  Menu
                </Link>
              </li>

              <li>
                <Link
                  to="/my-orders"
                  className={location.pathname === "/my-orders" ? "active-nav-link" : ""}
                >
                  Orders
                </Link>
              </li>

              <li onClick={() => scrollToSection("about")}>
                About Us
              </li>
            </ul>
          )}

          {isAdmin && !isAuthPage && (
            <ul className="nav-links-desktop">
              <li><Link to="/admin-dashboard">Overview</Link></li>
              <li><Link to="/admin-pizzalist">Pizza List</Link></li>
              <li><Link to="/admin-orders">All Orders</Link></li>
            </ul>
          )}

          {/* RIGHT PANEL: Interface Actions */}
          {!isAuthPage && (
            <div className="nav-icons-wrapper">
              {!isAdmin && (
                <div className="cart-wrapper">
                  <Link to="/cart" className="icon-clickable-node">
                    <FiShoppingCart />
                  </Link>
                  {cart?.length > 0 && (
                    <span className="cart-badge">{cart.length}</span>
                  )}
                </div>
              )}

              <div className="profile-wrapper">
                <button
                  type="button"
                  className="profile-trigger-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                >
                  <FaUser />
                </button>

                {showDropdown && (
                  <div className="profile-dropdown-box">
                    <div className="dropdown-welcome-msg">
                      Welcome, <span>{userInfo?.name || "Guest"}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <button type="button" onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}>
                      View Profile
                    </button>
                    <button type="button" onClick={() => { setShowEditModal(true); setShowDropdown(false); }}>
                      Edit Profile
                    </button>
                    <button type="button" className="dropdown-logout-btn" onClick={() => { setShowLogoutBox(true); setShowDropdown(false); }}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </nav>

      {/* MOBILE SIDEBAR PANEL DRAWEROVERLAY */}
      <div className={`mobile-sidebar-drawer ${showSidebar ? "drawer-open" : ""}`}>
        <div className="drawer-header">
          {/* <h3>{isAdmin ? "Admin Panel" : "Navigation"}</h3> */}
          <button type="button" className="close-sidebar-btn" onClick={() => setShowSidebar(false)}>✕</button>
        </div>

        <ul className="sidebar-links-list">
          {/* CUSTOMER MOBILE LINKS */}
          {!isAdmin ? (
            <>
              <li><Link to="/home" onClick={() => setShowSidebar(false)}>Home</Link></li>
              <li><Link to="/menu" onClick={() => setShowSidebar(false)}>Menu</Link></li>
              <li><Link to="/my-orders" onClick={() => setShowSidebar(false)}>Orders</Link></li>
              <li onClick={() => scrollToSection("about")}>About Us</li>
            </>
          ) : (
            /* ADMIN MOBILE LINKS */
            <>
              <li>
                <Link to="/admin-dashboard" onClick={() => setShowSidebar(false)}>Overview</Link>
              </li>
              <li>
                <Link to="/admin-pizzalist" onClick={() => setShowSidebar(false)}>Pizza List</Link>
              </li>
              <li>
                <Link to="/admin-orders" onClick={() => setShowSidebar(false)}>All Orders</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      {showSidebar && <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)}></div>}

      {/* VIEW PROFILE MODAL */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-view-card-premium" onClick={(e) => e.stopPropagation()}>
            <div className="profile-card-header">
              <div className="profile-avatar-circle">
                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "P"}
              </div>
              <h2>Customer Profile</h2>
              <p className="profile-tagline">Pizza Palace Club Member</p>
            </div>
            <div className="profile-card-body">
              <div className="info-profile-field">
                <label>FULL NAME</label>
                <p>{userInfo?.name || "Customer Guest"}</p>
              </div>
              <div className="info-profile-field">
                <label>EMAIL ADDRESS</label>
                <p>{userInfo?.email || "guest@pizzapalace.com"}</p>
              </div>
            </div>
            <div className="profile-card-footer">
              <button type="button" className="btn-close-profile" onClick={() => setShowProfileModal(false)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="profile-modal-edit" onClick={(e) => e.stopPropagation()}>
            <h2>Update Profile Details</h2>
            <div className="edit-input-group">
              <input
                type="text"
                placeholder="Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password (Leave blank to keep same)"
                value={profileData.password}
                onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
              />
            </div>
            <div className="modal-buttons-action-row">
              <button type="button" className="btn-save-edit" onClick={handleUpdateProfile}>Save Changes</button>
              <button type="button" className="btn-cancel-edit" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutBox && (
        <div className="modal-overlay" onClick={() => setShowLogoutBox(false)}>
          <div className="logout-alert-box" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Sign Out</h3>
            <p>Are you sure you want to log out of your Pizza Palace account?</p>
            <div className="modal-buttons-action-row">
              <button type="button" className="btn-confirm-logout" onClick={handleLogout}>Logout</button>
              <button type="button" className="btn-cancel-logout" onClick={() => setShowLogoutBox(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;