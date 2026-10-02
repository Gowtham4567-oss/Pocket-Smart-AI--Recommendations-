from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/recommend/home', methods=['POST'])
def recommend_home():
    data = request.get_json()
    budget = float(data.get('budget', 10000))
    room_type = data.get('roomType', 'Living Room')
    style = data.get('interiorStyle', 'Modern Professional')
    
    lights = int(data.get('lights', 5))
    fans = int(data.get('fans', 3))
    furniture = int(data.get('furniture', 2))
    appliances = int(data.get('appliances', 2))
    decor = int(data.get('decor', 1))
    notes = data.get('notes', '').strip()  # User additional requirements (e.g., 'clock')

    # Budget Calculations based on whether custom notes exist
    if notes:
        alloc_lights = round(budget * 0.15, 2)
        alloc_fans = round(budget * 0.20, 2)
        alloc_furniture = round(budget * 0.30, 2)
        alloc_appliances = round(budget * 0.15, 2)
        alloc_decor = round(budget * 0.10, 2)
        alloc_custom = round(budget * 0.10, 2)
    else:
        alloc_lights = round(budget * 0.20, 2)
        alloc_fans = round(budget * 0.20, 2)
        alloc_furniture = round(budget * 0.35, 2)
        alloc_appliances = round(budget * 0.15, 2)
        alloc_decor = round(budget * 0.10, 2)

    # Core 5 Essential recommendations
    items = [
        {
            'title': f'Lighting Setup ({lights} Lights) — Allocation: ₹{alloc_lights:.2f}',
            'desc': f'Smart LED Bulbs & Accent Lighting selected for {room_type} ({style} style).'
        },
        {
            'title': f'Fans & Airflow ({fans} Fans) — Allocation: ₹{alloc_fans:.2f}',
            'desc': 'Energy-efficient BLDC Ceiling Fans with modern finish.'
        },
        {
            'title': f'Furniture Essentials ({furniture} Items) — Allocation: ₹{alloc_furniture:.2f}',
            'desc': f'Space-saving & functional furniture suited for {style} setup.'
        },
        {
            'title': f'Utility Appliances ({appliances} Items) — Allocation: ₹{alloc_appliances:.2f}',
            'desc': 'Essential power-saving electrical appliances.'
        },
        {
            'title': f'Decor Elements ({decor} Items) — Allocation: ₹{alloc_decor:.2f}',
            'desc': f'Aesthetic decor accents for {room_type}.'
        }
    ]

    # Dynamic Custom Requirement Insertion
    if notes:
        items.append({
            'title': f'Custom Requirement ({notes.title()}) — Allocation: ₹{alloc_custom:.2f}',
            'desc': f'Personalized {notes} matching your budget and {style} theme.'
        })

    return jsonify({
        'status': 'success',
        'data': {
            'room_type': room_type,
            'style': style,
            'total_budget': budget,
            'items': items
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
