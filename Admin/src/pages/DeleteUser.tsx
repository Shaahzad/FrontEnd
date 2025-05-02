import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import useUserStore from '../store/Store';

const DeleteUser: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { deleteUser, users, setusers } = useUserStore();
  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (id) deleteUser(id);
      navigate('/admin');
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/admin/users',{
        headers: { Authorization: `Bearer ${token}` }
      });
      setusers(response.data);
    } catch (error: any) {
      console.error(error.message);
      }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const currentUser = users.find((user) => user._id === id);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-4">
        <Card className="mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Body>
            <h3 className="mb-4">Error: User not found</h3>
            <Alert variant="danger">
              Could not find user with ID <strong>{id}</strong>. Please go back and try again.
            </Alert>
            <Button variant="secondary" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <h3 className="mb-4">Delete User</h3>
          <Alert variant="danger">
            Are you sure you want to permanently delete the following user?
          </Alert>

          <div className="mb-4">
            <p><strong>Name:</strong> {currentUser?.username}</p>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>Status:</strong> {currentUser?.isActive ? 'Active' : 'Inactive'}</p>
          </div>

          <div className="d-flex justify-content-between">
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DeleteUser;
