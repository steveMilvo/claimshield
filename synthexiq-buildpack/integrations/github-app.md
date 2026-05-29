# Integration: GitHub App
# Required by: Ship-Ready Pipeline, Code Review, Diligence AI, Security Continuous

## What It Does
A GitHub App that bridges Synthexiq with GitHub repositories:
- Receives PR webhooks → triggers Ship-Ready / Code Review workflows
- Posts review comments and status checks back to PRs
- Reads repo contents and diffs for analysis
- Opens PRs on behalf of agents
- Manages branch operations

## Architecture

```
GitHub
  │
  │ webhook (PR opened/updated/merged)
  ▼
Synthexiq Webhook Handler
  │
  │ triggers workflow
  ▼
Synthexiq Agent(s)
  │
  │ uses GitHub tools (via API Connector)
  ▼
GitHub API
  (post comment, update status, open PR, read file)
```

## GitHub App Setup

```
1. Go to github.com/settings/apps/new (or org settings for org-level)

2. App settings:
   Name: Synthexiq
   Homepage: https://synthexiq.com
   Webhook URL: https://your-synthexiq-instance.com/webhooks/github
   Webhook secret: [generate random secret, save it]

3. Permissions needed:
   Repository:
     - Contents: Read & Write (read files, create commits)
     - Pull requests: Read & Write (read diffs, post comments, open PRs)
     - Checks: Read & Write (post status checks)
     - Metadata: Read (required by GitHub)
   
   Organisation (if org-level):
     - Members: Read

4. Subscribe to events:
     - Pull request (opened, synchronize, reopened)
     - Push (for deploy trigger)
     - Check run

5. Install the app on target repositories
```

## Synthexiq Tools to Register (API Connector)

### tool: github_get_diff
```json
{
  "name": "github_get_diff",
  "description": "Get the diff for a PR or between two refs",
  "parameters": {
    "repo": "owner/repo",
    "pull_number": "integer (optional)",
    "base": "string (optional — branch/SHA)",
    "head": "string (optional — branch/SHA)"
  }
}
```

### tool: github_post_comment
```json
{
  "name": "github_post_comment",
  "description": "Post a comment on a PR",
  "parameters": {
    "repo": "owner/repo",
    "pull_number": "integer",
    "body": "string (markdown)"
  }
}
```

### tool: github_post_review_comment
```json
{
  "name": "github_post_review_comment",
  "description": "Post an inline review comment on a specific line",
  "parameters": {
    "repo": "owner/repo",
    "pull_number": "integer",
    "body": "string",
    "path": "string (file path)",
    "line": "integer"
  }
}
```

### tool: github_update_status
```json
{
  "name": "github_update_status",
  "description": "Update a commit status check (pending/success/failure)",
  "parameters": {
    "repo": "owner/repo",
    "sha": "string",
    "state": "pending | success | failure | error",
    "context": "string (e.g. 'Synthexiq / Code Review')",
    "description": "string (short status message)",
    "target_url": "string (link to full report)"
  }
}
```

### tool: github_read_file
```json
{
  "name": "github_read_file",
  "description": "Read a file from a repository",
  "parameters": {
    "repo": "owner/repo",
    "path": "string",
    "ref": "string (branch or SHA)"
  }
}
```

### tool: github_create_pr
```json
{
  "name": "github_create_pr",
  "description": "Open a pull request",
  "parameters": {
    "repo": "owner/repo",
    "title": "string",
    "body": "string (markdown)",
    "head": "string (source branch)",
    "base": "string (target branch)",
    "draft": "boolean"
  }
}
```

### tool: github_commit_files
```json
{
  "name": "github_commit_files",
  "description": "Commit one or more file changes to a branch",
  "parameters": {
    "repo": "owner/repo",
    "branch": "string",
    "message": "string",
    "files": [{"path": "string", "content": "string"}]
  }
}
```

## Webhook Handler (Node.js)

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

function verifySignature(req) {
  const sig = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
}

app.post('/webhooks/github', async (req, res) => {
  if (!verifySignature(req)) return res.status(401).send('Invalid signature');
  
  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'pull_request') {
    const action = payload.action; // opened, synchronize, reopened
    if (['opened', 'synchronize', 'reopened'].includes(action)) {
      await triggerWorkflow('ship-ready-pipeline', {
        repo: payload.repository.full_name,
        pr_number: payload.number,
        head_sha: payload.pull_request.head.sha,
        base_branch: payload.pull_request.base.ref,
      });
    }
  }

  if (event === 'push' && payload.ref === 'refs/heads/main') {
    await triggerWorkflow('deploy-monitor', {
      repo: payload.repository.full_name,
      sha: payload.after,
    });
  }

  res.status(200).send('ok');
});

async function triggerWorkflow(workflowId, context) {
  // Call your Synthexiq internal workflow trigger API
  await fetch(`${process.env.SYNTHEXIQ_INTERNAL_URL}/workflows/${workflowId}/run`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.SYNTHEXIQ_INTERNAL_TOKEN}` },
    body: JSON.stringify(context),
  });
}

app.listen(3002, () => console.log('GitHub webhook handler on :3002'));
```

## Status Checks Posted to PRs

```
Synthexiq / Code Review     ✅ No issues found
Synthexiq / QA              ✅ 47 tests passed
Synthexiq / Security        ⚠️ 1 medium finding — see report
Synthexiq / Ship-Ready      ✅ Ready to merge
```

Clicking any status check links to the full report in Synthexiq.
