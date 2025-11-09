# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A RESTful API for a music streaming service built with Node.js, Express, TypeScript, MongoDB (Typegoose), and Cloudinary. The API supports user authentication, CRUD operations for songs/albums/artists/playlists, file uploads, advanced filtering, and role-based access control.

## Development Commands

### Running the Application
- `npm run dev` - Start development server with hot reload (uses tsx watch)
- `npm run build` - Compile TypeScript to JavaScript, generate Swagger JSON, and copy public folder to dist
- `npm start` - Start production server from compiled dist/ folder

### Code Quality
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files

### Build Steps
The build process (`npm run build`) runs three steps:
1. `tsc` - Compile TypeScript
2. `tsc-alias` - Replace path aliases (e.g., `@/*` → `./src/*`)
3. `npm run build:swagger` - Generate static Swagger JSON file via `src/scripts/generate-swagger-json.ts`
4. `npm run copy:public` - Copy public/ folder to dist/ for Vercel deployment

## Architecture

### Deployment Model
The API is designed for **Vercel serverless deployment**:
- `api/index.ts` exports the Express app as default for Vercel's serverless functions
- `vercel.json` rewrites all requests to `/api`
- Server only calls `app.listen()` when `NODE_ENV !== "production"`
- Public folder path adjusts for Vercel's directory structure (`process.env.VERCEL` flag)

### Authentication & Authorization
- **JWT-based authentication** with 30-day token expiration
- Password hashing uses bcrypt with 12 salt rounds (pre-save hook in User model)
- Two middleware guards in `src/middlewares/auth.middleware.ts`:
  - `protect` - Validates JWT token, attaches `req.user` object
  - `isAdmin` - Requires `req.user.isAdmin === true`
- JWT secret stored in `JWT_SECRET` environment variable
- User model has instance methods: `comparePassword()` and `generateToken()`

### Database Models (Typegoose)
All models use Typegoose decorators (`@modelOptions`, `@prop`, `@pre`) for type-safe Mongoose schemas:

- **User** (`src/models/user.model.ts`)
  - Pre-save hook automatically hashes passwords
  - References: likedSongs, likedAlbums, followedArtists, followedPlaylists
  - Instance methods for password comparison and token generation

- **Song** (`src/models/song.model.ts`)
  - References: artist (required), album (optional), featuredArtists[]
  - Tracks plays, likes, and analytics

- **Album** (`src/models/album.model.ts`)
  - References: artist (required), songs[]
  - Contains release metadata and genre information

- **Artist** (`src/models/artist.model.ts`)
  - Contains genres[], albums[], followers count
  - Has `isVerified` boolean flag

- **Playlist** (`src/models/playlist.model.ts`)
  - References: creator, songs[], collaborators[]
  - Supports public/private playlists

### File Upload System
Two-step process using Multer + Cloudinary:

1. **Multer** (`src/middlewares/upload.ts`)
   - Temporarily stores files in `uploads/` directory
   - 10MB file size limit
   - Accepts: MP3, WAV (audio); JPEG, PNG, WebP, AVIF (images)
   - Generates timestamped filenames

2. **Cloudinary** (`src/utils/cloudinary-upload.ts`)
   - `uploadToCloudinary(filePath, folder)` uploads to cloud storage
   - Automatically deletes local file after successful upload
   - Deletes local file even on error to prevent orphaned temp files
   - Configuration in `src/config/cloudinary.ts` (uses env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

### Path Aliases
TypeScript paths configured in `tsconfig.json`:
- `@/*` maps to `./src/*`
- Must run `tsc-alias` after compilation to resolve aliases in compiled JS

### Rate Limiting
Global rate limiter in `src/utils/rate-limiter.ts`:
- 100 requests per 15 minutes per IP address
- Applied to all routes via `app.use(limiter)` in server.ts

### Error Handling
Global error handler in `src/server.ts`:
- Returns JSON with `{ message, status }` format
- 404 handler for undefined routes
- Uses `express-async-handler` wrapper in controllers to catch async errors

### API Documentation
Swagger/OpenAPI 3.0 documentation:
- Interactive UI served at `/api-docs`
- Static Swagger UI HTML served at root path `/`
- Configuration in `src/config/swagger.ts`
- JSDoc comments in route files (`src/routes/*.ts`) auto-generate API specs
- Build script generates static `swagger.json` for production

## Environment Variables

Required variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/music-api
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Key Conventions

### TypeScript Configuration
- Strict mode enabled
- Legacy decorators enabled for Typegoose (`experimentalDecorators: true`, `useDefineForClassFields: false`)
- ES modules (`"type": "module"` in package.json)
- Node.js v20+ required

### Route Organization
Each resource has its own router file:
- `src/routes/user.routes.ts` - Authentication, user profile
- `src/routes/songs.routes.ts` - Song CRUD, filtering
- `src/routes/albums.routes.ts` - Album CRUD
- `src/routes/artist.routes.ts` - Artist CRUD, top songs

Admin-only routes use both `protect` and `isAdmin` middleware.

### Controller Pattern
All controllers use `express-async-handler` to handle async/await errors automatically without try/catch blocks.

### Query Filtering
Songs and Artists support advanced filtering via query params:
- Songs: `?genre=rock&artist=artistId&album=albumId&search=title&page=1&limit=10`
- Artists: `?genre=rock&search=name&page=1&limit=10`
- Pagination: default page=1, limit=10

### MongoDB Relationships
- ObjectId references between models
- Use `.populate()` to fetch related data
- Typegoose `Ref<ModelType>[]` for array references
