# Task Management API

This is a **Task Management API** built using [NestJS](https://nestjs.com/), a progressive Node.js framework for building scalable server-side applications. It supports JWT-based authentication, basic task management features, and Swagger for API documentation.

## Features

- User Registration and Authentication (JWT)
- Create, Read, Update, and Delete (CRUD) operations for tasks
- Mark tasks as completed
- Authentication with JWT (Json Web Tokens)
- Input validation with `class-validator`
- Swagger API documentation for better development experience

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Swagger Documentation](#swagger-documentation)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mina79/task-management.git
<<<<<<< HEAD
   cd task-management
=======
   cd task-management-api
>>>>>>> feb7b087bade02f28c334eb3cec04e728c90afcd
   ```

2. Install dependencies

```bash
<<<<<<< HEAD
cd task-management
=======
cd task-management-api
>>>>>>> feb7b087bade02f28c334eb3cec04e728c90afcd
npm install
```

3. Create empty database on mysql called **task_management_db**

```bash
CREATE DATABASE task_management_db;
```

<<<<<<< HEAD
5. Run migrations

```bash
npm run migration:run
```

=======
>>>>>>> feb7b087bade02f28c334eb3cec04e728c90afcd
## Project setup

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### How to Use Swagger Documentation

1. **Open Swagger UI**: Navigate to `http://localhost:3000/docs` in your browser.

2. **Explore Endpoints**: The Swagger UI will display a list of available API endpoints organized by tags (e.g., Users, Tasks). Click on any endpoint to expand it and view more details.

3. **Try Out Endpoints**: For each endpoint, you can:

   - View the required parameters and request body.
   - Send a request directly from Swagger UI by providing the necessary data and clicking the "Try it out" button.
   - See the response status, headers, and body.

4. **View Response Details**: After sending a request, Swagger will show you the response data, including any error messages, response codes, and the structure of the returned data.

<<<<<<< HEAD
=======
# Environment vars

This project uses the following environment variables:

| Name                | Description                                         | Default Value               |
| ------------------- | --------------------------------------------------- | --------------------------- |
| PORT                | Custom port that the application will be running on | 3000                        |
| SERVICE_NAME        | The name of the current service                     | Task Management Application |                   |                    |
| NODE_ENV            | Current environment                                 | dev                         |
| DB_TYPE             | Database type                                       | mysql                       |
| DB_HOST             | Database server host                                | localhost                   |
| DB_PORT             | Database port                                       | 3306                        |
| DB_USERNAME         | Database username                                   | root                        |
| DB_PASSWORD         | Database password                                   | password                    |
| DB_INSTANCE         | Database name                                       | task_management_db          |
| TOKEN_EXPIRY_DURATION_IN_DAYS         | Expiry token date                                       | 7d          |
| JWT_SECRET         | Secret token key                                     |           |

>>>>>>> feb7b087bade02f28c334eb3cec04e728c90afcd
## Project Structure

The project is organized as follows:

```bash
src/
├── auth/
│   ├── auth.service.ts           # Authentication service
│   ├── auth.module.ts            # Auth module
├── common/
│   ├── decorators/               # Custom decorators (e.g., CurrentUser)
│   ├── guards/                   # Guards (e.g., AuthGuard for JWT validation)
│   ├── interceptors/             # Custom interceptors (e.g., SerializeInterceptor)
│   ├── interfaces/               # Interfaces (e.g., UserPayload)
├── tasks/
│   ├── dto/                      # Data Transfer Objects for Task (CreateTaskDto, UpdateTaskDto)
│   ├── entities/                 # Task entity
│   ├── tasks.controller.ts       # Controller for task-related operations
│   ├── tasks.service.ts          # Business logic for task management
├── users/
│   ├── dto/                      # User DTOs (CreateUserDto, LoginDto, etc.)
│   ├── entities/                 # User entity
│   ├── users.controller.ts       # Controller for user-related operations
│   ├── users.service.ts          # Business logic for user management
├── app.module.ts                 # Main module (entry point)
└── main.ts                       # Entry point for the application
```
