import apiClient from './client';
import { API_ENDPOINTS } from '@/constants';
import type {
  ApiResponse,
  LoginCredentials,
  LoginResponse,
  AdminUser,
  ContactFormData,
  ContactMessage,
  HeroContent,
  Project,
  Skill,
  Experience,
  Service,
  Testimonial,
  Certificate,
  Education,
  AboutContent,
  WebsiteSettings,
  SeoSettings,
  SocialLink,
} from '@/types';

export const authApi = {
  login: (data: LoginCredentials) =>
    apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    ),

  getMe: () =>
    apiClient.get<ApiResponse<AdminUser>>(API_ENDPOINTS.AUTH.ME),

  updateProfile: (data: Partial<AdminUser>) =>
    apiClient.put<ApiResponse<AdminUser>>(API_ENDPOINTS.AUTH.PROFILE, data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put<ApiResponse<null>>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),

  logout: () =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT),
};

export const projectsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Project[]>>(API_ENDPOINTS.PROJECTS),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`${API_ENDPOINTS.PROJECTS}/${id}`),

  create: (data: Partial<Project>) =>
    apiClient.post<ApiResponse<Project>>(
      `/admin${API_ENDPOINTS.PROJECTS}`,
      data,
    ),

  update: (id: string, data: Partial<Project>) =>
    apiClient.put<ApiResponse<Project>>(
      `/admin${API_ENDPOINTS.PROJECTS}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.PROJECTS}/${id}`),
};

export const skillsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Skill[]>>(API_ENDPOINTS.SKILLS),

  create: (data: Partial<Skill>) =>
    apiClient.post<ApiResponse<Skill>>(`/admin${API_ENDPOINTS.SKILLS}`, data),

  update: (id: string, data: Partial<Skill>) =>
    apiClient.put<ApiResponse<Skill>>(
      `/admin${API_ENDPOINTS.SKILLS}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.SKILLS}/${id}`),
};

export const experienceApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Experience[]>>(API_ENDPOINTS.EXPERIENCE),

  create: (data: Partial<Experience>) =>
    apiClient.post<ApiResponse<Experience>>(
      `/admin${API_ENDPOINTS.EXPERIENCE}`,
      data,
    ),

  update: (id: string, data: Partial<Experience>) =>
    apiClient.put<ApiResponse<Experience>>(
      `/admin${API_ENDPOINTS.EXPERIENCE}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.EXPERIENCE}/${id}`),
};

export const servicesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Service[]>>(API_ENDPOINTS.SERVICES),

  create: (data: Partial<Service>) =>
    apiClient.post<ApiResponse<Service>>(
      `/admin${API_ENDPOINTS.SERVICES}`,
      data,
    ),

  update: (id: string, data: Partial<Service>) =>
    apiClient.put<ApiResponse<Service>>(
      `/admin${API_ENDPOINTS.SERVICES}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.SERVICES}/${id}`),
};

export const testimonialsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Testimonial[]>>(API_ENDPOINTS.TESTIMONIALS),

  create: (data: Partial<Testimonial>) =>
    apiClient.post<ApiResponse<Testimonial>>(
      `/admin${API_ENDPOINTS.TESTIMONIALS}`,
      data,
    ),

  update: (id: string, data: Partial<Testimonial>) =>
    apiClient.put<ApiResponse<Testimonial>>(
      `/admin${API_ENDPOINTS.TESTIMONIALS}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.TESTIMONIALS}/${id}`),
};

export const certificatesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Certificate[]>>(API_ENDPOINTS.CERTIFICATES),

  create: (data: Partial<Certificate>) =>
    apiClient.post<ApiResponse<Certificate>>(
      `/admin${API_ENDPOINTS.CERTIFICATES}`,
      data,
    ),

  update: (id: string, data: Partial<Certificate>) =>
    apiClient.put<ApiResponse<Certificate>>(
      `/admin${API_ENDPOINTS.CERTIFICATES}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.CERTIFICATES}/${id}`),
};

