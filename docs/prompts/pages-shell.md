We have a static Vue app with multiple historical stages tagged in git as step-01, step-02, … Each step contains docs/agent-notes/XX.md (with a first markdown heading that describes the step). I will also keep docs/prompts/step-XX.md for each step.

Now implement a GitHub Pages “global shell” viewer + deployment pipeline.

Naming / Branding
- Title/name of the site and shell: “GenAI Incremental Localization Experiment (Copilot)”
- Add a footer on all global pages (index/about) and on all step pages that says:
  “Made by Moriel Schottlender” linking to my website.
  Use this URL for the link:
  https://moriel.tech

Core Goal
- Create a GitHub Pages site that lets people browse the app at each step-* git tag.
- The shell should be modern, minimal, clean (good typography, generous spacing, accessible contrast, responsive).
- The shell itself should NOT be part of the step dropdown (so do not create a step-* tag or otherwise include the shell as a selectable step).

Landing Page (/)
- Create a global landing page (site root) that:
  - Shows the site name (“GenAI Incremental Localization Experiment (Copilot)”).
  - Explains the experiment goal in plain language:
    We’re examining the decisions and operation of an AI coding assistant as we incrementally add localization constraints to an app, and observing what it chooses, what it misses, and how it adapts.
  - Provides a list of available steps (auto-discovered from tags matching step-*), where each step item includes:
    - The step tag (e.g. step-07)
    - A short “what this step is about” label extracted from the first markdown heading in that step’s docs/agent-notes/XX.md
  - Clicking a step navigates to /step-XX/

About Page (/about/)
- Create a global About page that:
  - Repeats the purpose of the experiment (briefly).
  - Links to the GitHub repository.
  - Explains that each step is built from a git tag.
  - Explains that the sidebar shows:
    - agent notes for that step
    - the prompt used for that step (if available)
  - Includes a placeholder for a future video link (no actual link yet).
  - Includes “Made by Moriel Schottlender” linking to https://moriel.tech (in addition to footer if you have one).

Global Shell UI (applies on /step-XX/)
Implement a global/latest shell that wraps every step page:

Top bar
- A step selector (dropdown or similar) populated automatically from available step-* tags.
- Each option should show:
  - step tag
  - and the “what this step is about” label (from that step’s agent-notes first heading).
- Current step should be clearly indicated.
- Link to Home (index) and About.
- “Link to this step” button:
  - copies the full URL to clipboard
  - shows a subtle “copied” feedback state
- Hamburger icon to toggle the sidebar on small screens.

Sidebar / drawer
- Show rendered HTML of the agent notes for the current step.
- Also show rendered HTML of the prompt for the current step (if present).
- If agent notes or prompt is missing, show a friendly fallback.
- Desktop: sidebar visible by default (or clearly toggled).
- Mobile: sidebar collapsed by default; hamburger toggles it.

Footer
- Footer should appear on step pages too and include:
  “Made by Moriel Schottlender” linking to https://moriel.tech

Important constraint: the shell must be global/latest (single source of truth for the chrome) so that updating index/about/shell styling doesn’t require rebuilding every step. Steps should remain historical exhibits.

Build / Deployment Requirements (GitHub Pages)
- Use GitHub Actions to build and deploy to GitHub Pages.
- Do not introduce secrets. Do not require adding any tokens to the repo. Use official Pages actions and default tokens/permissions.
- Workflow must:
  1) Discover tags matching step-* (sorted).
  2) For each step tag:
     - checkout that tag
     - install dependencies
     - build the Vue app for static hosting under /<repo>/step-XX/ (ensure correct base path so assets load)
     - generate step metadata:
       - Render docs/agent-notes/XX.md → a served HTML file under that step folder (e.g. notes.html)
       - Render docs/prompts/step-XX.md → a served HTML file under that step folder (e.g. prompt.html) IF it exists; otherwise create a friendly placeholder HTML (do not fail the build)
       - Extract the first markdown heading text from docs/agent-notes/XX.md and store it as the step description used by the dropdown/list.
  3) Generate a global steps.json (or similar) at the site root that includes, for each step:
     - tag name
     - step description (from agent-notes first heading)
  4) Generate the global landing page and about page (global/latest).
  5) Include global shell assets at stable paths (e.g. /shell/*) that:
     - detect current step from URL
     - load steps.json
     - render the top bar + footer + sidebar chrome
     - fetch and display that step’s notes.html and prompt.html inside the sidebar
     - implement step switching navigation
     - implement copy-link behavior
- Routing must work on refresh on GitHub Pages. Use a robust static-safe approach (hash routing for the built step apps OR a GitHub Pages SPA fallback strategy). Ensure it works when opening a deep link directly.

Local build requirement
- Add a script that allows building the same Pages output locally (for example generating a ./site or ./dist-pages folder with the same structure the GitHub Action deploys).
- Expose it via package.json scripts (e.g., “build:pages” and optionally “preview:pages”).
- Local build should not compromise the GitHub Actions build. They should produce the same site structure.

Separation Requirements
- Keep the “Pages viewer” system isolated as much as possible (dedicated folders like .github/ and a scripts folder).
- Avoid modifying the historical step app code across tags; prefer wrapping/postprocessing outputs or adding global shell outside the step builds.
- Do not rewrite or move existing step-* tags.

README updates
- Update README to explain:
  - local dev (how to run the app)
  - how to run the local Pages build script
  - how GitHub Pages build works
  - how steps are discovered and how step descriptions are derived
  - where prompts and agent notes live

Finish by writing docs/agent-notes/pages-shell.md (or similar name that is NOT step-XX) with thorough reasoning:
1) Summary
2) Decisions & Rationale
3) Ambiguities Encountered (options + resolution)
4) Tradeoffs
5) Non-Goals
6) Files Changed
7) Manual Verification Checklist (include local build + Pages deployment)
8) Known Issues / Follow-ups

Use good judgment, keep the design modern/minimal, and keep the system maintainable and future-proof.
