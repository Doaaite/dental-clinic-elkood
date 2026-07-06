import React from 'react';
import { Navbar, Container, Badge } from 'react-bootstrap';
import { FaTooth, FaBell, FaUserCircle } from 'react-icons/fa';

const NavbarComponent = () => {
  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container>
        <Navbar.Brand className="brand-logo">
          <FaTooth className="logo-icon" />
          <span className="brand-text">عيادة الأسنان</span>
          <Badge bg="light" text="dark" className="brand-badge">
            ELKOOD
          </Badge>
        </Navbar.Brand>
        
        <div className="nav-actions">
          <FaBell className="nav-icon" />
          <FaUserCircle className="nav-icon user-icon" />
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;