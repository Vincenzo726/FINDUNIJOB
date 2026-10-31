# FindUniJob Backend

The backend is a CommonJS Express API backed by MongoDB and Mongoose. It supports student and company accounts, job publishing, applications, CV uploads, and an optional Gemma-powered AI endpoint.

## Run locally

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Set `MONGODB_URI` and a long random `JWT_SECRET` in `.env`. The API listens on `PORT` (5000 by default). Run `npm test` for the health-check smoke test.

## API

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs`, `GET /api/jobs/:id` (public browsing)
- `POST/PATCH/DELETE /api/jobs` (authenticated companies)
- `GET/PATCH /api/students/me` (authenticated students)
- `GET/PATCH /api/companies/me` (authenticated companies)
- `POST /api/applications`, `GET /api/applications/mine` (students)
- `GET /api/applications/received`, `PATCH /api/applications/:id/status` (companies)
- `GET/POST/DELETE /api/cvs` (students; multipart field `cv`)
- `POST /api/ai/chat` (authenticated users; requires Gemma configuration)
- `GET /api/ai/conversations`, `GET/DELETE /api/ai/conversations/:id`
- `POST /api/ai/career-guidance`
- `POST /api/ai/cv-analysis`
- `POST /api/ai/cv-improvement`
- `POST /api/ai/job-recommendations`

Send JWTs as `Authorization: Bearer <token>`. Logout is stateless: clients must discard the token. Passwords are hashed with bcrypt and are never returned.

## Uploads and Google Gemma AI

CV uploads accept PDF and DOCX files up to `MAX_FILE_SIZE_MB`. Local disk storage is intentionally an MVP adapter and is not durable on most cloud deployments; configure a persistent or object-storage adapter before production.

The AI service uses the Google Gemini `generateContent` REST API. Configure these server-only variables:

```env
GEMMA_API_KEY=your-google-ai-studio-key
GEMMA_API_URL=https://generativelanguage.googleapis.com/v1beta
GEMMA_MODEL=gemma-4-26b-a4b-it
```

The key is sent only as the `x-goog-api-key` request header from the backend. The frontend calls authenticated backend endpoints and never receives the key. `npm test` runs deterministic provider mocks; `npm run test:live-ai` runs a real provider request only when all three variables are configured.

## Security

Helmet, CORS, rate limiting, JWT verification, role checks, ownership checks, request-size limits, MIME/extension checks, and centralized error responses are enabled. Do not commit `.env`, uploads, or credentials.
