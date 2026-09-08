# Backend Bookmark Manager API Documentation

## Overview

This service provides authenticated CRUD operations for personal bookmarks. Users authenticate with a JWT stored in an HttpOnly cookie. Every bookmark stores its owner's user ID, and bookmark queries include the authenticated user ID so users cannot read or change another user's bookmarks through the normal API routes.

## Requirements

- Node.js
- npm
- MongoDB

The available npm scripts are:

```text
npm run dev  Starts src/index.js with nodemon
npm start    Starts src/index.js with node
```

There is currently no automated test script.

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=1206
MONGO_URI=mongodb://127.0.0.1:27017/backend_bookmark_manager_api
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

The application validates `MONGO_URI` and requires a `JWT_SECRET` of at least 32 characters before starting. `CLIENT_ORIGIN` controls the single credentialed CORS origin. In production, set `NODE_ENV=production` so authentication cookies use the `Secure` flag.

## Startup flow

1. `dotenv` loads the environment variables.
2. Express configures JSON parsing, cookies, and credentialed CORS.
3. Required environment values are checked.
4. MongoDB connection is established.
5. The HTTP server starts listening on the configured port.

The JSON body limit is 10 KB.

## Authentication

### Register

`POST /api/auth/register`

Request body:

```json
{
  "name": "Ashish",
  "email": "ashish@example.com",
  "password": "123456"
}
```

The controller requires a non-empty name and email and a password of at least six characters. Email values are trimmed and lowercased before lookup and storage. The user model hashes the password with bcrypt in its `pre("save")` hook. A successful response sets the `token` cookie and returns the user id, name, and email.

### Login

`POST /api/auth/login`

Request body:

```json
{
  "email": "ashish@example.com",
  "password": "123456"
}
```

Email normalization is the same as registration. Valid credentials set a seven-day JWT cookie. Invalid credentials return HTTP `401`.

### Logout

`POST /api/auth/logout`

The endpoint clears the `token` cookie. It does not maintain a server-side token blacklist. A token that has already been copied outside the browser remains cryptographically valid until its expiry.

## Bookmark API

All bookmark routes use the `protect` middleware. The middleware reads the `token` cookie, verifies it with `JWT_SECRET`, loads the user without the password, and assigns the user to `req.user`.

### Create bookmark

`POST /api/bookmarks`

```json
{
  "title": "Ashish Ranjan Portfolio",
  "url": "https://ashishranjan.in/",
  "tags": ["portfolio", "web"],
  "category": "Development",
  "isFavorite": true
}
```

`title` and `url` are required. Tags must be an array of strings, category must be a string, and `isFavorite` must be a boolean when supplied. URLs must be valid HTTP or HTTPS URLs.

### List bookmarks

`GET /api/bookmarks`

Returns bookmarks belonging to the authenticated user, sorted newest first.

### Get, update, and delete one bookmark

```text
GET    /api/bookmarks/:id
PUT    /api/bookmarks/:id
DELETE /api/bookmarks/:id
```

The `:id` value must be a valid MongoDB ObjectId. The query always includes the authenticated user ID. A valid ID belonging to another user is treated as not found by the API.

Update requests accept any subset of `title`, `url`, `tags`, `category`, and `isFavorite`. Supplied fields are validated before saving.

## Data models

### User

- `name`: required trimmed string
- `email`: required unique lowercase string
- `password`: required string with a minimum length of six before hashing
- `createdAt` and `updatedAt`: managed by Mongoose

### Bookmark

- `title`: required trimmed string
- `url`: required HTTP or HTTPS URL
- `tags`: array of strings, defaulting to an empty array
- `category`: trimmed string, defaulting to `General`
- `isFavorite`: boolean, defaulting to `false`
- `user`: required reference to the owning user
- `createdAt` and `updatedAt`: managed by Mongoose

An index on `{ user: 1, createdAt: -1 }` supports the user's newest-first bookmark list.

## Manual test flow

1. Start MongoDB.
2. Start the API with `npm run dev`.
3. Register a user through `rest.http` or an API client.
4. Log in and keep the returned `token` cookie.
5. Create a bookmark.
6. List, read, update, and delete that bookmark.
7. Log out and confirm that a browser no longer sends the cookie.

For browser clients, send requests with credentials enabled. For example, use `credentials: "include"` with `fetch` or `withCredentials: true` with Axios.

## Scope and future additions

This project does not currently include pagination, full-text search, refresh tokens, password reset, email verification, role-based access, login rate limiting, or automated tests. These are separate enhancements rather than existing capabilities.
