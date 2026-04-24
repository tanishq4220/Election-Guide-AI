# Deployment Guide

This guide explains how to deploy the **Election Guide AI** application.

## 1. Backend Deployment (Render / Heroku)

1. Ensure your `backend` directory has a `package.json` with a `start` script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```
2. Push your code to GitHub.
3. Sign in to Render (render.com) and create a new **Web Service**.
4. Connect your GitHub repository.
5. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add the Environment Variables under the **Environment** tab:
   - `PORT`: (Render sets this automatically, but ensure your code uses `process.env.PORT`)
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `FIREBASE_SERVICE_ACCOUNT`: Stringified JSON of your Firebase service account (if needed) or individual keys.
7. Click **Deploy**. Note the URL (e.g., `https://election-ai-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

1. Navigate to the `frontend` directory.
2. In your `.env.local` or Next.js config, add the backend URL as an environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://election-ai-backend.onrender.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   ```
3. Push your code to GitHub.
4. Sign in to Vercel (vercel.com) and click **Add New...** -> **Project**.
5. Import your GitHub repository.
6. Set the **Framework Preset** to Next.js.
7. Set the **Root Directory** to `frontend`.
8. Add the Environment Variables (same as above).
9. Click **Deploy**.

## 3. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named "Election Guide AI".
3. Enable **Authentication** (Google Sign-In).
4. Enable **Firestore Database** (Start in production or test mode).
5. Add a Web App to your project to get your `firebaseConfig` keys.
6. For the backend, generate a Service Account Key from **Project Settings -> Service Accounts -> Generate new private key** for admin operations.

## 4. Post-Deployment Checks

- Verify the frontend loads over HTTPS.
- Test the Google Login flow.
- Send a message to the AI and ensure the backend is securely proxying the request to Gemini.
