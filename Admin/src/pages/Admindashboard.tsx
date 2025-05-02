import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Badge, Card, Form, Row, Col, Offcanvas } from 'react-bootstrap';
import { PencilSquare, Trash, List } from 'react-bootstrap-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import useUserStore, { User } from '../store/Store';

type FormData = {
  username: string;
  role: string;
  email: string;
  password: string;
};
const SalesDashboard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ username: "", role: "", email: "", password: "" });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setusers);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const addUser = useUserStore((state) => state.addUser);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true)
      setError('')
      const response = await axios.post("http://localhost:3000/api/auth/register", formData);
      console.log(response.data)
      addUser(response.data)
      setLoading(false)
      window.location.reload();
    } catch (error: any) {
      setError(error.response.data.message)
      console.log(error.response.data.message)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error: any) {
      console.error(error.message);
      setError(error.response?.data?.message || error.message || 'An error occurred while fetching users.');
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);



  const handleEdit = (user: User) => {
    updateUser(user._id, user);
    navigate(`/edit-user/${user._id}`)
  };

  const handleDelete = (user: User) => {
    deleteUser(user._id);
    navigate(`/delete-user/${user._id}`)
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Offcanvas show={!sidebarCollapsed} onHide={toggleSidebar} className="bg-dark text-white">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Sidebar content */}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Button variant="outline-secondary" onClick={toggleSidebar} className="mb-3">
          <List /> Menu
        </Button>

        <h2 className="mb-4">User Dashboard</h2>

        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Add User</h5>
            <Row>
              <Col md={12} className="bg-white">
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="rounded-4"
                      />
                      {error && <p className="text-danger">{error}</p>}
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="rounded-4"
                      />
                      {error && <p className="text-danger">{error}</p>}
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Select
                        onChange={handleRoleChange}
                        className="rounded-4"
                        name="role"
                        value={formData.role}
                      >
                        <option value="" disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="rounded-4"
                      />
                      {error && <p className="text-danger">{error}</p>}
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-2 rounded-4"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Register"}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>


        {/* Users Table */}
        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user: User) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>

                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="me-2"
                        >
                          <PencilSquare /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;