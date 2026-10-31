const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export type Role = 'STUDENT' | 'COMPANY'
export type User = { _id: string; fullName: string; email: string; role: Role }
export type Profile = { companyName?: string; university?: string; course?: string; level?: string; skills?: string[]; bio?: string; description?: string; location?: string }
export type Job = {
  _id: string
  title: string
  description: string
  requirements?: string
  responsibilities?: string
  location: string
  employmentType: string
  level?: string
  category?: string
  remote?: boolean
  skills: string[]
  deadline?: string
  company: { _id: string; companyName: string }
  createdAt: string
}
export type Application = { _id: string; status: string; coverLetter?: string; job: Job; student?: { user?: { fullName?: string } }; appliedAt: string }

type Response<T> = { success: boolean; message?: string; data: T }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('findunijob_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  const body = await response.json() as Response<T>
  if (!response.ok || !body.success) throw new Error(body.message || 'Request failed')
  return body.data
}

export const api = {
  jobs: (params: URLSearchParams) => request<{ jobs: Job[]; pagination: { total: number } }>(`/jobs?${params}`),
  job: (id: string) => request<Job>(`/jobs/${id}`),
  register: (body: { fullName: string; email: string; password: string; role: Role; profile: Profile }) => request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (email: string, password: string) => request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request<{ user: User; profile: Profile }>('/auth/me'),
  updateStudent: (profile: Profile) => request<Profile>('/students/me', { method: 'PATCH', body: JSON.stringify(profile) }),
  updateCompany: (profile: Profile) => request<Profile>('/companies/me', { method: 'PATCH', body: JSON.stringify(profile) }),
  apply: (job: string, coverLetter: string) => request<Application>('/applications', { method: 'POST', body: JSON.stringify({ job, coverLetter }) }),
  applications: () => request<Application[]>('/applications/mine'),
  received: () => request<Application[]>('/applications/received'),
  createJob: (body: Partial<Job>) => request<Job>('/jobs', { method: 'POST', body: JSON.stringify(body) }),
  updateApplication: (id: string, status: string) => request<Application>(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  aiChat: (prompt: string) => request<{ response: string }>('/ai/chat', { method: 'POST', body: JSON.stringify({ prompt }) }),
}
