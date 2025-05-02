import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Badge, Card, Form, Row, Col, Offcanvas } from 'react-bootstrap';
import { PencilSquare, Trash, List } from 'react-bootstrap-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import useUserStore, { User } from '../store/Store';
const SalesDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setusers);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const navigate = useNavigate();


  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/admin/users',{
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

        <h2 className="mb-4">Sales Dashboard</h2>

        {/* Filter Section */}
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">User Information</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control type="text" placeholder="Search users..." />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select>
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select>
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>User</option>
                  </Form.Select>
                </Form.Group>
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