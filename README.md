# Backend Bookmark Manager API

A REST API for managing personal bookmarks with user authentication, ownership checks, tags, categories, favorites, and MongoDB persistence.

## Features

- User registration and login
- JWT authentication stored in an HttpOnly cookie
- Login and registration rate limits
- Logout by clearing the authentication cookie
- Create, list, read, update, and delete bookmarks
- User-specific bookmark access
- Tags, categories, and favorite status
- Request validation for bookmark fields
- Bookmark field length limits and normalized tags
- HTTP and HTTPS URL validation
- Environment-based CORS configuration, allowed-origin checks for state-changing requests, and security headers

## Tech Stack

- Node.js
- Express.js
- MongoDB and Mongoose
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- express-rate-limit
- helmet

## Project Structure

```text
backend-bookmark-manager-api/
├── src/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── bookmark.controller.js
│   ├── middlewares/auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── bookmark.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── bookmark.routes.js
│   └── index.js
├── rest.http
├── .env.example
└── package.json
```

## Setup

### Requirements

- Node.js 20.19 or newer
- npm
- A running MongoDB instance or MongoDB Atlas database

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and set the values:

```env
PORT=1206
MONGO_URI=mongodb://127.0.0.1:27017/backend_bookmark_manager_api
JWT_SECRET=change_me_generate_a_random_secret_of_at_least_32_chars
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Replace the example `JWT_SECRET` with a unique random value before starting the API. In production, set `NODE_ENV=production` and provide one or more comma-separated frontend origins in `CLIENT_ORIGIN`.

Start the API:

```bash
# Development
npm run dev

# Normal start
npm start
```

The API runs at `http://localhost:1206` by default.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a user and set the auth cookie |
| `POST` | `/api/auth/login` | Authenticate a user and set the auth cookie |
| `POST` | `/api/auth/logout` | Clear the auth cookie |

### Bookmarks

All bookmark endpoints require the `token` HttpOnly cookie.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/bookmarks` | Create a bookmark |
| `GET` | `/api/bookmarks` | List the current user's bookmarks |
| `GET` | `/api/bookmarks/:id` | Get one owned bookmark |
| `PUT` | `/api/bookmarks/:id` | Update one owned bookmark |
| `DELETE` | `/api/bookmarks/:id` | Delete one owned bookmark |

### Bookmark body

```json
{
  "title": "Ashish Ranjan Portfolio",
  "url": "https://ashishranjan.in/",
  "tags": ["portfolio", "web"],
  "category": "Development",
  "isFavorite": true
}
```

`title` and `url` are required when creating a bookmark. `url` must use HTTP or HTTPS. Titles are limited to 200 characters, URLs to 2,048 characters, categories to 100 characters, and bookmarks to 30 tags of at most 50 characters each. During an update, all fields are optional, but supplied values must have the correct type.

## Authentication behavior

Registration requires a valid email and a password between 8 and 72 UTF-8 bytes. Passwords are hashed with bcrypt. Login and registration are rate-limited per client IP; the in-memory limiter is suitable for a single server process. Multi-instance deployments should configure a shared rate-limit store.

After successful registration or login, the API sets a seven-day `token` cookie with the `HttpOnly` flag. In development it uses `SameSite=Lax`; in production it uses `SameSite=None; Secure` so a separately hosted frontend can send the cookie over HTTPS. Production deployments must use HTTPS and set one or more exact frontend origins in `CLIENT_ORIGIN`.

Requests with an `Origin` header to state-changing methods (`POST`, `PUT`, `PATCH`, and `DELETE`) are accepted only from the configured frontend origins. Browser clients must send credentialed requests, for example with `credentials: "include"` or Axios `withCredentials: true`.

## Manual testing

The [`rest.http`](rest.http) file contains example requests for the root endpoint, authentication, and bookmark CRUD operations. Run registration or login first so the REST client can receive the cookie, then call the bookmark endpoints.

## Current scope

The API has no refresh-token flow, password reset, email verification, role-based authorization, pagination, or server-side token revocation. Logout clears the browser cookie; an already copied token remains valid until it expires.

## Author

**Ashish Ranjan**
Full-Stack Web Developer

## Links

- Portfolio: [ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [github.com/a2rp](https://github.com/a2rp)
- CodePen: [codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [facebook.com/theash.ashish](https://www.facebook.com/theash.ashish/)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- [Support page](https://a2rp-donation-page.netlify.app/)
- [Buy Me a Coffee](https://buymeacoffee.com/a2rp)
- [Patreon](https://www.patreon.com/a2rp)

## License

This project is distributed under the [MIT License](LICENSE).
