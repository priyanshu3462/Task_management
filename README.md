# Task_management

1) Overview of what is being built => The project is a full-stack task management system that allows users to register, log in, and manage their tasks.

    1) The frontend is a React application that provides the user interface. Here's a breakdown of its components:
    • App.jsx: This is the main entry point of your React application. It sets up the routing using react-router-dom to navigate between different pages.
    • Registration.jsx: This component handles user registration.  It captures email, password, and confirm password. It includes client-side validation to ensure passwords match.
    • Login.jsx: This component handles user login. It captures email and password. It sends these credentials to the backend for authentication. If authentication is successful, it redirects the user to the /dashboard page.
    • Dashboard.jsx: This is the core task management interface. It allows users to add new tasks with a name, description, due date, status, and "created by" information. Users can update existing tasks, modifying their details and status. Tasks can be deleted. There's a search bar to find tasks by name or description. Tasks are displayed in a table format, showing "Created By," "Name," "Description," "Due Date," "Status," and "Last Updated.”
    • Api.jsx: This utility file encapsulates the logic for making API requests to your backend.

     2)   The backend is a Flask application that provides the API endpoints for the frontend to 	interact with, and it uses MySQL as its database.
    • Database Schema (task_manager database) users table Stores user information, including id, email (unique), and a hashed password. tasks table Stores task details, including id, user_id (linking to the users table via a foreign key), title, description, status (pending, in-progress, completed), due_date, created_at, last_updated, and created_by.
    • API Endpoints: /: A simple welcome message. 
    • /test: A test endpoint to confirm the API is running. 
    • /register (POST): Receives email and password. Hashes the password using bcrypt before storing it in the database for security. Inserts the new user into the users table. 
    • /login (POST): Receives email and password. Retrieves the hashed password for the given email from the database. Compares the provided password with the hashed password using bcrypt.checkpw. Returns a success message if credentials are valid, otherwise an error. 
    • /tasks (POST): Receives task details (name, description, status, due date, created by). Inserts the new task into the tasks table. Records the last_updated timestamp. 
    • /tasks/<int:user_id> (GET): Note: This endpoint is currently defined but not directly used in your provided frontend code for fetching all tasks for a specific user. The dashboard seems to handle task loading differently. Retrieves all tasks associated with a given user_id. 
    • /tasks/<int:task_id> (PUT): Receives updated task details. Updates an existing task in the tasks table based on its task_id. Updates the last_updated timestamp. 
    • /tasks/<int:task_id> (DELETE): Deletes a task from the tasks table based on its task_id. /search (GET): Accepts a q parameter for the search query. Searches for tasks where the title or description contains the search query (case-insensitive).


2) Explanation of DB Design => Your task management system uses a relational database design with two primary tables: users and tasks. This design is straightforward and effective for managing user accounts and their associated tasks.

1. users Table: This table is designed to store information about the registered users of your application.
    • Purpose: To manage user authentication and unique identification. 
    • Key Fields: 
        ◦ id: A unique identifier for each user. 
        ◦ email: The user's email address, which also serves as their unique login identifier. 
        ◦ password: The hashed password for security. 
2. tasks Table: This table is designed to store the details of each task created by users.
    • Purpose: To store and manage individual tasks. 
    • Key Fields: 
        ◦ id: A unique identifier for each task. 
        ◦ title: The brief name or subject of the task. 
        ◦ description: A more detailed explanation of the task. 
        ◦ status: The current state of the task (e.g., 'pending', 'in-progress', 'completed'). 
        ◦ due_date: The target date for task completion. 
        ◦ created_at: The timestamp when the task was first created. 
        ◦ last_updated: The timestamp when the task was last modified. 
        ◦ created_by: This field seems to store the name or identifier of the person who created the task.
    # ER Diagram
  
