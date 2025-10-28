# Music API - Swagger Documentation Deployment

This document explains how to deploy the Music API with Swagger documentation to Vercel.

## 🚀 Deployment to Vercel

### Prerequisites

- Vercel CLI installed (`npm i -g vercel`)
- Vercel account connected
- MongoDB connection string ready

### Steps to Deploy

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Build the project** (generates swagger.json):

   ```bash
   npm run build
   ```

   This will:
   - Compile TypeScript
   - Generate Swagger JSON from JSDoc comments
   - Create the `/public` folder with static files

3. **Deploy to Vercel**:

   ```bash
   vercel
   ```

   Or deploy to production:

   ```bash
   vercel --prod
   ```

### Environment Variables

Make sure to set these environment variables in Vercel:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `PORT` (optional) - Server port (defaults to 5000)

You can set these via:

- Vercel Dashboard → Project Settings → Environment Variables
- Or during deployment: `vercel env add MONGODB_URI`

### Access Points

After deployment, your API documentation will be accessible at:

**Production**: `https://your-project.vercel.app/`

- Main Swagger UI: `https://your-project.vercel.app/`
- Swagger JSON: `https://your-project.vercel.app/swagger.json`
- Server API: `https://your-project.vercel.app/api/*`

**Development**: `http://localhost:5000`

- Main Swagger UI: `http://localhost:5000/`
- Swagger JSON: `http://localhost:5000/swagger.json`
- Server API: `http://localhost:5000/api/*`

### Features

✅ **Standalone Swagger UI** - No server required to view documentation
✅ **Interactive Testing** - Test endpoints directly from the browser
✅ **Authentication Support** - JWT Bearer token authentication
✅ **Portfolio Ready** - Can be embedded or linked from your portfolio
✅ **Auto-generated** - Documentation stays in sync with code

### File Structure

```
music-api/
├── public/                    # Static files for Swagger UI
│   ├── index.html            # Standalone Swagger UI
│   └── swagger.json          # Generated OpenAPI specification
├── src/
│   ├── routes/              # Route files with JSDoc comments
│   ├── config/
│   │   └── swagger.ts       # Swagger configuration
│   └── scripts/
│       └── generate-swagger-json.ts  # Script to generate swagger.json
├── vercel.json              # Vercel deployment configuration
└── package.json             # Build scripts
```

### Updating Documentation

To update the Swagger documentation after changing routes:

1. Update the JSDoc comments in route files
2. Run `npm run build` to regenerate swagger.json
3. Commit and push to trigger deployment, or redeploy manually

### Adding to Your Portfolio

You can link to your API documentation from your portfolio:

```html
<a href="https://your-project.vercel.app/" target="_blank">
  Music API Documentation
</a>
```

Or embed it in an iframe (adjust height as needed):

```html
<iframe
  src="https://your-project.vercel.app/"
  width="100%"
  height="800px"
  frameborder="0"
>
</iframe>
```

### Troubleshooting

**Issue**: Swagger UI not loading

- **Solution**: Make sure `public/swagger.json` exists and is being served

**Issue**: API requests fail with CORS

- **Solution**: Check that your API is properly deployed and `/api/*` routes are working

**Issue**: Documentation doesn't update

- **Solution**: Run `npm run build` to regenerate swagger.json before deploying

### Notes

- The standalone Swagger UI uses CDN links, so no additional dependencies are needed
- The `swagger.json` file is generated from JSDoc comments in your route files
- Make sure to keep JSDoc comments up to date with your API changes
