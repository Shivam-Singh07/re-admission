import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../../services/api';

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createPatient(formData);
      setLoading(false);
      // Redirect to patient list
      navigate('/patients');
    } catch (err) {
      setError('Failed to add patient');
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Add New Patient</h2>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Patient Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Patient'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
