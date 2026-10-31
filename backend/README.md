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

Send JWTs as `Authorization: Bearer <token>`. Logout is stateless: clients must discard the token. Passwords are hashed with bcrypt and are never returned.

## Uploads and AI

CV uploads accept PDF and DOCX files up to `MAX_FILE_SIZE_MB`. Local disk storage is intentionally an MVP adapter and is not durable on most cloud deployments; configure a persistent or object-storage adapter before production. Configure `GEMMA_API_KEY`, `GEMMA_API_URL`, and `GEMMA_MODEL` to enable AI. The service expects a JSON API compatible with a prompt request and reads `response`, `text`, or an OpenAI-style choice.

## Security

Helmet, CORS, rate limiting, JWT verification, role checks, ownership checks, request-size limits, MIME/extension checks, and centralized error responses are enabled. Do not commit `.env`, uploads, or credentials.
