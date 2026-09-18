# Deployment Guide

This document describes how to deploy the frontend to Vercel, backend to Render, and create a MongoDB Atlas database.

## 1) Create a MongoDB Atlas cluster

- Go to https://cloud.mongodb.com and create a free cluster.
- Create a database user (username & password) and whitelist your app IPs or allow access from anywhere (0.0.0.0/0) for testing.
- Copy the connection string and replace the placeholders, e.g.:
  - `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`
- Set the connection string as `MONGODB_URI` when deploying the backend.

## 2) Deploy backend to Render

- Option A (recommended): Connect this GitHub repository in Render and enable the `render.yaml` manifest — Render will use the `medcore-server` service defined there.
- Option B: Create a new Web Service in Render linked to this repo and set:
  - Build command: `cd server && npm install`
  - Start command: `cd server && npm start`
  - Environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`, `CORS_ORIGIN`, `CLIENT_URL`.

## 3) Deploy frontend to Vercel

- Connect this GitHub repository in Vercel (or use the Vercel CLI).
- Vercel will use `vercel.json`. The `outputDirectory` is `client/dist` and build command is `cd client && npm run build`.
- Set environment variable `VITE_API_URL` to your backend URL (e.g. `https://<your-backend>.onrender.com/api`).
- Alternatively, from the command line:

```bash
npm i -g vercel
vercel login
cd client
vercel --prod --confirm
```

## 4) Notes and best practices

- Do not commit real secrets. `server/.env` is ignored by `.gitignore`. Use `server/.env.example` as a template.
- Rotate any credentials that were exposed publicly.
- For CI/CD, set the same environment variables in the Render dashboard and Vercel project settings.
