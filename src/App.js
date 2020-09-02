import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import { AppContext } from './libs/contextLib';
import { Auth } from 'aws-amplify';

import ErrorBoundary from './components/ErrorBoundary';
import { onError } from './libs/errorLib';

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') onError(e);
    }

    setIsAuthenticating(false);
  };

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push('/login');
  };

  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar bg="light">
          <Navbar.Brand as={Link} to="/">
            Scratch
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/settings">
                    Settings
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
