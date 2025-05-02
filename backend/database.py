from pymongo import MongoClient
import datetime
import time

# MongoDB connection string
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "diabetes-app"

# MongoDB client instance
client = None
db = None

def init_db():
    """Initialize database connection"""
    global client, db
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    # Create indexes if they don't exist
    db.patients.create_index("patientId", unique=True)
    db.reports.create_index("patientId")
    
    print("MongoDB connected")

def get_db():
    """Get database instance"""
    global db
    if db is None:
        init_db()
    return db

def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")