![Screenshot from 2025-06-05 12-05-12](https://github.com/user-attachments/assets/5fb785cb-6e35-4a49-8292-54b532201b22)

   #Data Dictionary
    ![Screenshot from 2025-06-05 14-36-35](https://github.com/user-attachments/assets/c349ba78-f94c-4410-bae5-4808a94eb1e3)

i) Documentation of Indexes used => Based on your CREATE TABLE statements, the following indexes are automatically created by MySQL:
    1. Primary Key Indexes:
        ◦ users.id: A primary key automatically creates a clustered index. This ensures fast lookups and unique identification for users. 
        ◦ tasks.id: Similarly, a primary key on tasks.id creates an index for efficient task retrieval. 
    2. Unique Index:
        ◦ users.email: Your UNIQUE constraint on email automatically creates a unique index. This is crucial for fast login lookups (finding a user by their email) and ensuring no two users share the same email address. 
    3. Foreign Key Index:
        ◦ tasks.user_id: MySQL automatically creates an index on foreign key columns (like tasks.user_id). This is vital for performance when performing joins between users and tasks tables and for maintaining referential integrity.

ii) Explanation of Database First: In a Database First approach:
    1. Database Schema Design: You first design your database schema (tables, columns, relationships, constraints, indexes) directly using SQL DDL (Data Definition Language) or a database management tool. 
    2. Database Creation: You then execute this SQL script to create the database and its tables. 
    3. Application Development: After the database is in place, you write your application code (frontend and backend) to interact with this existing database schema. Your backend Flask application then writes SQL queries (or uses an ORM, though you're using raw SQL here) to perform CRUD operations on the tables you've already defined.



3) Structure of the application detailing => "Standard MVC server-side page rendering has been used."
    • Strict Interpretation: This typically refers to traditional web applications where the server renders complete HTML pages and sends them to the client. Each navigation often involves a full page reload. In this model, the "View" part of MVC is generated on the server.In this Project Flask backend does not render HTML pages. It acts as a RESTful API. It only returns JSON data.The React frontend is responsible for taking that JSON data and rendering the HTML/UI.


4) FrontEnd Structure =>  a Multi-Page Application frontend built with React.js has been used.
     • import React, { useState } from 'react';: All your frontend components (App.jsx, Registration.jsx, Login.jsx, Dashboard.jsx) explicitly import React and use React hooks like useState. This is the fundamental building block of a React application, import { createBrowserRouter , RouterProvider } from 'react-router-dom';: The use of react-router-dom in App.jsx clearly indicates client-side routing. Instead of the server sending a new HTML page for each route (like /login, /dashboard), react-router-dom intercepts browser navigation and dynamically renders the appropriate React component within a single HTML page loaded initially.
    • API Requests (apiRequest and fetch): Your frontend components (Registration, Login, Dashboard) make asynchronous fetch or apiRequest calls to http://localhost:5000 to send and receive data (e.g., user credentials, task details). The backend responds with JSON data, not full HTML pages.

5) Why with React?
   Because Choosing an MPA approach, especially with a library like React, offers several significant advantages for building modern web applications: It Enhanced User Experience (UX) and help to create rich and interactive UIs


6) Environment details along with list of dependencies =>
   1. Backend Environment (Flask): The backend is built with Python and uses the Flask web framework.
   2. Core Technologies:
   3. Operating System: Cross-platform (Windows, macOS, Linux)
   4. Programming Language: Python 3.x (e.g., Python 3.8+)
   5. Web Framework: Flask
   6. Database System: MySQL
  
7) Dependencies (Python Packages): You will  typically manage these with pip.

    1.Flask: The micro-framework for building the web API.
    2.Flask-CORS: Used to handle Cross-Origin Resource Sharing, allowing your React frontend (running on localhost:3000 or 5173) to make requests to your Flask backend (running on 
      localhost:5000). 
    3.mysql-connector-python: You're using mysql.connector in your code, which points to mysql-connector-python.
    4. bcrypt: Used for hashing and verifying passwords securely. This is a critical security dependency.

8) How to Set Up/Run the Backend:
    1.Install Python: Ensure you have Python 3.x installed.
    2.Install MySQL: Have a MySQL server running, and create the task_manager database using your provided SQL script.
    3.Create a Virtual Environment and install flask , flask-cors, bcrypt in virtual environment.

9) 2. Frontend Environment (React)=> The frontend is a Multi Page Application (MPA) built with React.js.

    Core Technologies:
        1.Frontend Library: React.js
        2.Build Tool/Bundler: Create React App .
        3.Package Manager: bun or npm

   Dependencies:
        react: The core React library.
        react-dom: Provides DOM-specific methods that can be used at the top level of your app.
        react-router-dom: For handling client-side routing within your SPA (e.g., navigating between /login, /dashboard, /register without full page reloads).




