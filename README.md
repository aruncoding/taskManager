# 📝 Task Manager API
A RESTful API built with Node.js, Express.js, and MySQL that allows users to register, log in, and manage their personal tasks. Tasks include details like title, description, status, and due date. Users can only access and modify their own tasks.


## 🚀 Features
•	User registration and login with JWT authentication
•	Password hashing with bcrypt
•	CRUD operations for tasks
•	Input validation and error handling
•	Middleware for user authorization (access control)


## 🛠 Tech Stack
•	Node.js
•	Express.js
•	MySQL (Sequelize ORM)
•	JWT Authentication
•	bcrypt (Password Hashing)
•	express-validator (Input Validation)


## 📂 Project Setup
git clone https://github.com/aruncoding/taskManager.git
cd taskManager
git checkout master   # Ensure you're on the master branch
npm install

## 🔧 Now create a .env file in the root directory and update it according to your MySQL connection:

PORT=3001
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=your_database_name
JWT_SECRET=abcdefghijlmnopk1234rsctz

## 📌 run the backend server
npm run dev
