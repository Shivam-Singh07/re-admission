import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';

// Patient Components 
import PatientList from './components/patients/PatientList';
import PatientDetail from './components/patients/PatientDetail';
import AddPatient from './components/patients/AddPatient';

// Report Components
import ReportForm from './components/reports/ReportForm';
import ReportDetail from './components/reports/ReportDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/patients" />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/add" element={<AddPatient />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/:patientId/report" element={<ReportForm />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
