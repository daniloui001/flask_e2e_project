from flask import Flask, render_template, url_for, redirect, session
from authlib.integrations.flask_client import OAuth
from authlib.common.security import generate_token
from dotenv import load_dotenv
import os
import sys
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/newgame')
def about():
    return render_template('about.html')

@app.route('/data')
def data():
    return render_template('data.html')

if __name__ == '__main__':
    app.run(
        debug=True,
        port=8080
    )