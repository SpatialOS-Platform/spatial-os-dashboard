# Contributing to Spatial OS Dashboard

Thank you for considering contributing to Spatial OS! It's people like you that make Spatial OS such a great tool for the community.

## Code of Conduct

This project and everyone participating in it is governed by the [Spatial OS Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. When creating a bug report, please include:

- A clear description of the issue
- Steps to reproduce the bug
- Any relevant logs or screenshots
- Your environment details (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancements are also tracked as GitHub issues. Please provide:

- A clear title and description
- The use case for the enhancement
- Any technical implementation ideas

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes (`npm test`)
5. Make sure your code lints (`npm run lint`)
6. Issue that pull request!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/spatial-os/spatial-os-dashboard.git
cd spatial-os-dashboard

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Spatial OS API endpoint

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── ui/           # shadcn/ui components
├── lib/              # Utility functions
├── hooks/            # Custom React hooks
└── styles/           # Global styles
```

## Style Guide

- We use **Prettier** and **ESLint** for code formatting. Run `npm run format` before committing.
- Follow **Clean Code** principles: concise functions, clear naming, and modularity.
- Use TypeScript with strict mode enabled.
- Follow shadcn/ui patterns for new components.

## License

By contributing to Spatial OS, you agree that your contributions will be licensed under its [Apache 2.0 License](LICENSE).
