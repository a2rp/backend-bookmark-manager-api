# backend-bookmark-manager-api

Backend API for bookmark manager with links, tags, categories, favorites, and user ownership using JWT and HttpOnly cookies.

## Features

- Register user
- Login user
- Logout user
- Create bookmark
- Get all bookmarks (user-specific)
- Get single bookmark (user-specific)
- Update bookmark (user-specific)
- Delete bookmark (user-specific)
- Tags support
- Category support
- Favorite bookmark support
- Protected routes
- JWT authentication
- HttpOnly cookie based auth
- MongoDB with Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser

## Environment Variables

Create a .env file:

```bash
PORT=1206
MONGO_URI=mongodb://127.0.0.1:27017/backend_bookmark_manager_api
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Bookmarks

- POST /api/bookmarks
- GET /api/bookmarks
- GET /api/bookmarks/:id
- PUT /api/bookmarks/:id
- DELETE /api/bookmarks/:id

### Bookmark Fields

- title
- url
- tags
- category
- isFavorite

## Notes

- Each bookmark belongs to a specific user
- Users can only access their own bookmarks
- Authentication via HttpOnly cookies
- Use withCredentials: true in frontend

## Follow Me

- GitHub: https://github.com/a2rp
- Portfolio: https://www.ashishranjan.net
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz
