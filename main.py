from flask import Flask, render_template, request, jsonify, session
import os

app = Flask(__name__)
app.secret_key = 'pocketsmart_secret_key_123'

# Demo In-Memory Database
users_db = {}  # {email: {'name': name, 'password': password}}
history_db = []  # Saved calculation history

@app.route('/')
def home():
    return render_template('index.html')

# 1. User Registration Route
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email', '').lower()
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'status': 'error', 'message': 'Motham details fill cheyandi.'}), 400

    if email in users_db:
        return jsonify({'status': 'error', 'message': 'Eee email tho account already undi. Login cheyandi.'}), 400

    users_db[email] = {'name': name, 'password': password}
    session['user_name'] = name
    session['user_email'] = email

    return jsonify({'status': 'success', 'name': name})

# 2. User Login Route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').lower()
    password = data.get('password')

    if email in users_db and users_db[email]['password'] == password:
        name = users_db[email]['name']
        session['user_name'] = name
        session['user_email'] = email
        return jsonify({'status': 'success', 'name': name})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid Email or Password!'}), 401

# 3. User Logout Route
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'status': 'success'})

# 4. Home Interior Recommendation Calculation Engine
@app.route('/api/recommend/home', methods=['POST'])
def recommend_home():
    data = request.get_json()
    budget = float(data.get('budget', 10000))[cite: 4, 5]
    lights = int(data.get('lights', 5))[cite: 4, 5]
    fans = int(data.get('fans', 3))[cite: 4, 5]
    furniture = int(data.get('furniture', 2))[cite: 4, 5]
    notes = data.get('notes', '')[cite: 4, 5]

    # Budget Split Calculation Logic
    lighting_alloc = round(budget * 0.25, 2)[cite: 6]
    fans_alloc = round(budget * 0.35, 2)[cite: 6]
    furniture_alloc = round(budget * 0.40, 2)[cite: 6]

    response = {
        'domain': 'Home Interior',[cite: 6]
        'total_budget': budget,[cite: 4, 5]
        'items': [
            {
                'title': f'Lighting Setup ({lights} Lights) — Allocation: ₹{lighting_alloc:.2f}',[cite: 6]
                'desc': 'Smart LED Bulbs & Warm White Strips (Amazon/Flipkart)'[cite: 6]
            },
            {
                'title': f'Fans & Airflow ({fans} Fans) — Allocation: ₹{fans_alloc:.2f}',[cite: 6]
                'desc': 'Energy Efficient BLDC Ceiling Fans'[cite: 6]
            },
            {
                'title': f'Furniture Essentials ({furniture} Items) — Allocation: ₹{furniture_alloc:.2f}',[cite: 6]
                'desc': 'Minimalist Wooden Furniture Setup (IKEA / Amazon)'[cite: 6]
            }
        ]
    }

    # Save to History
    history_db.append(response)

    return jsonify({'status': 'success', 'data': response})

# 5. Party Package Calculation Engine
@app.route('/api/recommend/party', methods=['POST'])
def recommend_party():
    data = request.get_json()
    budget = float(data.get('budget', 45000))
    guests = int(data.get('guests', 35))

    catering_alloc = round(budget * 0.50, 2)
    decor_alloc = round(budget * 0.30, 2)
    gifts_alloc = round(budget * 0.20, 2)

    response = {
        'domain': 'Party Package',
        'total_budget': budget,
        'items': [
            {
                'title': f'Catering Setup ({guests} Guests) — Allocation: ₹{catering_alloc:.2f}',
                'desc': 'Buffet Dinner & Beverage Menu Package'
            },
            {
                'title': f'Venue Decor & Lighting — Allocation: ₹{decor_alloc:.2f}',
                'desc': 'Theme Balloon Arch & Backdrop Stage Setup'
            },
            {
                'title': f'Custom Cake & Goodie Bags — Allocation: ₹{gifts_alloc:.2f}',
                'desc': 'Customized Designer Cake & Return Gifts'
            }
        ]
    }

    history_db.append(response)
    return jsonify({'status': 'success', 'data': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
