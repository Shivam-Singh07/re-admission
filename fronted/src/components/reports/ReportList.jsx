import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatientReports } from '../../services/api';

const ReportList = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getPatientReports(patientId);
        setReports(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reports');
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  if (loading) return <div className="loading">Loading reports...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="report-list">
      <h3>Test Reports</h3>
      
      {reports.length === 0 ? (
        <p>No reports found for this patient.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Glucose</th>
                <th>Prediction</th>
                <th>Hospitalization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report._id}>
                  <td>{new Date(report.testDate).toLocaleDateString()}</td>
                  <td>{report.measurements.glucose} mg/dL</td>
                  <td>
                    {(report.outcome.modelConfidence * 100).toFixed(2)}%
                    {report.outcome.hasDiabetes ? 
                      <span className="badge bg-danger ms-2">Positive</span> :
                      <span className="badge bg-success ms-2">Negative</span>
                    }
                  </td>
                  <td>
                    {report.outcome.needsHospitalization ? 
                      <span className="badge bg-danger">Required</span> :
                      <span className="badge bg-success">Not Required</span>
                    }
                  </td>
                  <td>
                    <Link to={`/reports/${report._id}`} className="btn btn-info btn-sm">
                      View Details
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

export default ReportList;
