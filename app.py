from flask import Flask, render_template, send_from_directory, url_for, redirect, session
from authlib.integrations.flask_client import OAuth
from authlib.common.security import generate_token
from dotenv import load_dotenv
import os
import sys
import pandas as pd

from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')

PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"


@app.route('/')
def index():
    return render_template('base.html')

@app.route('/newgame')
def about():
    return render_template('newgame.html')

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
