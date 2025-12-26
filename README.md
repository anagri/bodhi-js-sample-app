# Bodhi Browser Sample App

A fully-featured Vite + React application demonstrating `@bodhiapp/bodhi-js-react` and `@bodhiapp/bodhi-js` with Tailwind CSS and shadcn/ui components.

## Features

- **Extension Status**: Real-time extension and server connection monitoring
- **Setup Modal**: Interactive onboarding UI for platform configuration
- **Authentication**: Login/logout with Keycloak OAuth, user profile display
- **API Testing**: Query any API endpoint with method/body/authentication toggle
- **Streaming Chat**: Load models and stream chat responses with authentication
- **Modern UI**: Tailwind CSS v4 + shadcn/ui components with lucide-react icons

## Live Demo

Visit: https://username.github.io/bodhi-js-sample-app/

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## GitHub Pages Deployment

This app is configured for automatic deployment to GitHub Pages:

1. **Repository Setup**
   - Create repository named `bodhi-js-sample-app`
   - Push this code to the `main` branch

2. **GitHub Pages Configuration**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - Set `APP_CLIENT_ID` secret in Settings → Secrets

3. **Automatic Deployment**
   - Push to `main` triggers workflow
   - Builds app with base path `/bodhi-js-sample-app/`
   - Deploys to GitHub Pages

### SPA Routing Hack

Uses [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) solution:
- `404.html` redirects all routes to index with query string encoding
- `index.html` script decodes and restores correct URL before app loads
- Enables OAuth callback routing (`/callback`) on GitHub Pages

## Usage

1. **Install Bodhi Browser Extension**
   - Install from Chrome Web Store
   - Or load unpacked from local build

2. **Open the App**
   - Local: http://localhost:5173
   - GitHub Pages: https://username.github.io/bodhi-js-sample-app/

3. **Configure Setup**
   - Click "Setup" button to open setup modal
   - Follow wizard to configure extension and server

4. **Authenticate**
   - Click "Login with Keycloak"
   - Complete OAuth flow
   - View user profile after login

5. **Test API**
   - Select HTTP method (GET/POST/PUT/DELETE)
   - Enter endpoint (e.g., `/bodhi/v1/info`)
   - Toggle authentication checkbox
   - Send request and view response

6. **Stream Chat**
   - Click "Refresh" to load available models
   - Select or enter model name
   - Enter prompt
   - Toggle authentication if needed
   - Send to stream response

## Code Structure

```
src/
├── components/
│   ├── StatusSection.tsx      # Extension/server status
│   ├── AuthSection.tsx         # Login/logout, user profile
│   ├── ApiTestSection.tsx      # API query interface
│   ├── ChatSection.tsx         # Model loading, streaming chat
│   └── ui/                     # shadcn components
├── lib/
│   └── utils.ts                # cn() helper for Tailwind
├── App.tsx                     # Main app layout
├── main.tsx                    # Entry point
└── index.css                   # Tailwind theme

.github/workflows/
└── deploy.yml                  # GitHub Pages deployment

public/
└── 404.html                    # SPA routing hack for GitHub Pages

index.html                      # Redirect script for SPA routing
vite.config.ts                  # Base path configuration
```

## Key Concepts

### Environment Variables

Create `.env` file:
```bash
APP_CLIENT_ID=your-client-id
```

### WebUIClient Initialization

```typescript
import { WebUIClient } from '@bodhiapp/bodhi-js';

const APP_CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;

const client = new WebUIClient(APP_CLIENT_ID, {
  authServerUrl: 'https://main-id.getbodhi.app/realms/bodhi',
  redirectUri: `${window.location.origin}/callback`,
  logLevel: 'debug',
});
```

### BodhiProvider Setup

```typescript
import { BodhiProvider } from '@bodhiapp/bodhi-js-react';

<BodhiProvider client={client} logLevel="debug">
  <App />
</BodhiProvider>
```

### Using the Hook

```typescript
import { useBodhi, ClientCtxState, isAuthLoggedIn } from '@bodhiapp/bodhi-js-react';

function Component() {
  const { clientState, showSetup, auth, login, logout, client } = useBodhi();

  const isReady = ClientCtxState.isOverallReady(clientState);
  const isLoggedIn = auth && isAuthLoggedIn(auth);

  // API call
  const result = await client.sendApiRequest('GET', '/bodhi/v1/info');

  // Streaming chat
  const stream = client.streamChat(model, prompt, authenticated);
  for await (const chunk of stream) {
    // Handle chunk
  }
}
```

## Dependencies

### Core
- `@bodhiapp/bodhi-js@0.0.2`: Web SDK
- `@bodhiapp/bodhi-js-react@0.0.2`: React hooks and provider
- `react@19.2.0` & `react-dom@19.2.0`: UI framework

### UI
- `tailwindcss@4.1.17`: Utility-first CSS
- `class-variance-authority`: Component variants
- `clsx` & `tailwind-merge`: Class merging
- `lucide-react`: Icon library

### Build
- `vite@5.4.11`: Build tool
- `typescript@5.8.3`: Type safety

## Learn More

- [Bodhi Browser Documentation](https://github.com/BodhiSearch/bodhi-browser)
- [SDK Documentation](https://github.com/BodhiSearch/bodhi-browser/tree/main/bodhi-js-sdk)
- [GitHub Pages SPA Routing](https://github.com/rafgraph/spa-github-pages)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
