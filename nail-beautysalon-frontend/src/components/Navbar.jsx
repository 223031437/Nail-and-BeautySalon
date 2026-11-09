import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { homePathFor } from "./ProtectedRoute";

function NavigationBar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const portalLabel = user?.role === "ROLE_ADMIN" ? "Admin Dashboard" : user?.role === "ROLE_EMPLOYEE" ? "Employee Dashboard" : "My Account";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="salon-navbar" sticky="top">
      <Container>

        {/* Brand */}
        <Navbar.Brand as={Link} to="/">
          <span className="brand-name">NAIL & BEAUTY</span>
          <span className="brand-subtitle">SALON</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          
            {user && <Nav.Link as={Link} to={homePathFor(user.role)}>{portalLabel}</Nav.Link>}
          </Nav>

          <div className="nav-icons">
            <Link
              to={user ? homePathFor(user.role) : "/login"}
              className="nav-icon login-icon"
              title={user ? portalLabel : "Log in"}
              aria-label={user ? portalLabel : "Log in"}
            >
              <FaUser />
            </Link>

            <Link to="/cart" className="nav-icon cart-icon" title="Cart" aria-label={`Cart, ${cartCount} items`}>
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <Link to="/appointment" className="nav-icon book-icon" title="Book an appointment" aria-label="Book an appointment">
              <FaCalendarAlt />
            </Link>

            {user && (
              <button 
                type="button" 
                onClick={handleLogout} 
                className="nav-icon login-icon"
                style={{ border: 'none', cursor: 'pointer', background: 'transparent' }}
                title="Log out"
              >
                <FaSignOutAlt style={{ color: '#3d3532' }} />
              </button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;