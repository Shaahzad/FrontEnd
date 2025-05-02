import { Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


type FormData = {
    username: string;
    role: string;
    email: string;
    password: string;
  };
  
  
function Register() {
  const [formData, setFormData] = useState<FormData>({ username: "", role: "", email: "", password: ""});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
     setLoading(true)
     setError('')
     const response = await axios.post("http://localhost:3000/api/auth/register", formData); 
     console.log(response.data)
     setLoading(false)
     navigate("/login")
    } catch (error: any) {
      setError(error.response.data.message)
      console.log(error.response.data.message)
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <Row className="shadow rounded-4 overflow-hidden" style={{ maxWidth: "900px", width: "100%" }}>
        <Col
          md={6}
          className="bg-primary text-white d-flex flex-column justify-content-center align-items-start p-5"
        >
          <h1 className="display-5 fw-bold mb-3">Go Finance</h1>
          <p>Peer-to-peer lending platform that empowers your financial journey.</p>
          <Button >Read More</Button>
        </Col>

        <Col
          md={6}
          className="bg-white d-flex flex-column justify-content-center p-5"
        >
          <h2 className="mb-3 fw-bold">Hello Again!</h2>
          <p className="text-muted mb-4">Welcome Back</p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="rounded-4"
              />
              {error && <p className="text-danger">{error}</p>}
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Select
               onChange={handleRoleChange}
               className="rounded-4"
               name="role"
               value={formData.role}
               >
                <option>Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="rounded-4"
              />
              {error && <p className="text-danger">{error}</p>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="rounded-4"
              />
              {error && <p className="text-danger">{error}</p>}
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 py-2 rounded-4">
              {loading ? "Loading..." : "Register"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
