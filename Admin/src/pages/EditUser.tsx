import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import useUserStore from '../store/Store';
import axios from 'axios';


type FormData = {
  username: string;
  role: string;
  email: string;
  isActive: boolean
}
const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { users, updateUser } = useUserStore();
  const [formData, setFormData] = useState<FormData>({ username: '', role: '', email: '', isActive: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const userToEdit = users.find(user => user._id === id);
      console.log(userToEdit);
      if (userToEdit) {
        setFormData(userToEdit);
      } else {
        setError('User not found');
      }
    } else {
      setError('User ID is missing');
    }
  }, [id, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSelectChangeActive = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          `http://localhost:3000/api/admin/users/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateUser(response.data._id, response.data);
        setLoading(false);
        if (response.data.role === 'user') {
          navigate('/home');
        } else {
          navigate('/admin'); 
        }
  
      } catch (error) {
        console.log('Error updating user:', error);
        setError('Error updating user');
        setLoading(false);
      }
    }
  };

  if (!users || !formData) {
    return (
      <div className="p-4">
        <Card className="mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Body>
            <h3 className="mb-4">{error || 'Error: No user selected'}</h3>
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
          <h3 className="mb-4">Edit User</h3>
          {loading && <div>Updating...</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={handleSelectChangeActive}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
    </div >
  );
};

export default EditUser;
