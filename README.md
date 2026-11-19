# Ahmed Qotb Portfolio

A static React and TypeScript portfolio configured for GitHub Pages.

The welcome screen is available at `/welcome` beneath the configured base path. It appears on the first visit in a browser session; selecting **Explore My Portfolio** or **Skip Intro** opens the main portfolio and prevents the intro from repeating during that session. The **Intro** navigation item reopens it at any time.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The Vite base path is `/Ahmed-Qotb/`, matching the repository and GitHub Pages URL.

## Editing content

- Projects: `src/data/projects.json`
- Experience: `src/data/experience.json`
- Skills: `src/data/skills.json`
- Education: `src/data/education.json`
- Certifications: `src/data/certifications.json`
- Personal settings and links: `src/data/settings.json`

Add projects by appending a JSON object with localized `title` and `shortDescription`, `category`, `thumbnail`, `gallery`, `technologies`, `displayOrder`, `visibility`, and optional `liveDemoUrl` or `videoUrl`.

Place images in `public/images/` and videos in `public/videos/`. Use paths relative to `public`, such as `images/graphic/MyPoster.webp`.

Set `visibility` to `false` to hide a project without deleting it. Lower `displayOrder` values appear first.

## GitHub Pages deployment

Set the repository's Pages source to **GitHub Actions** in Settings > Pages. The workflow at `.github/workflows/deploy.yml` installs dependencies, builds the project, uploads `dist`, and deploys that artifact after pushes to `main`.
