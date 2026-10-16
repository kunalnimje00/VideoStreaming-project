# Backend JS - Video Streaming Platform

This project is a backend-first video streaming and social media platform built with Node.js, Express.js, and MongoDB. The API supports user authentication, video management, playlists, tweets, comments, and likes.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Multer for file uploads
- Cloudinary for media storage
- cookie-parser for cookie-based auth
- CORS for frontend integration

## Project Status

- Active backend development
- Core API modules implemented
- Frontend not yet added

## Features Implemented

### Authentication and Users

- User registration
- Login and logout
- Access token refresh flow
- Password change
- Current user retrieval
- Profile updates
- Avatar and cover image upload
- Channel/profile lookup by username
- Watch history tracking

### Video Features

- Publish video with thumbnail upload
- Get all videos
- Get video by ID
- Update video details
- Delete video
- Toggle publish status

### Playlist Features

- Create playlist
- Get user playlists
- Get playlist by ID
- Add video to playlist
- Remove video from playlist
- Update playlist
- Delete playlist

### Tweet Features

- Create tweet
- Get all tweets
- Get user tweet list
- Update tweet
- Delete tweet

### Comments and Likes

- Get comments for a video
- Add, edit, and delete comments
- Toggle likes on videos, comments, and tweets
- Get the authenticated user's liked videos

### Other Social Features

- Subscription model is present; subscription API routes are not yet implemented

## Project Structure

```bash
.
├── backend/
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── constants.js
│       ├── controllers/
│       │   ├── comment.controller.js
│       │   ├── like.controller.js
│       │   ├── playlist.controller.js
│       │   ├── tweet.controller.js
│       │   ├── user.controller.js
│       │   └── video.controller.js
│       ├── db/
│       │   └── index.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   └── multer.middleware.js
│       ├── models/
│       │   ├── comment.model.js
│       │   ├── like.model.js
│       │   ├── playlist.model.js
│       │   ├── subscription.model.js
│       │   ├── tweet.model.js
│       │   ├── user.model.js
│       │   └── video.model.js
│       ├── routes/
│       │   ├── comment.route.js
│       │   ├── like.routes.js
│       │   ├── playlist.routes.js
│       │   ├── tweet.routes.js
│       │   ├── user.routes.js
│       │   └── video.routes.js
│       └── utils/
│           ├── apiError.js
│           ├── apiResponse.js
│           ├── asyncHandler.js
│           └── cloudinary.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── node_modules/
```

## API Routes

### User Routes

```text
POST /api/v1/users/register
POST /api/v1/users/login
POST /api/v1/users/logout
POST /api/v1/users/refresh-token
POST /api/v1/users/change-password
GET /api/v1/users/current-user
PATCH /api/v1/users/update-account
PATCH /api/v1/users/avatar
PATCH /api/v1/users/cover-image
GET /api/v1/users/c/:username
GET /api/v1/users/history
```

### Video Routes

```text
GET /api/v1/video/
POST /api/v1/video/publish
GET /api/v1/video/getById/:videoId
PATCH /api/v1/video/update/:videoId
DELETE /api/v1/video/delete/:videoId
PATCH /api/v1/video/togglePublish/:videoId
```

### Playlist Routes

```text
POST /api/v1/playlist/create
GET /api/v1/playlist/user/:userId
GET /api/v1/playlist/getById/:playlistId
PATCH /api/v1/playlist/add/:playlistId/:videoId
PATCH /api/v1/playlist/deletevideo/:playlistId/:videoId
PATCH /api/v1/playlist/update/:playlistId
DELETE /api/v1/playlist/delete/:playlistId
```

### Tweet Routes

```text
POST /api/v1/tweets/createTweet
GET /api/v1/tweets/
GET /api/v1/tweets/user/:userId
PATCH /api/v1/tweets/:tweetId
DELETE /api/v1/tweets/:tweetId
```

### Comment Routes

```text
GET /api/v1/comment/:videoId
POST /api/v1/comment/add/:videoId
PATCH /api/v1/comment/edit/:commentId
DELETE /api/v1/comment/delete/:commentId
```

### Like Routes

```text
POST /api/v1/like/video/:videoId
POST /api/v1/like/comment/:commentId
POST /api/v1/like/tweet/:tweetId
GET /api/v1/like/liked-videos
```

All comment and like routes require authentication. Like POST endpoints toggle the current user's like on or off.

## Environment Variables

Create a `.env` file in the project root with the following values:

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

## Getting Started

1. Clone the repo
2. Install dependencies:

```bash
npm install
```

3. Add environment variables in a `.env` file
4. Start the development server:

```bash
npm run dev
```

## Notes

This project is a learning-focused backend application for building a modern video platform. It is still evolving, and some modules are being refined as the app grows.

## License

This project is for personal learning and development purposes.
