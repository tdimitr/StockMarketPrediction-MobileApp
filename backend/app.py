from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cloudinary
from routes import api_bp  

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_bp)

# This is not needed for deployment with Gunicorn:
if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000, debug=True)