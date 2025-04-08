# Insurance Lab Backend

This is the backend server for the Insurance Lab application, built with Node.js and Express.

## Features

- User authentication and authorization
- Lead management system
- Role-based access control (Admin, Telecaller)
- RESTful API endpoints
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Project Structure

```
backend/
├── controller/     # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── server.js       # Main application file
└── .env            # Environment variables
```

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Leads

- GET `/api/leads` - Get all leads
- POST `/api/leads` - Create a new lead
- PUT `/api/leads/:id` - Update a lead
- DELETE `/api/leads/:id` - Delete a lead
- PUT `/api/leads/:id/status` - Update lead status
- PUT `/api/leads/:id/call-response` - Update call response

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Error handling middleware

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
