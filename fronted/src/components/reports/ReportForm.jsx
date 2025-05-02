import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { predict } from '../../services/api';

const ReportForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigreeFunction: '',
    age: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await predict({
        patientId,
        measurements: formData
      });
      
      setResult(res);
      setLoading(false);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to process test report');
      setLoading(false);
    }
  };

  const handleViewPatient = () => {
    navigate(`/patients/${patientId}`);
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h2>New Test Report</h2>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="pregnancies" className="form-label">Pregnancies</label>
              <input
                type="number"
                className="form-control"
                id="pregnancies"
                name="pregnancies"
                value={formData.pregnancies}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="glucose" className="form-label">Glucose (mg/dL)</label>
              <input
                type="number"
                className="form-control"
                id="glucose"
                name="glucose"
                value={formData.glucose}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="bloodPressure" className="form-label">Blood Pressure (mm Hg)</label>
              <input
                type="number"
                className="form-control"
                id="bloodPressure"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="skinThickness" className="form-label">Skin Thickness (mm)</label>
              <input
                type="number"
                className="form-control"
                id="skinThickness"
                name="skinThickness"
                value={formData.skinThickness}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="insulin" className="form-label">Insulin (mu U/ml)</label>
              <input
                type="number"
                className="form-control"
                id="insulin"
                name="insulin"
                value={formData.insulin}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="bmi" className="form-label">BMI</label>
              <input
                type="number"
                className="form-control"
                id="bmi"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="diabetesPedigreeFunction" className="form-label">Diabetes Pedigree Function</label>
              <input
                type="number"
                className="form-control"
                id="diabetesPedigreeFunction"
                name="diabetesPedigreeFunction"
                value={formData.diabetesPedigreeFunction}
                onChange={handleChange}
                step="0.001"
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
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
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Report'}
          </button>
        </form>
        
        {result && (
          <div className="alert alert-info mt-4">
            <h4>Prediction Results</h4>
            <p><strong>Diabetes Probability:</strong> {(result.diabetesProbability * 100).toFixed(2)}%</p>
            <p><strong>Diagnosis:</strong> {result.hasDiabetes ? 'Positive for Diabetes' : 'Negative for Diabetes'}</p>
            <p className={result.needsHospitalization ? 'text-danger' : 'text-success'}>
              <strong>Recommendation:</strong> {result.needsHospitalization ? 'Hospitalization Recommended' : 'No Hospitalization Required'}
            </p>
            <button className="btn btn-secondary mt-2" onClick={handleViewPatient}>
              View Patient History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
