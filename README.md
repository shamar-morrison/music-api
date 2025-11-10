# Music API

A RESTful API for a music streaming service, built with Node.js, Express, MongoDB, and Cloudinary.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)

## Overview

This Music API provides a complete backend solution for managing a music streaming platform. It includes user authentication, comprehensive CRUD operations for songs, albums, artists, and playlists, file upload capabilities, advanced filtering, and secure admin-only routes.

## Features

- 🔐 **User Authentication** - JWT-based authentication with secure password hashing
- 👤 **User Profiles** - Track liked songs, albums, followed artists, and playlists
- 🎵 **Song Management** - Upload and manage songs with audio files and cover images
- 📀 **Album Management** - Create and manage albums with associated songs
- 🎤 **Artist Management** - Comprehensive artist profiles with top songs and statistics
- 📁 **File Upload** - Cloudinary integration for audio files and images
- 🔒 **Role-Based Access Control** - Admin-only protected routes
- ⚡ **Advanced Filtering** - Filter songs and artists by genre, artist, album, and search queries
- 📄 **Pagination** - Efficient data retrieval with pagination support
- 🛡️ **Rate Limiting** - 100 requests per 15 minutes to prevent abuse
- 📊 **Analytics** - Track song plays, likes, and artist followers

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime environment
- **Express 5.x** - Web application framework
- **TypeScript** - Type-safe JavaScript

### Database

- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Typegoose** - TypeScript decorators for Mongoose models

### Storage & Authentication

- **Cloudinary** - Cloud-based media management (audio files & images)
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Security & Middleware

- **express-rate-limit** - Rate limiting middleware
- **express-async-handler** - Error handling wrapper
- **multer** - File upload handling

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** instance (local or cloud-based)
- **Cloudinary** account (free tier available)

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd music-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# API Base URL
# For production (Railway/Render): Set this to your deployed URL
# API_BASE_URL=https://your-app.railway.app
# API_BASE_URL=https://your-app.onrender.com
# For development: Leave blank or use http://localhost:5000

# Database Configuration
# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/music-api?retryWrites=true&w=majority

# For MongoDB with authentication:
# MONGODB_URI=mongodb://username:password@localhost:27017/music-api

# For MongoDB with custom port:
# MONGODB_URI=mongodb://localhost:27018/music-api

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

### 4. Run the application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The API will be available at `http://localhost:5000` (or your configured PORT).

## Project Structure

```
music-api/
├── src/
│   ├── config/
│   │   └── cloudinary.ts          # Cloudinary configuration
│   ├── controllers/
│   │   ├── album.controller.ts    # Album business logic
│   │   ├── artist.controller.ts   # Artist business logic
│   │   ├── songs.controller.ts    # Song business logic
│   │   └── user.controller.ts     # User authentication logic
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT authentication & authorization
│   │   └── upload.ts               # Multer file upload configuration
│   ├── models/
│   │   ├── album.model.ts          # Album schema
│   │   ├── artist.model.ts         # Artist schema
│   │   ├── playlist.model.ts       # Playlist schema
│   │   ├── song.model.ts           # Song schema
│   │   └── user.model.ts          # User schema with password hashing
│   ├── routes/
│   │   ├── album.routes.ts        # Album API routes
│   │   ├── artist.routes.ts       # Artist API routes
│   │   ├── songs.routes.ts        # Song API routes
│   │   └── user.routes.ts         # User API routes
│   ├── types/
│   │   ├── album.types.ts         # Album TypeScript types
│   │   ├── artist.types.ts        # Artist TypeScript types
│   │   ├── song.types.ts           # Song TypeScript types
│   │   └── user.types.ts           # User TypeScript types
│   ├── utils/
│   │   ├── cloudinary-upload.ts    # Cloudinary upload helper
│   │   ├── rate-limiter.ts        # Rate limiting configuration
│   │   └── validation.ts           # Input validation helpers
│   └── server.ts                   # Express app initialization
├── uploads/                        # Temporary file storage
├── dist/                           # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Users (`/api/users`)

#### Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "isAdmin": false
}
```

#### Login User

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
```

---

### Songs (`/api/songs`)

#### Get All Songs (with filtering)

```http
GET /api/songs?genre=rock&artist=artistId&album=albumId&search=song&page=1&limit=10
```

**Query Parameters:**

- `genre` - Filter by genre
- `artist` - Filter by artist ID
- `album` - Filter by album ID
- `search` - Search by title
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### Create Song

```http
POST /api/songs/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- title: "Song Title"
- artist: "artistId"
- album: "albumId" (optional)
- duration: 180
- genre: "Rock"
- isExplicit: false
- audio: [audio file]
- coverImage: [image file] (optional)
```

#### Get Song by ID

```http
GET /api/songs/:id
```

#### Update Song

```http
PUT /api/songs/:id
Authorization: Bearer <token>
```

#### Delete Song

```http
DELETE /api/songs/:id
Authorization: Bearer <token>
```

#### Add Album to Song

```http
POST /api/songs/:id/add-album
Content-Type: application/json

{
  "albumId": "albumId123"
}
```

#### Add Featured Artist to Song

```http
POST /api/songs/:id/add-artist
Content-Type: application/json

