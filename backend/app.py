
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
from datetime import datetime
import re
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Priyanshu@3462',
        database='task_manager'
    )
    return connection

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Task Manager API!"})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test endpoint is working!"})


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    connection = get_db_connection()
    cursor = None  

    try:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_password))
        connection.commit()
        return jsonify({"message": "User  registered successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        if cursor is not None:
            cursor.close()  
        connection.close()  

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    connection = get_db_connection()
    cursor = None  

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()

        if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        if cursor is not None:
            cursor.close()  
        connection.close()  

@app.route('/tasks', methods=['POST'])
def create_task():
    print(request.json,'task')
    data =request.json  
    print(data)
    title = data.get('name')
    description = data.get('description', '')
    status = data.get('status','in-progress') 

    status = re.sub(r'\s+', '-', status.strip().lower())
    print(status, 'status')
    due_date = data.get('dueDate')
    created_by = data.get('createdBy')  
    last_updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S') 

    connection = get_db_connection()
    cursor = connection.cursor()

    # try:
    cursor.execute("""
        INSERT INTO tasks ( title, description, status, due_date, created_by, last_updated)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, ( title, description, status, due_date, created_by, last_updated))
    task_id = cursor.lastrowid
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Task created successfully", "id": task_id,"last_updated":last_updated}), 201
    # except mysql.connector.Error as err:
    #     return jsonify({"error": str(err)}), 400
    # finally:
    #     cursor.close()
    #     connection.close()

@app.route('/tasks/<int:user_id>', methods=['GET'])
def get_tasks(user_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM tasks WHERE user_id = %s", (user_id,))
        tasks = cursor.fetchall()
        return jsonify(tasks), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        connection.close()

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    title = data.get('name')
    description = data.get('description')
    status = data.get('status')
    status = re.sub(r'\s+', '-', status.strip().lower())
    due_date = data.get('dueDate')
    created_by = data.get('createdBy')  
    last_updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            UPDATE tasks SET title=%s, description=%s, status=%s, due_date=%s, created_by=%s, last_updated=%s
            WHERE id=%s
        """, (title, description, status, due_date, created_by, last_updated, task_id))
        connection.commit()

        cursor.execute("SELECT created_by FROM tasks WHERE id = %s", (task_id,))
        created_by = cursor.fetchone()[0]
        return jsonify({"message": "Task updated successfully", "last_updated": last_updated,"created_by": created_by}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        connection.close()

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
        connection.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        connection.close()

@app.route('/search', methods=['GET'])
def search_tasks():
    query = request.args.get('q', '').strip()
    
    if not query:
        return jsonify([]), 200  
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)   

    try:
        search_term = f"%{query}%"
        cursor.execute("""
            SELECT * FROM tasks
            WHERE title LIKE %s OR description LIKE %s
        """, (search_term, search_term))
        tasks = cursor.fetchall()
        print(tasks, 'tasks')
        return jsonify(tasks), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        connection.close()  




if __name__ == '__main__':
    app.run(debug=True)

