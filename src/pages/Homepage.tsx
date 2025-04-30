import { useEffect, useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AppNavbar = () => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">MyApp</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          {user ? (
            <>
              <Nav.Item className="me-2 mt-2">Welcome, {user.username || user.email}</Nav.Item>
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
