---
description: How to deploy the application to Vercel
---

# Deploying to Vercel

Vercel is a popular platform for deploying frontend applications like this Vite + React app. It provides free hosting for personal projects and is very easy to set up.

## Prerequisites

1.  **GitHub Account**: You need a GitHub account to host your code repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

## Step 1: Push Code to GitHub

If you haven't already, you need to push your local code to a GitHub repository.

1.  Create a new repository on GitHub (e.g., `compound-interest-app`).
2.  Run the following commands in your terminal (if you haven't linked it yet):

```bash
git remote add origin https://github.com/YOUR_USERNAME/compound-interest-app.git
git branch -M main
git push -u origin main
```

## Step 2: Import into Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  You should see your GitHub repository list. Find `compound-interest-app` and click **"Import"**.

## Step 3: Configure and Deploy

1.  Vercel will automatically detect that it's a **Vite** project.
2.  The default settings should be correct:
    *   **Framework Preset**: Vite
    *   **Build Command**: `vite build` (or `npm run build`)
    *   **Output Directory**: `dist`
3.  Click **"Deploy"**.

## Step 4: Live!

Vercel will build your project and deploy it. Within a minute or two, you'll get a live URL (e.g., `https://compound-interest-app.vercel.app`) that you can share with anyone!

## Alternative: Netlify

You can also use Netlify:
1.  Sign up at [netlify.com](https://www.netlify.com/).
2.  Drag and drop your `dist` folder (after running `npm run build` locally) into their dashboard for a manual deploy, OR connect your GitHub repo similar to Vercel for automatic updates.
