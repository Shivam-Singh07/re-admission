import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch report details
        const reportResponse = await axios.get(`http://localhost:5000/api/reports/${id}`);
        const reportData = reportResponse.data;
        setReport(reportData);
        
        // Fetch patient details
        const patientResponse = await axios.get(`http://localhost:5000/api/patients/${reportData.patientId}`);
        setPatient(patientResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load report data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading report details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!report) return <div className="error">Report not found</div>;

  return (
    <div className="report-detail">
      <div className="card mb-4">
        <div className="card-header">
          <h2>Test Report Details</h2>
        </div>
        <div className="card-body">
          {patient && (
            <div className="patient-info mb-4">
              <h3>Patient: {patient.name}</h3>
              <p><strong>Patient ID:</strong> {patient.patientId}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <Link to={`/patients/${patient.patientId}`} className="btn btn-secondary btn-sm">
                View Patient Profile
              </Link>
            </div>
          )}
          
          <div className="report-date mb-4">
            <h4>Test Information</h4>
            <p><strong>Test Date:</strong> {new Date(report.testDate).toLocaleString()}</p>
          </div>
          
          <div className="measurements mb-4">
            <h4>Measurements</h4>
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Pregnancies</th>
                    <td>{report.measurements.pregnancies}</td>
                    <th>Glucose</th>
                    <td>{report.measurements.glucose} mg/dL</td>
                  </tr>
                  <tr>
                    <th>Blood Pressure</th>
                    <td>{report.measurements.bloodPressure} mm Hg</td>
                    <th>Skin Thickness</th>
                    <td>{report.measurements.skinThickness} mm</td>
                  </tr>
                  <tr>
                    <th>Insulin</th>
                    <td>{report.measurements.insulin} mu U/ml</td>
                    <th>BMI</th>
                    <td>{report.measurements.bmi}</td>
                  </tr>
                  <tr>
                    <th>Diabetes Pedigree Function</th>
                    <td>{report.measurements.diabetesPedigreeFunction}</td>
                    <th>Age</th>
                    <td>{report.measurements.age}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="prediction-results">
            <h4>Prediction Results</h4>
            <div className="alert alert-info">
              <p><strong>Diabetes Probability:</strong> {(report.outcome.modelConfidence * 100).toFixed(2)}%</p>
              <p>
                <strong>Diagnosis:</strong> 
                {report.outcome.hasDiabetes ? 
                  <span className="text-danger"> Positive for Diabetes</span> :
                  <span className="text-success"> Negative for Diabetes</span>
                }
              </p>
              <p className={report.outcome.needsHospitalization ? 'text-danger' : 'text-success'}>
                <strong>Recommendation:</strong> {report.outcome.needsHospitalization ? 'Hospitalization Recommended' : 'No Hospitalization Required'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
