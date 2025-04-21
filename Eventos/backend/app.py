from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from models import db, Event, StudentRegistration
from datetime import datetime
from functools import wraps


app = Flask(__name__, template_folder='templates', static_folder='static')

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Ruta principal (estudiantes)
@app.route('/')
def home():
    return render_template('index.html')

# Ruta para administradores
@app.route('/admin')
def admin_panel():
    return render_template('admin.html')


def require_admin(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not request.headers.get('X-Admin-Token') == 'secret-admin-token':
            return jsonify({'error': 'Acceso no autorizado'}), 403
        return f(*args, **kwargs)
    return wrapper


def require_student(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not request.headers.get('X-Student-Token'):
            return jsonify({'error': 'Acceso no autorizado'}), 403
        return f(*args, **kwargs)
    return wrapper



@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{
        'id': e.id,
        'name': e.name,
        'description': e.description,
        'date': e.date.isoformat(),
        'location': e.location,
        'activity_type': e.activity_type
    } for e in events])

@app.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get_or_404(id)
    return jsonify({
        'id': event.id,
        'name': event.name,
        'description': event.description,
        'date': event.date.isoformat(),
        'location': event.location,
        'activity_type': event.activity_type
    })

@app.route('/events', methods=['POST'])
@require_admin
def create_event():
    data = request.get_json()
    try:
        event = Event(
            name=data['name'],
            description=data['description'],
            date=datetime.fromisoformat(data['date']),
            location=data['location'],
            activity_type=data['activity_type']
        )
        db.session.add(event)
        db.session.commit()
        return jsonify({'message': 'Evento creado exitosamente', 'id': event.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/events/<int:id>', methods=['PUT'])
@require_admin
def update_event(id):
    event = Event.query.get_or_404(id)
    data = request.get_json()
    try:
        event.name = data.get('name', event.name)
        event.description = data.get('description', event.description)
        if 'date' in data:
            event.date = datetime.fromisoformat(data['date'])
        event.location = data.get('location', event.location)
        event.activity_type = data.get('activity_type', event.activity_type)
        db.session.commit()
        return jsonify({'message': 'Evento actualizado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/events/<int:id>', methods=['DELETE'])
@require_admin
def delete_event(id):
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Evento eliminado exitosamente'})

@app.route('/events/<int:id>/register', methods=['POST'])
@require_student
def register_to_event(id):
    event = Event.query.get_or_404(id)
    data = request.get_json()
    try:
        registration = StudentRegistration(
            student_id=data['student_id'],
            student_name=data['student_name'],
            event_id=id
        )
        db.session.add(registration)
        db.session.commit()
        return jsonify({'message': 'Registro exitoso'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Crear tablas e iniciar servidor
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
