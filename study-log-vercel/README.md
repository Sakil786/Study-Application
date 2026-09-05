# The Study Log

A single-page dashboard where students log what they study each day, subject
by subject, and track their progress over time. No build step, no backend —
just one HTML file.

## How data storage works

The app saves everything in the browser's own storage (`localStorage`) on
whatever device it's opened on. That means:

- Data stays on that one device/browser. It is **not** synced across devices
  or shared between students unless they use the same browser.
- Multiple students can use the same browser one after another — the app's
  built-in profile switcher (top-right corner) keeps each student's subjects
  and entries separate.
- There is no server and no account system, so there's nothing to configure
  or pay for beyond hosting the static file itself.

## Deploy to Vercel

You only need `index.html` — `vercel.json` is optional (it just enables
clean URLs) and this `README.md` is just documentation.

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
cd study-log-vercel
vercel --prod
```

Follow the prompts (log in, confirm the project name). Vercel will print a
live URL when it's done.

### Option B — Vercel dashboard, no Git required

1. Go to https://vercel.com/new
2. Choose **"Deploy without Git"** (drag-and-drop).
3. Drag this whole folder (or just `index.html`) onto the page.
4. Click **Deploy**.

### Option C — GitHub + Vercel (best for future updates)

1. Create a new GitHub repo and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to https://vercel.com/new and import that repo.
3. Leave the framework preset as **"Other"** / static — no build command is
   needed. Click **Deploy**.
4. Any future `git push` to `main` will redeploy automatically.

## Local preview

You can also just open `index.html` directly in a browser to try it before
deploying — no server required.
