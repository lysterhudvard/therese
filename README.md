# Therese Järvheden — Portfolio & Backstage CMS

A modern, highly optimized portfolio and administration CMS built with **Astro**, **React**, **Tailwind CSS v4**, and **Supabase**.

---

## 🚀 Deploys & Hosting (Vercel)

This project is prepared for automatic static deployment on **Vercel**. Every time you push to the `main` branch, Vercel will rebuild and publish your site.

### Vercel Deployment Instructions:

1. **Push the repository to GitHub** (see below).
2. Go to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your GitHub repository: `lysterhudvard/therese`.
4. Vercel will automatically detect **Astro** as the framework preset.
5. **Configure Environment Variables** in the Vercel project settings:
   * `VITE_SUPABASE_URL` = (Your Supabase URL)
   * `VITE_SUPABASE_ANON_KEY` = (Your Supabase Anon/Public Key)
6. Click **Deploy**. Vercel will build the site using `astro build` and publish it statically.

---

## 🚀 Deploys & Hosting (Hostinger)

Because this website builds into static files, it runs perfectly on Hostinger Shared Hosting or Cloud Hosting.

### Option A: Automatic Deployment with GitHub Actions (Recommended)

A GitHub Actions workflow is pre-configured in `.github/workflows/deploy.yml` to build the site and deploy it to Hostinger via FTP automatically whenever you push to the `main` branch.

1. Go to your GitHub repository `lysterhudvard/therese` settings -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following **Repository secrets**:
   * `FTP_SERVER` = Your Hostinger FTP Hostname (e.g., `ftp.yourdomain.com` or Hostinger IP)
   * `FTP_USERNAME` = Your Hostinger FTP Username
   * `FTP_PASSWORD` = Your Hostinger FTP Password
   * `VITE_SUPABASE_URL` = Your Supabase Project URL
   * `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon/Public API Key
3. Push your repository to GitHub. The action will trigger automatically, build the static site, and upload it to your Hostinger `public_html` directory.

### Option B: Manual Upload via FTP/Hostinger File Manager

1. Set up a local `.env` file with your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Build the website locally:
   ```bash
   npm run build
   ```
3. Use an FTP client (like FileZilla) or the Hostinger File Manager in hPanel to upload the entire contents of the **`dist/`** directory (not the folder itself, just its contents) to your Hostinger **`public_html/`** folder.

---

## 📦 Git & GitHub Setup

The local git repository has been prepared to push to your primary repository.

### How to push your changes:

Open your terminal in this directory and run:

```bash
git push -u origin main
```

*Note: The Lovable template remote has been renamed to `lovable` to keep your history synced and preserve the editor integrations.*

---

## 🛠️ Development & Local Run

To run the project locally in development mode:

```bash
# Install dependencies
npm install

# Run Astro dev server
npm run dev
```

The site will be available at `http://localhost:4321`.

### Build production locally:

To verify the production build and check image optimizations:

```bash
npm run build
npm run preview
```
