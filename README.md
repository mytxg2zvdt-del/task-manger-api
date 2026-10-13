Task Manager API

Project Description

Task Manager API is a RESTful backend application that allows users to register, log in, and manage their own tasks securely.

Technologies Used

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* JWT (JSON Web Token) for authentication
* bcryptjs for password hashing
* Postman for API testing

Features

* User registration and login
* Secure password hashing
* JWT authentication
* Create, read, update, and delete tasks (CRUD)
* Search tasks by title
* Filter tasks by status and priority
* Pagination for task lists
* Task ownership protection
* PostgreSQL database integration

Installation and Setup

1. Clone or download the project.
2. Open the project folder in the terminal.
3. Install dependencies:

npm install

4. Create a .env file in the project root and configure your local database settings:

DB_NAME=task_manager_db
DB_USER=postgres
DB_PASSWORD=your_local_database_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_own_secret_key

5. Make sure PostgreSQL is running and the database task_manager_db exists.
6. Start the server:

node app.js

The server runs on http://localhost:5000.

API Endpoints

Authentication

Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Log in and receive a token
GET	/api/auth/me	Verify the authentication token

Tasks

Method	Endpoint	Description
POST	/api/tasks	Create a task
GET	/api/tasks	Get the logged-in user’s tasks
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task

Search, Filtering, and Pagination

Examples:

* Search: /api/tasks?search=backend
* Filter by status: /api/tasks?status=completed
* Filter by priority: /api/tasks?priority=high
* Pagination: /api/tasks?page=1&limit=5

You can combine supported query parameters.

Authentication

For protected endpoints, select Bearer Token in Postman’s Authorization tab and provide the token returned by the login endpoint.

Database Models

* User: name, email, password, role
* Task: title, description, status, priority, due date, and user ownership

Notes

* Keep the .env file private and never upload real database passwords or secret keys to GitHub.
* The database tables are synchronized by Sequelize when the application starts.

Author

Miram