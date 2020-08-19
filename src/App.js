import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import Routes from './Routes';

function App() {
  return (
    <div className="App container">
      <Navbar bg="light">
        <Navbar.Brand as={Link} to="/">
          Scratch
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/signup">
              <Nav.Item>Signup</Nav.Item>
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              <Nav.Item>Login</Nav.Item>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;
