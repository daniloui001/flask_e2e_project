from flask import Flask, render_template, send_from_directory, url_for, redirect, session, flash
from authlib.integrations.flask_client import OAuth
from authlib.common.security import generate_token
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask import Flask, render_template, jsonify, request
import requests

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('MY_SQL_CONNECTOR')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

API_KEY = os.getenv('API_KEY')

PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

class Player(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    PlayerID = db.Column(db.String(10), unique=True, nullable=False)
    Password = db.Column(db.String(255))

@login_manager.user_loader
def load_user(user_id):
    return Player.query.get(int(user_id))

@app.route('/init-db')
def init_db():
    if app.config.get("DEBUG"):
        db.create_all()
        return 'Database initialized successfully!'
    else:
        return 'Database initialization is restricted.'
    
@app.route('/')
def index():
    return render_template('base.html')

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Hash the password before storing it
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = Player(PlayerID=username, Password=hashed_password)

        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful!', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash('Error during registration', 'error')
            # Log the error for debugging purposes
            print(f"Error during registration: {e}")

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = Player.query.filter_by(PlayerID=username).first()

        if user and bcrypt.check_password_hash(user.Password, password):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password', 'error')

    return render_template('login.html')

@app.route('/newgame')
@login_required
def about():
    return render_template('newgame.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/login')
def data():
    return render_template('login.html')

@app.route('/api/nearby-locations', methods=['GET'])
def get_nearby_locations():
    category = request.args.get('category')
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if not category or not lat or not lng:
        return jsonify({'error': 'Missing required parameters'}), 400

    if category == 'arcades':
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
    app.run(
        debug=True,
        port=8080
    )
