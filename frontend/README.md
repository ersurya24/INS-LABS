# Insurance Lab Frontend

This is the frontend application for the Insurance Lab system, built with React and Vite.

## Features

- Modern, responsive UI
- Real-time lead management
- User authentication
- Role-based dashboard views
- Interactive call response system
- Lead status tracking
- Telecaller performance metrics

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service functions
│   ├── utils/         # Utility functions
│   ├── assets/        # Static assets
│   └── App.jsx        # Main application component
├── public/            # Public assets
└── vite.config.js     # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Key Features

### Authentication

- User login and registration
- Protected routes
- Role-based access control

### Dashboard

- Admin dashboard with overview statistics
- Telecaller dashboard with assigned leads
- Real-time updates

### Lead Management

- Create and edit leads
- Track lead status
- Update call responses
- View lead history

### Reporting

- Call response analytics
- Lead conversion rates
- Telecaller performance metrics

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Development Guidelines

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, maintainable code
- Add appropriate comments and documentation
