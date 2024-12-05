from pymongo import MongoClient
import pandas as pd

# MongoDB connection details
MONGO_URI = "mongodb+srv://franciscoramos:hmOAbapggL3hFJKm@cluster0.nftlu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
DATABASE_NAME = "test"
COLLECTION_NAME = "services"

# CSV file path
CSV_FILE_PATH = "/Users/franciscoramos/meqaso-webapp/music_services.csv"

def import_csv_to_mongodb(csv_file_path, mongo_uri, database_name, collection_name):
    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    db = client[database_name]
    collection = db[collection_name]
    
    # Read the CSV file into a DataFrame
    data = pd.read_csv(csv_file_path)
    
    # Convert DataFrame to dictionary records
    records = data.to_dict(orient='records')
    
    # Insert records into the MongoDB collection
    collection.insert_many(records)
    print(f"Successfully imported {len(records)} records into the '{collection_name}' collection of the '{database_name}' database.")

# Execute the function
import_csv_to_mongodb(CSV_FILE_PATH, MONGO_URI, DATABASE_NAME, COLLECTION_NAME)
