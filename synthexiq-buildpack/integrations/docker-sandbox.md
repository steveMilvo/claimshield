# Integration: Docker Code Execution Sandbox
# Required by: QA Testing (run tests), Ship-Ready (run test suite)

## What It Does
Ephemeral Docker containers that agents can use to execute code safely.
Each job gets a fresh container, runs the command, returns stdout/stderr,
then the container is destroyed. No state persists between runs.

## Architecture

```
Synthexiq Agent
     │
     │ tool: sandbox_run({ command, repo, timeout })
     ▼
Sandbox Orchestrator (your service)
     │
     │ docker run --rm --network none
     ▼
Ephemeral Container
  - clones repo at specified SHA
  - runs command
  - returns stdout/stderr/exit_code
  - destroyed after run
```

## Synthexiq Tool to Register

### tool: sandbox_run
```json
{
  "name": "sandbox_run",
  "description": "Run a shell command in an isolated container with the repo checked out",
  "parameters": {
    "repo": "owner/repo",
    "ref": "string (branch or SHA to check out)",
    "command": "string (e.g. 'npm test', 'python -m pytest', 'bundle exec rspec')",
    "timeout_seconds": "integer (default 120, max 600)",
    "env": "object (optional key-value pairs)"
  },
  "returns": {
    "stdout": "string",
    "stderr": "string",
    "exit_code": "integer",
    "duration_seconds": "number"
  }
}
```

## Base Docker Images to Build

```dockerfile
# Node.js projects
FROM node:20-slim
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
WORKDIR /sandbox

# Python projects  
FROM python:3.12-slim
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
WORKDIR /sandbox

# Ruby projects
FROM ruby:3.3-slim
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
WORKDIR /sandbox
```

## Orchestrator Service (Node.js)

```javascript
const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const app = express();
app.use(express.json());

// Auth middleware
app.use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== process.env.SANDBOX_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

app.post('/run', async (req, res) => {
  const { repo, ref, command, timeout_seconds = 120, env = {} } = req.body;
  
  // Validate inputs — never interpolate directly from agent output
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return res.status(400).json({ error: 'Invalid repo' });
  if (!/^[\w./-]+$/.test(ref)) return res.status(400).json({ error: 'Invalid ref' });
  
  const envString = Object.entries(env)
    .map(([k, v]) => `-e ${k}=${JSON.stringify(v)}`)
    .join(' ');
  
  // Detect project type to pick base image
  const image = detectImage(command);
  
  const dockerCmd = [
    'docker run --rm',
    '--network none',           // no internet access
    '--memory 512m',            // memory cap
    '--cpus 1',                 // CPU cap
    `--timeout ${timeout_seconds}`,
    envString,
    image,
    'sh -c',
    `"git clone https://github.com/${repo} /sandbox &&`,
    `cd /sandbox &&`,
    `git checkout ${ref} &&`,
    `${command}"`,
  ].join(' ');
  
  const start = Date.now();
  try {
    const { stdout, stderr } = await execAsync(dockerCmd, {
      timeout: (timeout_seconds + 30) * 1000,
    });
    res.json({ stdout, stderr, exit_code: 0, duration_seconds: (Date.now() - start) / 1000 });
  } catch (err) {
    res.json({
      stdout: err.stdout || '',
      stderr: err.stderr || err.message,
      exit_code: err.code || 1,
      duration_seconds: (Date.now() - start) / 1000,
    });
  }
});

function detectImage(command) {
  if (command.includes('npm') || command.includes('node')) return 'synthexiq-sandbox-node:latest';
  if (command.includes('python') || command.includes('pytest')) return 'synthexiq-sandbox-python:latest';
  if (command.includes('bundle') || command.includes('rspec')) return 'synthexiq-sandbox-ruby:latest';
  return 'synthexiq-sandbox-node:latest';
}

app.listen(3003, () => console.log('Sandbox orchestrator on :3003'));
```

## Security Constraints
- `--network none` — containers have zero internet access
- `--memory 512m` — prevents memory exhaustion
- `--cpus 1` — prevents CPU exhaustion
- `--rm` — containers destroyed after every run, no state
- Never clone from untrusted sources — only github.com/owner/repo
- Never allow agent to specify the Docker image — server picks it
- Run sandbox orchestrator as non-root user
- Never expose sandbox to public internet — internal only

## Setup

```bash
# Build base images
docker build -f Dockerfile.node -t synthexiq-sandbox-node:latest .
docker build -f Dockerfile.python -t synthexiq-sandbox-python:latest .
docker build -f Dockerfile.ruby -t synthexiq-sandbox-ruby:latest .

# Run orchestrator
SANDBOX_SECRET=your-secret node orchestrator.js

# Register in Synthexiq API Connector
# Base URL: http://localhost:3003
# Auth: Bearer your-secret
```
