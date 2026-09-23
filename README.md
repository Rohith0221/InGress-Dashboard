# InGress Dashboard

The admin interface for the **[InGress Router](https://github.com/Rohith0221/InGressRouter)** webhook engine. Built with React 19 and TypeScript, the dashboard provides a secure, real-time view of ingested webhook events, dead-letter queue management, and dynamic endpoint configuration.

---

## Screenshots

> _Add screenshots here — Live Events view, DLQ view, Endpoints page, Login page_

---

## Features

- **Live Events feed** — view the latest 100 ingested webhooks with endpoint path, payload, status, and timestamp
- **Dead Letter Queue (DLQ)** — inspect malformed or failed events with error reasons; replay any event back into the main pipeline with one click
- **Endpoints management** — create and view active webhook endpoints; copy the full webhook URL to clipboard
- **Secure authentication** — JWT session via httpOnly cookie; session is verified on every page load so you stay logged in across browser refreshes
- **Protected routing** — unauthenticated users are redirected to login and returned to their original destination after auth
- **Responsive sidebar layout** — consistent navigation across all views with active route highlighting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite 8 |
| Data fetching | TanStack Query (React Query) v5 |
| UI components | shadcn/ui |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Routing | React Router v7 |
| HTTP | Fetch API (centralised in `src/lib/api.ts`) |
| Auth | JWT session cookie (managed by InGress Router backend) |

---

## Project Structure

```
src/
├── App.tsx                    # Root router, protected route wrapper
├── context/
│   └── AuthContext.tsx         # Global auth state, session verification on load
├── hooks/
│   ├── auth/
│   │   └── useAuth.ts          # Auth context consumer hook
│   ├── useEvents.ts            # TanStack Query hook for live events
│   ├── useDLQ.ts               # TanStack Query hook for DLQ events
│   └── useEndpoints.ts         # TanStack Query hook for endpoints
├── lib/
│   └── api.ts                  # Centralised fetch wrapper + all API functions
├── pages/
│   ├── Login.tsx               # Admin login page
│   ├── EventsDashboard.tsx     # Live events table
│   ├── DlqDashboard.tsx        # DLQ table with replay action
│   └── Endpoints.tsx           # Endpoints list + creation
└── components/
    └── ui/
        ├── DashboardLayout.tsx  # Sidebar + main content shell
        ├── button.tsx           # shadcn/ui Button
        └── input.tsx            # shadcn/ui Input
```

---

## Local Setup

### Prerequisites
- Node.js 22+
- The [InGress Router](https://github.com/Rohith0221/InGressRouter) backend running locally on port 3000

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Rohith0221/InGress-Dashboard.git
cd InGress-Dashboard
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

In production, set this to your deployed backend URL:
```env
VITE_API_BASE_URL=https://your-ingress-api.com
```

**4. Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**5. Build for production**
```bash
npm run build
```

Output is in the `dist/` folder — deploy to any static host (Vercel, Netlify, S3, etc.)

---

## Authentication Flow

```
User visits protected page
        │
        ▼
AuthContext checks session (GET /api/v1/verify)
        │
   ┌────┴────┐
Valid?       Invalid/expired?
   │              │
   ▼              ▼
Render page    Redirect to /login
               (stores original destination)
                    │
                    ▼
              User submits password
                    │
                    ▼
              POST /api/v1/login
              (sets httpOnly cookie)
                    │
                    ▼
              Redirect back to
              original destination
```

- Session cookies are `httpOnly` — not accessible from JavaScript, immune to XSS token theft
- Sessions expire after 10 minutes (configurable on the backend)
- On page load, `AuthContext` always re-verifies the session with the server before rendering protected content

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the InGress Router backend | `http://localhost:3000` |

> Note: All `VITE_` prefixed variables are embedded into the built bundle at build time. Do not put secrets in frontend environment variables.

---

## Related

- **[InGress Router](https://github.com/Rohith0221/InGressRouter)** — the Express backend this dashboard connects to
