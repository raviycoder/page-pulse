# Page Pulse

A lightweight URL auditing tool built for the Digital Heroes Training Task.

## Live Demo

[https://page-pulse-virid-iota.vercel.app/](https://page-pulse-virid-iota.vercel.app/)

## Features

- HTTP status and response time
- Page title and meta description extraction
- H1 heading count
- Images missing alt text
- Approximate word count
- Friendly handling of invalid URLs, timeouts, and non-HTML responses

## Tech Stack

Next.js, TypeScript, Tailwind CSS, Cheerio, Vitest

## Setup

```bash
git clone https://github.com/raviycoder/page-pulse.git
cd page-pulse
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Run Tests

```bash
npm test
```

## API Contract

### POST `/api/audit`

Request body:

```json
{ "url": "https://example.com" }
```

Success response:

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "statusCode": 200,
    "responseTimeMs": 245,
    "title": "Example Domain",
    "metaDescription": "",
    "h1Count": 1,
    "imagesMissingAlt": 0,
    "wordCount": 22
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "Please provide a valid URL, e.g. https://example.com."
  }
}
```

## AI Tool Usage

I used Perplexity AI to help scaffold the Next.js API route structure, brainstorm
error-handling edge cases, and draft the initial test cases. I reviewed,
modified, and tested all generated code myself, and made the final calls on
architecture (Next.js full-stack, Cheerio for parsing, AbortController for
timeouts) based on my own judgment about the trade-offs for this project.

## Design Decisions

1. **Next.js full-stack architecture**  
   Using API routes inside the same Next.js app avoids running and deploying a separate backend, which keeps the project simple and free-tier friendly.

2. **Cheerio instead of a headless browser**  
   Cheerio parses static HTML quickly and works well within serverless function limits. The trade-off is that JavaScript-rendered content won't be captured, which is acceptable for a lightweight audit tool.

3. **AbortController with an 8-second timeout and structured error codes**  
   Prevents requests from hanging indefinitely and lets the frontend show specific, useful messages (invalid URL, timeout, non-HTML) instead of a generic crash or infinite loading state.
