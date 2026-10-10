# Video Streaming Platform Backend

This is a backend-first project for a video streaming platform. I am currently developing the server-side part of the application, and in the future I plan to add a React frontend on top of this API.

## Project Status

- In progress
- Backend development is active
- Frontend is not added yet
- The project is not complete and is still evolving

## Project Goal

The main goal is to build a scalable backend for a video streaming platform that can later support a modern frontend built with React.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- Cloudinary for media storage
- Cookie-based auth handling
- CORS support for frontend integration

## Current Features

The backend already includes the foundation for:

- User registration and login
- JWT access and refresh token generation
- Protected routes using middleware
- User profile and account management
- Avatar and cover image uploads
- Playlist support
- Tweet-related backend modules
- Basic API structure for a social/video platform

## Planned Features

This project is intended to grow into a complete video platform with features such as:

- Video upload and metadata handling
- Video streaming APIs
- Watch history
- Likes and comments
- User subscriptions and channels
- Playlists and watch later functionality
- Search and discovery
- React frontend integration later
- Admin features in future iterations

## Frontend Plan

The backend is being built first so that the app can later connect to a React frontend. Once the API is stable, I will add a client-side frontend with features like:

- User authentication pages
- Video dashboard
- Channel/profile pages
- Video player UI
- Playlist UI
- Responsive design

## Project Structure

```bash
backend/
  src/
    app.js
    index.js
    controllers/
    routes/
    models/
    middlewares/
    db/
    utils/
```

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add the required environment variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run the server in development mode:

```bash
npm run dev
```

## Example API Routes

```text
/api/v1/users/register
/api/v1/users/login
/api/v1/users/logout
/api/v1/users/current-user
/api/v1/playlist/create
/api/v1/playlist/user/:userId
```

## Notes

This is a personal learning and development project. The backend is being built step by step, and the application is not yet complete. In the future, I plan to add a React frontend to make the platform fully usable from the client side.

## License

This project is currently for personal learning and development purposes.
