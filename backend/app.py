from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import datetime
import traceback
from model import load_model, predict_diabetes
from database import get_db, init_db

app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

# Load model on startup
try:
    model, scaler = load_model()
except Exception as e:
    print(f"Error loading model: {e}")
    print(traceback.format_exc())
    raise

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Diabetes Prediction API is running"})

@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        db = get_db()
        patients = list(db.patients.find())
        
        # Convert ObjectId to string for JSON serialization
        for patient in patients:
            patient['_id'] = str(patient['_id'])
            
        return jsonify(patients)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/patients/<id>', methods=['GET'])
def get_patient(id):
    try:
        db = get_db()
        patient = db.patients.find_one({"patientId": id})
        
        if not patient:
            return jsonify({"message": "Patient not found"}), 404
            
        patient['_id'] = str(patient['_id'])
        return jsonify(patient)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/patients', methods=['POST'])
def create_patient():
    try:
        data = request.json
        db = get_db()
        
        # Generate patient ID if not provided
        if not data.get('patientId'):
            import time
            data['patientId'] = f"PAT-{int(time.time())}"
            
        patient_id = db.patients.insert_one(data).inserted_id
        
        return jsonify({
            "_id": str(patient_id),
            **data
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/reports/patient/<patient_id>', methods=['GET'])
def get_patient_reports(patient_id):
    try:
        db = get_db()
        reports = list(db.reports.find({"patientId": patient_id}).sort("testDate", -1))
        
        # Convert ObjectId to string
        for report in reports:
            report['_id'] = str(report['_id'])
            
        return jsonify(reports)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/<id>', methods=['GET'])
def get_report(id):
    try:
        from bson.objectid import ObjectId
        db = get_db()
        report = db.reports.find_one({"_id": ObjectId(id)})
        
        if not report:
            return jsonify({"message": "Report not found"}), 404
            
        report['_id'] = str(report['_id'])
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        patient_id = data.get('patientId')
        measurements = data.get('measurements')
        
        db = get_db()
        
        # Get previous reports for this patient
        previous_reports = list(db.reports.find({"patientId": patient_id}).sort("testDate", -1).limit(5))
        
        # Make prediction
        diabetes_probability = predict_diabetes(model, scaler, measurements)
        
        # Determine hospitalization need
        needs_hospitalization = False
        
        if previous_reports:
            # Compare with previous data
            last_report = previous_reports[0]
            glucose_increase = measurements['glucose'] - last_report['measurements']['glucose']
            
            if diabetes_probability > 0.7 and glucose_increase > 30:
                needs_hospitalization = True
        else:
            # New patient, only current data
            if diabetes_probability > 0.8 and measurements['glucose'] > 200:
                needs_hospitalization = True
        
        # Save test report
        new_report = {
            "patientId": patient_id,
            "testDate": datetime.datetime.now(),
            "measurements": measurements,
            "outcome": {
                "hasDiabetes": diabetes_probability > 0.5,
                "needsHospitalization": needs_hospitalization,
                "modelConfidence": float(diabetes_probability)
            }
        }
        
        report_id = db.reports.insert_one(new_report).inserted_id
        
        # Return results
        return jsonify({
            "patientId": patient_id,
            "diabetesProbability": float(diabetes_probability),
            "hasDiabetes": diabetes_probability > 0.5,
            "needsHospitalization": needs_hospitalization,
            "reportId": str(report_id)
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
