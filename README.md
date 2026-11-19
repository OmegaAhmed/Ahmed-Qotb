# Ahmed Qotb Portfolio

A static React and TypeScript portfolio configured for GitHub Pages.

The welcome screen is available at `/welcome` beneath the configured base path. It appears on the first visit in a browser session; selecting **Enter My Portfolio** or **Skip Intro** opens the main portfolio and prevents the intro from repeating during that session.

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

The Vite base path is configured as `/Ahmed-Qotb/` in `vite.config.ts` for this GitHub Pages project. Project asset paths below are relative to `public/`; the app applies the configured base path automatically.

## Editing content

- Projects: `src/data/projects.json`
- Experience: `src/data/experience.json`
- Skills: `src/data/skills.json`
- Education: `src/data/education.json`
- Certifications: `src/data/certifications.json`
- Personal settings and links: `src/data/settings.json`

### Add a website project

1. Add a preview image under `public/images/web/`, for example `public/images/web/my-site.webp`.
2. Append an object like this to the array in `src/data/projects.json`:

```json
{
  "id": "my-site",
  "title": { "en": "My Website" },
  "shortDescription": { "en": "A short description of the website." },
  "category": "web",
  "thumbnail": "images/web/my-site.webp",
  "gallery": ["images/web/my-site.webp"],
  "technologies": ["WordPress", "JavaScript"],
  "liveDemoUrl": "https://example.com",
  "featured": true,
  "displayOrder": 13,
  "visibility": true
}
```

Use a unique `id` and `displayOrder`. Add more screenshots to `gallery` to show them in **Project details**. `liveDemoUrl` is optional; `sourceCodeUrl` can also be added when relevant.

### Add a motion/video project

1. Put the video in `public/videos/`, for example `public/videos/my-animation.mp4`.
2. Append an object to `src/data/projects.json`:

```json
{
  "id": "my-animation",
  "title": { "en": "My Animation" },
  "shortDescription": { "en": "A short description of the video." },
  "category": "motion",
  "gallery": [],
  "videoUrl": "videos/my-animation.mp4",
  "technologies": ["Adobe After Effects"],
  "featured": true,
  "displayOrder": 13,
  "visibility": true
}
```

The motion card and its play button are generated from the project data. Use an MP4 encoded with H.264 for broad browser support.

### Add graphic design images

Graphic designs are displayed in the existing **Graphic** gallery. Add each image under `public/images/graphic/`, then add its path to the `gallery` array of the existing project with `"id": "graphic-gallery"` in `src/data/projects.json`:

```json
"gallery": [
  "images/graphic/existing-design.webp",
  "images/graphic/my-new-design.webp"
]
```

Keep paths relative to `public/`: use `images/...` or `videos/...`, with no leading slash and no `/Ahmed-Qotb/` prefix. Match filename capitalization exactly. Choose optimized image files (WebP is already used throughout the portfolio).

Set `visibility` to `false` to hide a project without deleting it. Lower `displayOrder` values appear first. After editing, run `npm run build`, then check the new card or artwork in the local site.

## GitHub Pages deployment

Set the repository's Pages source to **GitHub Actions** in Settings > Pages. The workflow at `.github/workflows/deploy.yml` installs dependencies, builds the project, uploads `dist`, and deploys that artifact after pushes to `main`.
