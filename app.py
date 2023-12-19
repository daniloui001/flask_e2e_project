from flask import Flask, render_template, send_from_directory, url_for, redirect, session, flash
from authlib.integrations.flask_client import OAuth
from authlib.common.security import generate_token
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask import Flask, render_template, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
import mysql.connector
import requests
import ngrok
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

load_dotenv()

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0 
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://maps.googleapis.com"}})
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('MY_SQL_CONNECTOR')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

API_KEY = os.getenv('API_KEY')

PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

class Player(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    PlayerID = db.Column(db.String(10), unique=True, nullable=False)
    Password = db.Column(db.String(255))

@login_manager.user_loader
def load_user(user_id):
    return Player.query.get(int(user_id))

def connect_to_database():
    return mysql.connector.connect(
        user="dalouie",
        password=os.getenv('password'),
        host="finale.mysql.database.azure.com",
        port=3306,
        database="finale",
        ssl_ca=os.getenv('SSL'),
        ssl_verify_cert=True
    )

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/init-db')
def init_db():
    if app.config.get("DEBUG"):
        db.create_all()
        return 'Database initialized successfully!'
    else:
        return 'Database initialization is restricted.'

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the username already exists
        existing_user = Player.query.filter_by(PlayerID=username).first()
        if existing_user:
            flash('Username already exists. Please choose another username.', 'error')
            return redirect(url_for('register'))

        # Hash the password before storing it
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = Player(PlayerID=username, Password=hashed_password)

        try:
            db.session.add(new_user)
            db.session.commit()

            # Log in the user after successful registration
            login_user(new_user)

            flash('Registration successful!', 'success')
            return redirect(url_for('newgame'))  # Corrected endpoint
        except Exception as e:
            db.session.rollback()
            flash('Error during registration', 'error')
            # Log the error for debugging purposes
            print(f"Error during registration: {e}")

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        next_url = session.get('next_url')
        if next_url:
            session.pop('next_url') 
            return redirect(next_url)
        else:
            return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/newgame')
def newgame():
    return render_template('newgame.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/aboutpage')
def aboutpage():
    return render_template('aboutpage.html')

@app.route('/api/nearby-locations', methods=['GET'])
def get_nearby_locations():
    category = request.args.get('category')
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if not category or not lat or not lng:
        return jsonify({'error': 'Missing required parameters'}), 400

    if category == 'game_arcades':
        place_type = 'arcade'
    elif category == 'cafes':
        place_type = 'cafe'
    elif category == 'libraries':
        place_type = 'library'
    else:
        return jsonify({'error': 'Invalid category'}), 400

    params = {
        'location': f'{lat},{lng}',
        'radius': 1000, 
        'type': place_type,
        'key': API_KEY,
    }

    response = requests.get(PLACES_API_URL, params=params)

    if response.status_code != 200:
        return jsonify({'error': 'Failed to retrieve nearby locations'}), 500

    data = response.json()

    locations = []
    for result in data.get('results', []):
        locations.append({
            'name': result.get('name'),
            'address': result.get('vicinity'),
            'latitude': result['geometry']['location']['lat'],
            'longitude': result['geometry']['location']['lng'],
        })

    return jsonify({'locations': locations})

if __name__ == '__main__':
    public_url = ngrok.connect(8000)  # Assuming your Flask app runs on port 8000
    print(" * ngrok tunnel \"{}\" -> \"http://127.0.0.1:{}/\"".format(public_url, 8000))

    app.run(debug=True, port=8000)