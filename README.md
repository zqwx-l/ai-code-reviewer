# CodeReview AI

An AI-powered code reviewer built with **Xiaomi MiMo-V2.5-Pro** — the flagship reasoning model from Xiaomi MiMo.

🔗 **Live Demo**: [Deploy URL here]

## Features

- 🐛 **Bug Detection** — finds logic errors and runtime issues with severity levels
- 🔒 **Security Analysis** — detects SQL injection, XSS, hardcoded secrets, and more
- 💡 **Improvement Suggestions** — performance, readability, maintainability, best practices
- ✅ **Code Quality Score** — 1–10 rating with detailed summary
- 🌐 **Multi-language** — JavaScript, TypeScript, Python, Rust, Go, Java, C/C++, and more

## Tech Stack

- **Frontend**: Next.js 16 + Tailwind CSS
- **AI Model**: MiMo-V2.5-Pro via [Xiaomi MiMo API Platform](https://platform.xiaomimimo.com)
- **Deployment**: Vercel

## Built With AI

This project was built using AI-driven development tools:
- **Hermes Agent** — autonomous coding agent for scaffolding and implementation
- **Claude Code** — AI pair programming
- **MiMo-V2.5-Pro** — core reasoning model powering the code review engine

## Getting Started

```bash
# Clone the repo
git clone https://github.com/zqwx-l/ai-code-reviewer
cd ai-code-reviewer

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your MiMo API key from https://platform.xiaomimimo.com

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MIMO_API_KEY` | Your API key from [platform.xiaomimimo.com](https://platform.xiaomimimo.com) |

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zqwx-l/ai-code-reviewer)

Set `MIMO_API_KEY` in your Vercel environment variables.

## License

MIT
