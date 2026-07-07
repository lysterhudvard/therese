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
