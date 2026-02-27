#!/usr/bin/env node

/**
 * Build script for GitHub Pages deployment
 * 
 * This script:
 * 1. Discovers all step-* git tags
 * 2. Builds each step as a static site with correct base path
 * 3. Extracts step metadata (descriptions from agent notes)
 * 4. Renders markdown files to HTML (agent notes, prompts)
 * 5. Generates steps.json metadata
 * 6. Copies global shell assets
 * 7. Generates landing and about pages
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist-pages');
const REPO_NAME = 'experiment-genai-steps-copilot';

// Utility functions
function exec(command, options = {}) {
  try {
    return execSync(command, { 
      cwd: ROOT, 
      encoding: 'utf8',
      stdio: options.quiet ? 'pipe' : 'inherit',
      ...options 
    });
  } catch (error) {
    if (!options.ignoreError) throw error;
    return null;
  }
}

function log(message, ...args) {
  console.log(`[build-pages] ${message}`, ...args);
}

function renderMarkdown(markdown, title = '') {
  const html = marked.parse(markdown);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #0f172a;
      background: #ffffff;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      line-height: 1.3;
    }
    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    code {
      background: #eef2ff;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre {
      background: #eef2ff;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    a {
      color: #1d4ed8;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul, ol {
      margin: 1rem 0;
      padding-left: 2rem;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

function getStepNumber(tag) {
  const match = tag.match(/step-(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function getStepId(tag) {
  const match = tag.match(/step-(\d+)/);
  if (!match) return '00';
  return match[1].padStart(2, '0');
}

function getTagDescription(tag) {
  const result = exec(`git for-each-ref refs/tags/${tag} --format="%(contents:subject)"`, { quiet: true })
    .trim();
  return result || '';
}

// Main build function
async function buildPages() {
  log('Starting GitHub Pages build...');

  // Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    log('Cleaning dist-pages directory...');
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Read template files BEFORE stashing (to pick up any modified versions)
  const pagesDir = path.join(ROOT, 'pages');
  const indexTemplate = fs.readFileSync(path.join(pagesDir, 'index.html'), 'utf8');
  const aboutTemplate = fs.readFileSync(path.join(pagesDir, 'about.html'), 'utf8');

  // Copy shell assets before stashing (to pick up any modified versions)
  const shellDir = path.join(DIST_DIR, 'shell');
  fs.mkdirSync(shellDir, { recursive: true });
  if (fs.existsSync(path.join(pagesDir, 'shell'))) {
    fs.cpSync(path.join(pagesDir, 'shell'), shellDir, { recursive: true });
  }

  // Get current branch to restore later
  const currentBranch = exec('git rev-parse --abbrev-ref HEAD', { quiet: true }).trim();
  const hasUncommittedChanges = exec('git status --porcelain', { quiet: true }).trim();
  
  if (hasUncommittedChanges) {
    log('Warning: You have uncommitted changes. Stashing them temporarily...');
    exec('git stash push -m "build-pages temporary stash"');
  }

  try {
    // Discover step tags
    log('Discovering step-* tags...');
    const tagsOutput = exec('git tag -l "step-*"', { quiet: true });
    const tags = tagsOutput.trim().split('\n').filter(Boolean).sort((a, b) => {
      return getStepNumber(a) - getStepNumber(b);
    });

    if (tags.length === 0) {
      throw new Error('No step-* tags found');
    }

    log(`Found ${tags.length} steps: ${tags.join(', ')}`);

    const stepsMetadata = [];
    const tagDescriptions = Object.fromEntries(
      tags.map((tag) => [tag, getTagDescription(tag)])
    );

    // Build each step
    for (const tag of tags) {
      log(`\n=== Building ${tag} ===`);
      const stepNum = getStepNumber(tag);
      const stepId = getStepId(tag);
      const stepDir = path.join(DIST_DIR, tag);

      // Checkout tag
      log(`Checking out ${tag}...`);
      exec(`git checkout ${tag}`, { quiet: true });

      // Install dependencies
      log('Installing dependencies...');
      exec('npm install', { quiet: true });

      // Build Vue app with correct base path
      const basePath = './';
      log(`Building with base path: ${basePath}`);
      
      // Temporarily modify vite.config.js to set base path
      const viteConfigPath = path.join(ROOT, 'vite.config.js');
      const originalViteConfig = fs.readFileSync(viteConfigPath, 'utf8');
      const modifiedViteConfig = originalViteConfig.replace(
        'export default defineConfig({',
        `export default defineConfig({\n  base: '${basePath}',`
      );
      fs.writeFileSync(viteConfigPath, modifiedViteConfig);

      try {
        exec('npm run build');
      } finally {
        // Restore original vite.config.js
        fs.writeFileSync(viteConfigPath, originalViteConfig);
      }

      // Copy build output
      const distPath = path.join(ROOT, 'dist');
      if (!fs.existsSync(distPath)) {
        throw new Error(`Build failed for ${tag}: dist directory not found`);
      }
      
      fs.mkdirSync(stepDir, { recursive: true });
      fs.cpSync(distPath, stepDir, { recursive: true });
      log(`Copied build to ${stepDir}`);

      // Create a shell wrapper page and move the built app to app.html
      const indexPath = path.join(stepDir, 'index.html');
      const appPath = path.join(stepDir, 'app.html');
      if (fs.existsSync(indexPath)) {
        fs.renameSync(indexPath, appPath);

        const shellWrapper = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tag} - GenAI Incremental Localization Experiment (Copilot)</title>
  <link rel="stylesheet" href="../shell/shell.css">
</head>
<body>
  <script src="../shell/shell.js"></script>
</body>
</html>`;

        fs.writeFileSync(indexPath, shellWrapper);
        log('Created shell wrapper index.html and moved app to app.html');
      }

      // Extract and render agent notes
      const stepId_padded = getStepId(tag);
      const customDesc = tagDescriptions[tag];
      const stepDescription = customDesc ? `Step ${stepId_padded}: ${customDesc}` : `Step ${stepId_padded}`;
      const agentNotesPath = path.join(ROOT, 'docs', 'agent-notes', `${stepId}.md`);
      
      if (fs.existsSync(agentNotesPath)) {
        const agentNotesContent = fs.readFileSync(agentNotesPath, 'utf8');
        
        const notesHtml = renderMarkdown(agentNotesContent, `Agent Notes - ${tag}`);
        fs.writeFileSync(path.join(stepDir, 'notes.html'), notesHtml);
        log('Rendered agent notes');
      } else {
        log(`Warning: Agent notes not found for ${tag}`);
        const fallbackHtml = renderMarkdown('# Agent Notes\n\nNo agent notes available for this step.', `Agent Notes - ${tag}`);
        fs.writeFileSync(path.join(stepDir, 'notes.html'), fallbackHtml);
      }

      // Extract and render prompt
      const promptPath = path.join(ROOT, 'docs', 'prompts', `${stepId}.md`);
      
      if (fs.existsSync(promptPath)) {
        const promptContent = fs.readFileSync(promptPath, 'utf8');
        const promptHtml = renderMarkdown(promptContent, `Prompt - ${tag}`);
        fs.writeFileSync(path.join(stepDir, 'prompt.html'), promptHtml);
        log('Rendered prompt');
      } else {
        log(`Prompt not found for ${tag} (this is okay)`);
        const fallbackHtml = renderMarkdown('# Prompt\n\nNo prompt file available for this step.', `Prompt - ${tag}`);
        fs.writeFileSync(path.join(stepDir, 'prompt.html'), fallbackHtml);
      }

      // Add to metadata
      stepsMetadata.push({
        tag,
        stepNumber: stepNum,
        description: stepDescription,
        path: `${tag}/`,
        appPath: `${tag}/app.html`,
        notesPath: `${tag}/notes.html`,
        promptPath: `${tag}/prompt.html`
      });
    }

    // Restore original branch
    log(`\nRestoring original branch: ${currentBranch}`);
    exec(`git checkout ${currentBranch}`, { quiet: true });

    // Re-install dependencies for current branch
    log('Re-installing dependencies for current branch...');
    exec('npm install', { quiet: true });

    // Generate steps.json
    log('Generating steps.json...');
    fs.writeFileSync(
      path.join(DIST_DIR, 'steps.json'),
      JSON.stringify(stepsMetadata, null, 2)
    );

    // Generate landing page (using pre-read template to capture any modifications)
    log('Generating landing page...');
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexTemplate);

    // Generate about page (using pre-read template to capture any modifications)
    log('Generating about page...');
    const aboutDir = path.join(DIST_DIR, 'about');
    fs.mkdirSync(aboutDir, { recursive: true });
    fs.writeFileSync(path.join(aboutDir, 'index.html'), aboutTemplate);

    // Create .nojekyll to prevent Jekyll processing
    fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '');

    log('\n✅ Build complete!');
    log(`Output: ${DIST_DIR}`);
    log(`\nTo preview locally, run: npx serve dist-pages`);

  } finally {
    // Restore stashed changes if any
    if (hasUncommittedChanges) {
      log('Restoring stashed changes...');
      exec('git stash pop', { ignoreError: true });
    }
  }
}

// Run build
buildPages().catch(error => {
  console.error('[build-pages] Error:', error.message);
  process.exit(1);
});
