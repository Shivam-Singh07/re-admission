import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patients');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-list">
      <h2>Patient List</h2>
      <Link to="/patients/add" className="btn btn-primary mb-3">
        Add New Patient
      </Link>
      
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.patientId}>
                  <td>{patient.patientId}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>
                    <Link to={`/patients/${patient.patientId}`} className="btn btn-info btn-sm me-2">
                      View
                    </Link>
                    <Link to={`/patients/${patient.patientId}/report`} className="btn btn-success btn-sm">
                      New Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;
