import tensorflow as tf
import numpy as np
import os
import pickle
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Path to the model file
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'diabetes_lstm_model.h5')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

# Features for diabetes prediction
FEATURE_ORDER = [
    'pregnancies', 'glucose', 'bloodPressure', 'skinThickness', 
    'insulin', 'bmi', 'diabetesPedigreeFunction', 'age'
]

def create_scaler():
    """Create and save a scaler based on the dataset"""
    # Load the dataset - CORRECTED PATH to use diabetes-1.csv in backend folder
    csv_path = os.path.join(os.path.dirname(__file__), 'diabetes.csv')
    print(f"Looking for CSV at: {csv_path}")
    
    # Load data
    data = pd.read_csv(csv_path)
    
    # Extract features
    X = data.iloc[:, :-1].values
    
    # Create and fit scaler
    scaler = StandardScaler()
    scaler.fit(X)
    
    # Save scaler
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)
    
    print("Created and saved scaler")
    return scaler

def load_model():
    """Load the diabetes model and scaler"""
    # Load Keras model
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully")
    
    # Load or create scaler
    try:
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)
            print("Scaler loaded successfully")
    except (FileNotFoundError, IOError):
        print("Creating new scaler...")
        scaler = create_scaler()
    
    return model, scaler

def predict_diabetes(model, scaler, measurements):
    """Make a diabetes prediction based on patient measurements"""
    # Extract features in correct order
    features = [float(measurements[feature]) for feature in FEATURE_ORDER]
    
    # Convert to numpy array and reshape for model
    features_array = np.array(features).reshape(1, -1)
    
    # Scale features
    scaled_features = scaler.transform(features_array)
    
    # For LSTM model, reshape to include time dimension
    # If your model needs this shape: (samples, timesteps, features)
    input_shape = model.input_shape
    
    # Check if we need to reshape based on model input shape
    if len(input_shape) == 3:  # LSTM expects (samples, timesteps, features)
        scaled_features_reshaped = scaled_features.reshape(1, scaled_features.shape[1], 1)
        prediction = model.predict(scaled_features_reshaped)
    else:  # Standard dense model with shape (samples, features)
        prediction = model.predict(scaled_features)
    
    # Return probability
    return float(prediction[0][0])
