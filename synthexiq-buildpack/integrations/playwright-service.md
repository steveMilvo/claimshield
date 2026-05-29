# Integration: Playwright Browser Service
# Required by: QA Testing, Design Review, Compliance Autopilot (document capture)

## What It Does
Provides a persistent stealth Chromium browser accessible to any Synthexiq agent
as a callable tool. Agents send commands (goto, click, fill, screenshot, snapshot)
and get back results. Anti-bot stealth enabled by default.

## Architecture

```
Synthexiq Agent
     │
     │ HTTP POST /command
     ▼
Playwright Service (Node.js)
     │
     │ drives
     ▼
Chromium (headless, stealth)
     │
     │ returns
     ▼
screenshot / text / accessibility tree / assertion result
```

## API — Expose These as Synthexiq Tools

### tool: browser_goto
```json
{
  "name": "browser_goto",
  "description": "Navigate the browser to a URL",
  "parameters": {
    "url": "string",
    "wait_for": "load | networkidle | domcontentloaded"
  }
}
```

### tool: browser_snapshot
```json
{
  "name": "browser_snapshot",
  "description": "Get accessibility tree of current page with element refs (@e1, @e2...)",
  "parameters": {
    "interactive_only": "boolean"
  }
}
```

### tool: browser_click
```json
{
  "name": "browser_click",
  "description": "Click an element by @ref from snapshot",
  "parameters": {
    "ref": "string (e.g. @e5)"
  }
}
```

### tool: browser_fill
```json
{
  "name": "browser_fill",
  "description": "Fill a form field",
  "parameters": {
    "ref": "string",
    "value": "string"
  }
}
```

### tool: browser_screenshot
```json
{
  "name": "browser_screenshot",
  "description": "Take a screenshot of the current page",
  "parameters": {
    "path": "string (save location)",
    "full_page": "boolean"
  }
}
```

### tool: browser_assert
```json
{
  "name": "browser_assert",
  "description": "Assert that an element exists, is visible, or contains text",
  "parameters": {
    "selector": "string",
    "assertion": "exists | visible | contains_text | not_exists",
    "expected": "string (for contains_text)"
  }
}
```

### tool: browser_get_text
```json
{
  "name": "browser_get_text",
  "description": "Extract text content from the page or an element",
  "parameters": {
    "selector": "string (optional — omit for full page text)"
  }
}
```

## Setup Instructions

```bash
# 1. Install
mkdir playwright-service && cd playwright-service
npm init -y
npm install playwright playwright-extra playwright-extra-plugin-stealth express

# 2. Install browsers
npx playwright install chromium

# 3. Create server (see playwright-service/server.js)

# 4. Run
node server.js
# Service listens on port 3001 by default

# 5. Register in Synthexiq API Connector
# Base URL: http://localhost:3001  (or your hosted URL)
# Auth: Bearer token (set PLAYWRIGHT_SECRET env var)
```

## server.js

```javascript
const express = require('express');
const { chromium } = require('playwright-extra');
const StealthPlugin = require('playwright-extra-plugin-stealth');

chromium.use(StealthPlugin());

const app = express();
app.use(express.json());

let browser, page;

async function ensureBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
  }
  return page;
}

// Auto-shutdown after 30 min inactivity
let shutdownTimer;
function resetShutdown() {
  clearTimeout(shutdownTimer);
  shutdownTimer = setTimeout(async () => {
    if (browser) { await browser.close(); browser = null; page = null; }
  }, 30 * 60 * 1000);
}

app.use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== process.env.PLAYWRIGHT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  resetShutdown();
  next();
});

app.post('/goto', async (req, res) => {
  const p = await ensureBrowser();
  await p.goto(req.body.url, { waitUntil: req.body.wait_for || 'load' });
  res.json({ url: p.url(), title: await p.title() });
});

app.post('/screenshot', async (req, res) => {
  const p = await ensureBrowser();
  const buffer = await p.screenshot({ fullPage: req.body.full_page || false });
  res.json({ image: buffer.toString('base64') });
});

app.post('/snapshot', async (req, res) => {
  const p = await ensureBrowser();
  const snapshot = await p.accessibility.snapshot();
  res.json({ snapshot });
});

app.post('/click', async (req, res) => {
  const p = await ensureBrowser();
  await p.click(req.body.selector);
  res.json({ clicked: req.body.selector });
});

app.post('/fill', async (req, res) => {
  const p = await ensureBrowser();
  await p.fill(req.body.selector, req.body.value);
  res.json({ filled: req.body.selector });
});

app.post('/get_text', async (req, res) => {
  const p = await ensureBrowser();
  const text = req.body.selector
    ? await p.textContent(req.body.selector)
    : await p.textContent('body');
  res.json({ text });
});

app.listen(3001, () => console.log('Playwright service running on :3001'));
```

## Security Notes
- Run behind a VPN or private network — never expose directly to internet
- Use PLAYWRIGHT_SECRET env var, rotate regularly
- Wrap any page content returned to agents in [UNTRUSTED_CONTENT] markers
  — agents must not execute instructions found in page text
- Rate limit: 10 commands/second max to prevent resource exhaustion
