# Vercel Deployment Guide for Africa Shop

## Setup Instructions

### 1. Create `.vercelignore` (Already Done ✓)
Ignores unnecessary files during build.

### 2. Environment Variables
In your Vercel Project Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url` with your actual backend URL once deployed.

### 3. Build Configuration
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install && cd frontend && npm install`

### 4. Deployment
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select your repository: `MonAfricaShop` or `shop`
4. Click "Import"
5. The build should complete automatically

### 5. Frontend Deployment
Your frontend will be live at: `https://your-project.vercel.app`

### 6. Backend Setup (Optional - For Full Stack)
If you want to deploy the backend too:
- Consider using Railway, Render, or Heroku
- Update `VITE_API_URL` in Vercel environment variables to your backend URL

## Troubleshooting

**Build fails with "vite: command not found"**
- This is fixed by the new root `package.json` with proper monorepo setup

**API calls return 404**
- Update the `VITE_API_URL` environment variable in Vercel dashboard
- Ensure your backend is running and accessible

**CORS errors**
- Configure CORS in your backend for the Vercel domain

## Next Steps

1. Redeploy on Vercel Dashboard
2. Wait for build to complete
3. Visit your live site
4. Deploy backend separately (recommended: Railway)
5. Update API URLs once backend is live