export const educationApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Education[]>>(API_ENDPOINTS.EDUCATION),

  create: (data: Partial<Education>) =>
    apiClient.post<ApiResponse<Education>>(
      `/admin${API_ENDPOINTS.EDUCATION}`,
      data,
    ),

  update: (id: string, data: Partial<Education>) =>
    apiClient.put<ApiResponse<Education>>(
      `/admin${API_ENDPOINTS.EDUCATION}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.EDUCATION}/${id}`),
};

export const heroApi = {
  get: () =>
    apiClient.get<ApiResponse<HeroContent>>(API_ENDPOINTS.HERO),

  update: (data: Partial<HeroContent>) =>
    apiClient.put<ApiResponse<HeroContent>>(
      `/admin${API_ENDPOINTS.HERO}`,
      data,
    ),
};

export const aboutApi = {
  get: () =>
    apiClient.get<ApiResponse<AboutContent>>(API_ENDPOINTS.ABOUT),

  update: (data: Partial<AboutContent>) =>
    apiClient.put<ApiResponse<AboutContent>>(
      `/admin${API_ENDPOINTS.ABOUT}`,
      data,
    ),
};

export const socialsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<SocialLink[]>>(API_ENDPOINTS.SOCIALS),

  create: (data: Partial<SocialLink>) =>
    apiClient.post<ApiResponse<SocialLink>>(
      `/admin${API_ENDPOINTS.SOCIALS}`,
      data,
    ),

  update: (id: string, data: Partial<SocialLink>) =>
    apiClient.put<ApiResponse<SocialLink>>(
      `/admin${API_ENDPOINTS.SOCIALS}/${id}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/admin${API_ENDPOINTS.SOCIALS}/${id}`),
};

export const contactApi = {
  submit: (data: ContactFormData) =>
    apiClient.post<ApiResponse<ContactMessage>>(API_ENDPOINTS.CONTACT, data),

  getMessages: (params?: { page?: number; limit?: number; search?: string; read?: boolean | null }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.read !== undefined && params?.read !== null) query.set('read', String(params.read));
    const qs = query.toString();
    return apiClient.get(`/admin/messages${qs ? `?${qs}` : ''}`);
  },

  markAsRead: (id: string) =>
    apiClient.put(`/admin/messages/${id}/read`),

  markAsUnread: (id: string) =>
    apiClient.put(`/admin/messages/${id}/unread`),

  deleteMessage: (id: string) =>
    apiClient.delete(`/admin/messages/${id}`),
};

export const settingsApi = {
  get: () =>
    apiClient.get<ApiResponse<WebsiteSettings>>(API_ENDPOINTS.SETTINGS),

  update: (data: Partial<WebsiteSettings>) =>
    apiClient.put<ApiResponse<WebsiteSettings>>(
      API_ENDPOINTS.ADMIN.SETTINGS,
      data,
    ),
};

export const seoApi = {
  get: () =>
    apiClient.get<ApiResponse<SeoSettings>>(API_ENDPOINTS.SEO),

  update: (data: Partial<SeoSettings>) =>
    apiClient.put<ApiResponse<SeoSettings>>(
      API_ENDPOINTS.ADMIN.SEO,
      data,
    ),
};

export const uploadApi = {
  uploadImage: (formData: FormData) =>
    apiClient.post<ApiResponse<{ url: string; publicId: string }>>(
      API_ENDPOINTS.UPLOAD,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ),

  uploadImages: (formData: FormData) =>
    apiClient.post<
      ApiResponse<Array<{ url: string; publicId: string }>>
    >(API_ENDPOINTS.ADMIN.UPLOAD_MULTIPLE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteImage: (publicId: string) =>
    apiClient.delete(API_ENDPOINTS.ADMIN.UPLOAD_DELETE, {
      data: { publicId },
    }),

  uploadResume: (formData: FormData) =>
    apiClient.post<ApiResponse<{ url: string }>>(
      API_ENDPOINTS.ADMIN.RESUME,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ),
};