{
  "artistId": "artistId123"
}
```

---

### Albums (`/api/albums`)

#### Get All Albums

```http
GET /api/albums
```

#### Create Album

```http
POST /api/albums/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- title: "Album Title"
- description: "Album description"
- artist: "artistId"
- releaseDate: "2024-01-01"
- genre: "Rock"
- isExplicit: false
- image: [image file] (optional)
```

#### Get Album by ID

```http
GET /api/albums/:id
```

#### Update Album

```http
POST /api/albums/:id
Authorization: Bearer <token>
```

#### Delete Album

```http
DELETE /api/albums/:id
Authorization: Bearer <token>
```

#### Add Songs to Album

```http
DELETE /api/albums/:id/add-songs
Authorization: Bearer <token>
```

---

### Artists (`/api/artists`)

#### Get All Artists

```http
GET /api/artists?genre=rock&search=killa&page=1&limit=10
```

**Query Parameters:**

- `genre` - Filter by genre
- `search` - Search by artist name
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### Get Top Artists

```http
GET /api/artists/top?limit=10
```

#### Create Artist

```http
POST /api/artists/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- name: "Artist Name"
- bio: "Artist biography"
- genres: ["Rock", "Pop"] (JSON string or array)
- image: [image file] (optional)
```

#### Get Artist by ID

```http
GET /api/artists/:id
```

#### Get Artist's Top Songs

```http
GET /api/artists/:id/top-songs?limit=10
```

#### Update Artist

```http
PUT /api/artists/:id
Authorization: Bearer <token>
```

#### Delete Artist

```http
DELETE /api/artists/:id
Authorization: Bearer <token>
```

---

## Data Models

### User

```typescript
{
  name: string;
  email: string;
  password: string (hashed with bcrypt);
  profilePicture: string;
  isAdmin: boolean;
  likedSongs: ObjectId[];
  likedAlbums: ObjectId[];
  followedArtists: ObjectId[];
  followedPlaylists: ObjectId[];
  timestamps: true
}
```

### Song

```typescript
{
  title: string;
  artist: ObjectId;
  album: ObjectId;
  duration: number;
  audioUrl: string;
  coverImage: string;
  releaseDate: Date;
  genre: string;
  plays: number;
  likes: number;
  isExplicit: boolean;
  featuredArtists: ObjectId[];
  timestamps: true
}
```

### Album

```typescript
{
  title: string;
  description: string;
  artist: ObjectId;
  releaseDate: Date;
  coverImage: string;
  songs: ObjectId[];
  genre: string;
  likes: number;
  isExplicit: boolean;
  timestamps: true
}
```

### Artist

```typescript
{
  name: string;
  bio: string;
  image: string;
  genres: string[];
  followers: number;
  albums: ObjectId[];
  isVerified: boolean;
  timestamps: true
}
```

### Playlist

```typescript
{
  name: string;
  description: string;
  coverImage: string;
  creator: ObjectId;
  songs: ObjectId[];
  isPublic: boolean;
  followers: number;
  collaborators: ObjectId[];
  timestamps: true
}
```

## Authentication

### JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication. To access protected routes:

1. **Login** using the `/api/users/login` endpoint
2. Receive a JWT token in the response
3. Include the token in subsequent requests:
   ```http
   Authorization: Bearer <your-token>
   ```

### Token Expiration

JWT tokens expire after **30 days**. Users must re-authenticate after expiration.

### Protected Routes

Routes marked as "protected" require a valid JWT token. Admin-only routes additionally require the user to have `isAdmin: true`.

---

## File Uploads

### Supported Formats

**Audio Files:**

- MP3 (`.mp3`)
- WAV (`.wav`)

**Image Files:**

- JPEG/JPG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)
- AVIF (`.avif`)

### File Size Limit

Maximum file size: **10MB**

### Upload Process

1. Files are temporarily stored locally using Multer
2. Files are uploaded to Cloudinary
3. Local files are automatically deleted after successful upload
4. Cloudinary URL is returned and stored in the database

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit:** 100 requests per 15 minutes
- **Scope:** Per IP address
- **Response:** 429 Too Many Requests (when limit exceeded)

---

## Scripts

| Command                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start development server with hot reload (tsx watch) |
| `npm run build`        | Compile TypeScript to JavaScript                     |
| `npm start`            | Start production server                              |
| `npm run lint`         | Run ESLint to check code quality                     |
| `npm run lint:fix`     | Auto-fix linting issues                              |
| `npm run format`       | Format code with Prettier                            |
| `npm run format:check` | Check code formatting                                |

---

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Invalid request data or missing required fields
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - User lacks required permissions
- **404 Not Found** - Requested resource not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server-side error

---

## Security Features

- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Rate limiting
- ✅ Input validation
- ✅ Secure file uploads
- ✅ Environment variable protection

---

## TypeScript Configuration

This project uses strict TypeScript with:

- **Target:** ES2021
- **Module:** ESNext
- **Strict mode:** Enabled
- **Decorators:** Enabled (for Typegoose)
- **Path aliases:** `@/*` → `./src/*`

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

ISC License

---

## Author

**Shamar Morrison**

---

<!--
## Future Enhancements

- [ ] Implement full playlist CRUD operations
- [ ] Add user interaction features (like/unlike songs, albums)
- [ ] Enhanced search functionality with full-text search
- [ ] Add streaming analytics dashboard
- [ ] Social features (comments, sharing)
- [ ] Recommendation engine based on listening history
- [ ] Real-time notifications
- [ ] API documentation with Swagger/OpenAPI -->
