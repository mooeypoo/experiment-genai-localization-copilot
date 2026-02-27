# GenAI Incremental Localization Experiment (Copilot)

**Pulseboard** is a tiny social-style demo app built for fast experiments. This repository documents an experiment in AI-assisted localization development, examining how GitHub Copilot makes decisions when incrementally adding internationalization features.

## Live Demo

View the experiment at: [https://mooeypoo.github.io/experiment-genai-steps-copilot/](https://mooeypoo.github.io/experiment-genai-steps-copilot/)

## Local Development

### Running the app locally

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for production

```bash
npm run build
npm run preview
```

## GitHub Pages Build System

This repository uses a custom build pipeline to deploy all historical steps to GitHub Pages. Each `step-*` git tag is built as a separate static site with a global shell interface.

### How Steps Are Discovered

The build system automatically discovers git tags matching the pattern `step-*` (e.g., `step-01`, `step-02`, etc.) and builds each one individually. Steps are sorted numerically by their step number.

### Step Descriptions

Each step's description is extracted from the first markdown heading (`# Heading`) in that step's agent notes file (`docs/agent-notes/XX.md`). For example, if `docs/agent-notes/07.md` starts with `# Agent Notes 07`, the description will be "Agent Notes 07".

### What Gets Built

For each step tag:
1. The Vue app is built with the correct base path (`/repo-name/step-XX/`)
2. Agent notes (`docs/agent-notes/XX.md`) are rendered to HTML → `step-XX/notes.html`
3. Prompt file (`docs/prompts/XX.md`) is rendered to HTML → `step-XX/prompt.html` (if it exists)
4. A global shell is injected to provide navigation and sidebar

Additionally:
- A landing page lists all available steps
- An about page explains the experiment
- A `steps.json` metadata file is generated for the step selector

### Local Pages Build

To build the Pages site locally:

```bash
npm run build:pages
```

This creates a `dist-pages/` directory with the complete site structure. It will:
- Checkout each `step-*` tag
- Build that step's Vue app
- Extract metadata and render markdown
- Restore your original branch when complete

**Note:** The build script will temporarily stash any uncommitted changes and restore them afterward.

To preview the built Pages site locally:

```bash
npm run preview:pages
```

This serves the `dist-pages/` directory at `http://localhost:3000` (or similar).

### GitHub Actions Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/pages.yml`) that automatically builds and deploys to GitHub Pages when:
- Pushing to the `main` branch
- Creating a new `step-*` tag
- Manually triggering the workflow

The workflow:
1. Fetches all git history and tags
2. Runs `node scripts/build-pages.js` to build all steps
3. Uploads the `dist-pages/` directory as a Pages artifact
4. Deploys to GitHub Pages

**No secrets or tokens are required** - the workflow uses GitHub's built-in `GITHUB_TOKEN` and official Pages actions.

### File Structure

```
.github/workflows/
  pages.yml               # GitHub Actions workflow
scripts/
  build-pages.js          # Build script (local + CI)
pages/
  index.html              # Landing page template
  about.html              # About page template
  shell/
    shell.js              # Global shell logic
    shell.css             # Global shell styles
docs/
  agent-notes/
    XX.md                 # Agent notes for each step
  prompts/
    XX.md                 # Prompts for each step (optional)
```

### Global Shell

The global shell provides a consistent navigation and viewing experience across all steps. It includes:

- **Top bar**: Step selector dropdown, home/about links, copy link button, mobile hamburger
- **Sidebar**: Rendered agent notes and prompt for the current step
- **Footer**: Attribution link

The shell is "global/latest" meaning it's not part of any step's git history. This allows the viewing experience to improve over time while keeping historical step code frozen.

### Routing Strategy

- The Vue app uses hash-based routing (`#/`) for SPA navigation within each step
- This ensures deep links work on GitHub Pages without server-side configuration
- The global shell detects the current step from the URL path

## Versioned Steps

Experiment milestones are tagged using git tags named `step-XX`:

```bash
git tag step-01
git tag step-02
# etc.
```

Each tag represents a snapshot of the app at a specific stage of localization development. The agent notes for each step document decisions, tradeoffs, ambiguities, and implementation rationale.

## What This Demo Includes

- Vue 3 Composition API, vanilla JavaScript
- Vue I18n for internationalization (added incrementally)
- Hash-based routing for static hosting
- Seeded JSON for posts, users, and comments
- In-memory data module that resets on refresh
- Support for 7 languages including RTL scripts
- Locale-aware formatting and sorting

## Documentation

Comprehensive agent notes are available for each step in `docs/agent-notes/`. These documents include:

1. Summary of changes
2. Decisions & rationale
3. Ambiguities encountered
4. Tradeoffs made
5. Non-goals
6. Files changed
7. Manual verification checklist
8. Known issues and follow-ups

## Contributing

This is a research/documentation repository. The steps are historical exhibits and should not be modified. However, improvements to the Pages build system, shell, or documentation are welcome.

## License

MIT

## Author

Made by [Moriel Schottlender](https://moriel.tech)

