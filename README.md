# FindUniJob

FindUniJob is a career platform for university talent. The repository contains a Vite/React frontend and a CommonJS Express/MongoDB backend.

## Project structure

- `src/` - React frontend
- `backend/` - Express API, models, authentication, applications, CV uploads, and optional Gemma integration

For backend setup, API routes, environment variables, security notes, and test instructions, see [backend/README.md](./backend/README.md).

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Configure MongoDB and a strong `JWT_SECRET` before starting the API. The frontend currently contains sample job data; connecting it to the API is a separate integration step.
