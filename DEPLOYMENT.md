# Deployment Guide: Hosting IHatePDF on the Web

This guide provides step-by-step instructions for deploying the IHatePDF application. The deployment process is split into two parts:

1.  **Frontend Deployment:** The user interface (the static website) will be hosted on **Netlify**, which is perfect for fast, modern web projects.
2.  **Backend Deployment:** The Node.js server, which handles file processing, needs to be hosted on a platform that supports persistent servers and system dependencies (like **Render** or **Heroku**).

---

## Step 1: Push Your Project to GitHub

Before you can deploy the application, your code needs to be in a GitHub repository.

1.  **Create a GitHub Repository:**
    *   Go to [GitHub](https://github.com/new) and create a new repository. You can name it `ihatepdf` or any other name you prefer.
    *   Do **not** initialize it with a README or .gitignore file, as your project already has these.

2.  **Push Your Local Code to the Repository:**
    *   In your local project directory, initialize Git, add the remote repository, and push your code. Replace `<YOUR_USERNAME>` and `<YOUR_REPOSITORY_NAME>` with your details.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
    git push -u origin main
    ```

---

## Step 2: Deploy the Frontend to Netlify

Netlify will automatically build and deploy your frontend whenever you push changes to your GitHub repository.

1.  **Sign Up for Netlify:**
    *   Go to [Netlify](https://www.netlify.com/) and sign up using your GitHub account.

2.  **Create a New Site from Git:**
    *   From your Netlify dashboard, click **"Add new site"** and select **"Import an existing project"**.
    *   Connect to GitHub and authorize Netlify to access your repositories.
    *   Choose the GitHub repository you just created.

3.  **Configure Build Settings:**
    *   Netlify will likely detect that you are using a Vite project. The settings should be automatically configured as follows:
        *   **Build command:** `npm run build`
        *   **Publish directory:** `dist`
    *   If these settings are not pre-filled, enter them manually.

4.  **Add Environment Variable:**
    *   Before deploying, you need to tell the frontend where to find your backend API.
    *   Go to **Site settings > Build & deploy > Environment**.
    *   Click **"Edit variables"** and add a new variable:
        *   **Key:** `VITE_BACKEND_URL`
        *   **Value:** Enter the URL of your deployed backend (from Step 3). For now, you can leave this blank and update it later.

5.  **Deploy the Site:**
    *   Click the **"Deploy site"** button. Netlify will start building and deploying your frontend. Once it's done, you'll have a live URL for your application!

---

## Step 3: Deploy the Backend

The backend cannot be hosted on Netlify because it's a long-running Node.js server that relies on system dependencies (`Ghostscript`, `LibreOffice`). A platform-as-a-service (PaaS) like Render is a great alternative.

1.  **Sign Up for a Backend Hosting Service:**
    *   We recommend using [Render](https://render.com/), which has a free tier for web services. Sign up with your GitHub account.

2.  **Create a New Web Service on Render:**
    *   From your Render dashboard, click **"New +"** and select **"Web Service"**.
    *   Connect your GitHub account and select your repository.

3.  **Configure the Backend Service:**
    *   **Name:** Give your service a name (e.g., `ihatepdf-backend`).
    *   **Root Directory:** `backend` (This is important, as your backend code is in a subdirectory).
    *   **Runtime:** `Node`.
    *   **Build Command:** `npm install`.
    *   **Start Command:** `node server.js`.
    *   **Instance Type:** Choose the free tier.

4.  **Add System Dependencies:**
    *   Render allows you to install system packages using a `render.yaml` file. You will need to create this file in the root of your project.
    *   *Note: This is an advanced step. You may need to consult Render's documentation on how to install system dependencies.*

5.  **Deploy the Backend:**
    *   Click **"Create Web Service"**. Render will build and deploy your backend.
    *   Once deployed, Render will provide you with a public URL for your backend (e.g., `https://ihatepdf-backend.onrender.com`).

---

## Step 4: Final Configuration

Now that both the frontend and backend are deployed, you need to connect them.

1.  **Update the Frontend Environment Variable:**
    *   Go back to your Netlify dashboard.
    *   Navigate to **Site settings > Build & deploy > Environment**.
    *   Edit the `VITE_BACKEND_URL` variable and paste in the URL of your deployed backend from Render.

2.  **Redeploy the Frontend:**
    *   Go to the **"Deploys"** tab for your site on Netlify and trigger a new deploy to apply the environment variable change.

Your application is now live! The frontend hosted on Netlify will make API requests to the backend hosted on Render to process files.
