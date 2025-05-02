import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient, getPatientReports } from '../../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatient(id);
        const reportData = await getPatientReports(id);
        
        setPatient(patientData);
        setReports(reportData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patient data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading patient data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!patient) return <div className="error">Patient not found</div>;

  // Prepare chart data
  const chartData = {
    labels: reports.map(r => new Date(r.testDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Glucose Level',
        data: reports.map(r => r.measurements.glucose),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Diabetes Probability',
        data: reports.map(r => r.outcome.modelConfidence * 100),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Patient Health Trends',
      },
    },
  };

  return (
    <div className="patient-detail">
      <div className="card mb-4">
        <div className="card-header">
          <h2>Patient Information</h2>
        </div>
        <div className="card-body">
          <h3>{patient.name}</h3>
          <p><strong>Patient ID:</strong> {patient.patientId}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          
          <div className="mt-3">
            <Link to={`/patients/${id}/report`} className="btn btn-primary">
              Add New Test Report
            </Link>
          </div>
        </div>
      </div>

      {reports.length > 0 ? (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h3>Health Trends</h3>
            </div>
            <div className="card-body">
              <Line options={chartOptions} data={chartData} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Test Reports</h3>
            </div>
            <div className="card-body">
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
            </div>
          </div>
        </>
      ) : (
        <div className="alert alert-info">
          No test reports found for this patient. 
          <Link to={`/patients/${id}/report`} className="alert-link ms-2">
            Add a report
          </Link>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
