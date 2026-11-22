# MASTER TYPING

A responsive typing-practice and competitive-typing starter website built with React, TypeScript and Vite.

## Run on your computer

1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open Terminal and run:

   ```bash
   npm install
   npm run dev
   ```

   On Windows PowerShell, if `npm` is blocked, use `npm.cmd install` and `npm.cmd run dev`.

4. Open the local URL shown in the terminal.

## Publish to this GitHub Pages repository

This project is already configured for:

`https://abduysfzix1.github.io/Type-your-Mind/`

1. Upload the **contents** of this folder to the root of your GitHub repository `Type-your-Mind` (not the ZIP itself).
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. The included workflow `.github/workflows/deploy.yml` will build and deploy when you push to the `main` branch.
5. Open the **Actions** tab and wait for “Deploy MASTER TYPING to GitHub Pages” to finish successfully.

If your repository's default branch is `master` rather than `main`, change `branches: [main]` in the workflow to `branches: [master]`.

## Current functionality

- Responsive landing page and navigation
- Typing test with 15, 30, 60 and 120 second durations
- Live WPM, accuracy and error calculations
- Local browser history and sample leaderboard UI

Typing history is saved only in the current browser using localStorage. This starter does not yet include cloud accounts, Supabase synchronization, or a verified global leaderboard.
