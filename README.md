Project Management System
=======================

Overview
--------

This repository contains the source code for Project Management System with a backend built on Node.js, a frontend using Next.js, and a PostgreSQL database with raw SQL queries.

Features
--------

* **Issue Creation and Tracking**: Easily create, update, and track the status of issues.
* **User Authentication**: Secure user authentication for accessing and managing issues.
* **User Role Sytem**: Role system to protect endpoints. 
* **Backend API with Node.js**: Utilizes Node.js for the server-side logic, providing a robust backend.
* **Frontend with Next.js**: Implements the frontend using Next.js for a modern and efficient user interface.
* **PostgreSQL Database**: Uses PostgreSQL as the database system for storing and retrieving issue-related data with raw SQL queries.

Getting Started
---------------

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm (Node Package Manager)
* PostgreSQL

### Installation

1.  Clone the repository:
    
    bashCopy code
    
    `git clone https://github.com/Alejandbel/issue-management.git` 
    
2.  Navigate to the project directory:
    
    bashCopy code
    
    `cd issue-management` 
    
3.  Install backend dependencies:
    
    bashCopy code
    
    `cd backend
    npm install` 
    
4.  Set up the PostgreSQL database:
    
    * Database default config set in docker-compose.
    * Update the database configuration in `backend/.env.local`.
    
5. Run backend
    * docker compose up
    * npm run start:dev

6.  Install frontend dependencies:
    
    bashCopy code
    
    `cd ../frontend
    npm install` 
    
7.  Run the frontend:
    
    bashCopy code
    
    `npm run dev` 
    
    The application will be accessible at `http://localhost:3000`.
    


---------------

Happy coding! 🚀
