# Vercel Deployment Guide for Fullstack Chat App

This guide will walk you through deploying both the frontend and backend of your chat application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [GitHub account](https://github.com/signup) (recommended for easier deployment)
3. [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) for database hosting

## Step 1: Prepare Your MongoDB Database

1. Create a MongoDB Atlas cluster if you don't have one already
2. Configure network access to allow connections from anywhere (for Vercel)
3. Create a database user with read/write permissions
4. Get your MongoDB connection string

## Step 2: Deploy the Backend

1. Push your code to a GitHub repository (recommended)

2. Log in to your Vercel account and click "New Project"

3. Import your GitHub repository

4. Configure the project:
   - Set the root directory to `backend`
   - Set the build command to `npm install`
   - Set the output directory to `src`
   - Set the development command to `npm run dev`

5. Add the following environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app (after frontend deployment)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

6. Deploy the backend

7. After deployment, note the URL of your backend (e.g., `https://your-backend-url.vercel.app`)

## Step 3: Deploy the Frontend

1. Update your frontend environment file:
   - Edit the `.env.production` file to include your backend URL:
   ```
   VITE_API_BASE_URL=https://ai-powered-chatapp-tnaa.vercel.app
   ```

2. Push the updated code to your GitHub repository

3. Log in to your Vercel account and click "New Project"

4. Import your GitHub repository

5. Configure the project:
   - Set the root directory to `frontend`
   - Set the build command to `npm run build`
   - Set the output directory to `dist`
   - Set the development command to `npm run dev`

6. Add the following environment variables:
   ```
   VITE_API_BASE_URL=https://ai-powered-chatapp-tnaa.vercel.app
   ```

7. Deploy the frontend

## Step 4: Update Backend with Frontend URL

1. Go to your backend project settings in Vercel

2. Update the `FRONTEND_URL` environment variable with your frontend URL (e.g., `https://your-frontend-url.vercel.app`)

3. Redeploy the backend

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test real-time messaging functionality
4. Verify that all features are working correctly

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Verify that the `FRONTEND_URL` environment variable in your backend deployment is correct
2. Check that the CORS configuration in your backend code is properly using the environment variables

### Socket Connection Issues

If real-time messaging isn't working:

1. Check browser console for socket connection errors
2. Verify that the socket connection URL in the frontend is correctly pointing to your backend
3. Ensure that the socket.io configuration in the backend is properly set up for Vercel

### Cookie/Authentication Issues

If authentication isn't working:

1. Ensure that your cookies are being set with the correct domain
2. Check that `withCredentials: true` is set in your axios configuration
3. Verify that your JWT secret is properly set in the backend environment variables
4. Make sure cookie settings in `utils.js` are configured for cross-domain:
   ```javascript
   res.cookie("jwt", token, {
     maxAge: 7 * 24 * 60 * 60 * 1000,
     httpOnly: true,
     sameSite: "none", // Required for cross-domain cookies
     secure: true, // Required when sameSite is 'none'
   });
   ```
5. Ensure the `FRONTEND_URL` environment variable is correctly set in your backend Vercel deployment to your frontend URL

## Additional Notes

- Vercel's free tier has limitations on serverless function execution time, which might affect long-running socket connections
- Consider implementing reconnection logic in your socket implementation for better reliability
- For production applications with heavy usage, you might need to upgrade to a paid plan or consider alternative hosting solutions for the backend

## Maintenance

After deployment, monitor your application for any issues and regularly update your dependencies to ensure security and performance.