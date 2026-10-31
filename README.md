# FindUniJob

FindUniJob is a career platform for university talent. The repository contains a Vite/React frontend and a CommonJS Express/MongoDB backend.

## Project structure

- `src/` - React frontend
- `backend/` - Express API, models, authentication, applications, CV uploads, and optional Gemma integration

The frontend is connected to the backend for live jobs, authentication, profiles, CV uploads, applications, company job publishing and management, application management, and the authenticated persistent career assistant. The assistant searches published MongoDB jobs and displays matching records without inventing vacancies.

For backend setup, API routes, environment variables, security notes, and test instructions, see [backend/README.md](./backend/README.md).

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Configure MongoDB and a strong `JWT_SECRET` before starting the API. The frontend uses live job data from the backend API.

The Google Gemini API key is server-only. Configure it in `backend/.env`; never add it to Vite variables or commit it.
