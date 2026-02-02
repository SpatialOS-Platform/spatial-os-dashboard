# 📊 Spatial OS Dashboard

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**Admin Dashboard for Spatial OS** - A modern Next.js application for managing spatial infrastructure.

## Features

- 📍 **Anchor Management** - Create, edit, and delete spatial anchors
- 🏠 **Space Configuration** - Manage spaces and their settings
- 👥 **User Management** - Admin controls for users and permissions
- 🔑 **API Key Management** - Generate and revoke API keys
- 📊 **Analytics** - View usage statistics and metrics
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Spatial OS API endpoint

# Start development server
npm run dev
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_WS_URL=ws://localhost:8787
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/spatial-os/spatial-os-dashboard)

### Self-hosted

```bash
npm run build
npm start
```

## Related Packages

- [@spatial-os/core](https://github.com/spatial-os/spatial-os-core) - Backend API

## Support

If you find Spatial OS useful, consider supporting the project:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Us-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/nirmalbrj7)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor-ea4aaa?logo=github&logoColor=white)](https://github.com/sponsors/nirmalbrj7)

## License

Apache License 2.0 - see [LICENSE](LICENSE)
