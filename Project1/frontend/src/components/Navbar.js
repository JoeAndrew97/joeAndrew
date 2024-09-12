// Navbar.js
import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const NavbarComponent = ({ countries, handleCountrySelect }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Geo Factfile</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown
              title="Select Country"
              id="basic-nav-dropdown"
              className="scrollable-dropdown"
            >
              {countries.map((country) => (
                <NavDropdown.Item
                  key={country.isoCode}
                  onClick={() =>
                    handleCountrySelect(country.latitude, country.longitude)
                  }
                >
                  {country.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

// will need handleCountrySelect passing down as a prop e.g. const NavbarComponent = ({ countries, handleCountrySelect }) => {...
