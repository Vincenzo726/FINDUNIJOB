const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

export type Role = 'STUDENT' | 'COMPANY'
export type User = { _id: string; fullName: string; email: string; role: Role }
export type Profile = { companyName?: string; university?: string; course?: string; level?: string; skills?: string[]; bio?: string; description?: string; location?: string }
export type Job = { _id: string; title: string; description: string; requirements?: string; responsibilities?: string; location: string; employmentType: string; level?: string; category?: string; remote?: boolean; skills: string[]; deadline?: string; status?: string; company: { _id: string; companyName: string }; createdAt: string }
export type Application = { _id: string; status: string; coverLetter?: string; job: Job; student?: { user?: { fullName?: string } }; cv?: { _id: string; originalName: string }; appliedAt: string }
export type ChatMessage = { role: 'user' | 'assistant'; content: string; createdAt?: string }
export type Conversation = { _id: string; messages: ChatMessage[]; updatedAt: string }

type Response<T> = { success: boolean; message?: string; data: T }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('findunijob_token')
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
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
  ownedJobs: () => request<Job[]>('/jobs/owned'),
  updateJob: (id: string, body: Partial<Job>) => request<Job>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteJob: (id: string) => request<void>(`/jobs/${id}`, { method: 'DELETE' }),
  updateApplication: (id: string, status: string) => request<Application>(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  cvs: () => request<{ _id: string; originalName: string; size: number }[]>('/cvs'),
  uploadCv: (file: File) => { const data = new FormData(); data.append('cv', file); return request<{ _id: string; originalName: string; size: number }>('/cvs', { method: 'POST', body: data }) },
  deleteCv: (id: string) => request<void>(`/cvs/${id}`, { method: 'DELETE' }),
  aiChat: (prompt: string, conversationId?: string) => request<{ response: string; conversationId: string; jobs: Job[] }>('/ai/chat', { method: 'POST', body: JSON.stringify({ prompt, conversationId }) }),
  conversations: () => request<Conversation[]>('/ai/conversations'),
  conversation: (id: string) => request<Conversation>(`/ai/conversations/${id}`),
  deleteConversation: (id: string) => request<void>(`/ai/conversations/${id}`, { method: 'DELETE' }),
}
