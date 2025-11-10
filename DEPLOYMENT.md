# Music API - Deployment Guide

This document explains how to deploy the Music API with interactive Swagger documentation to Railway or Render as a traditional Node.js server.

## 🚀 Deployment Options

### Prerequisites

Before deploying, ensure you have:
- MongoDB database URL (MongoDB Atlas recommended)
- Cloudinary account credentials
- GitHub account (for auto-deployment)

---

## Option 1: Deploy to Render

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository

### Step 3: Configure Deployment
Render will auto-detect the `render.yaml` file. Add environment variables:

1. Go to "Environment" tab
2. Add the following variables:
   - `API_BASE_URL` - Your Render app URL (e.g., `https://music-api-xxx.onrender.com`)
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
   - `CLOUDINARY_API_KEY` - From Cloudinary dashboard
   - `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

3. Click "Deploy"

### Step 4: Access Your API
- **Swagger UI**: `https://your-app.onrender.com/`
- **Swagger Docs**: `https://your-app.onrender.com/api-docs`
- **API Endpoints**: `https://your-app.onrender.com/api/*`

---

## Option 2: Deploy to Railway

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

### Step 3: Configure Environment Variables
Add the following in the "Variables" tab:
```
NODE_ENV=production
PORT=5000
API_BASE_URL=https://your-app.up.railway.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/music-api
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 4: Deploy
Railway will auto-deploy and provide a public URL. Update `API_BASE_URL` with this URL and redeploy.

### Step 5: Access Your API
- **Swagger UI**: `https://your-app.up.railway.app/`
- **Swagger Docs**: `https://your-app.up.railway.app/api-docs`
- **API Endpoints**: `https://your-app.up.railway.app/api/*`

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `API_BASE_URL` | Optional | Your deployed app URL | `https://music-api.onrender.com` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret key for JWT tokens | Random string |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name | From dashboard |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key | From dashboard |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret | From dashboard |

---

## Testing Your Deployment

Once deployed, test your API:

1. **Visit Swagger UI**: Open your app URL in browser
2. **Test Authentication**:
   - Register a user via `/api/users/register`
   - Login via `/api/users/login`
   - Copy the JWT token
3. **Authorize**:
   - Click "Authorize" button in Swagger
   - Paste token
   - Test protected endpoints

---

## Troubleshooting

### Build Fails
- Verify all dependencies are in `package.json`
- Check Node.js version matches (20.x)

### Server Won't Start
- Check logs for database connection errors
- Verify `MONGODB_URI` is correct
- Ensure MongoDB allows connections

### Swagger Shows Wrong URL
- Set `API_BASE_URL` environment variable
- Redeploy after updating

### Database Connection Timeout
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify MongoDB credentials

### File Uploads Fail
- Check Cloudinary credentials
- Review Cloudinary dashboard for errors

---

## Auto-Deployment

Both platforms support auto-deployment:
- Push to `main` → Automatically deploys
- Configure in platform settings

---

## Cost Considerations

### Render Free Tier
- Free tier available
- App sleeps after 15 min inactivity
- 750 hours/month free

### Railway Free Tier
- $5 free credit monthly
- No auto-sleep
- Pay-as-you-go after credit

---

## Legacy Vercel Files

The following files are from the previous Vercel deployment and are **not needed** for Railway/Render:
- `api/index.ts` - Vercel serverless wrapper (not used)
- `vercel.json` - Vercel configuration (not used)

You can safely ignore or delete these files.
