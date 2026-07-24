import { authApi } from '@/api';
import type { LoginCredentials, AdminUser } from '@/types';

class AuthService {
  private user: AdminUser | null = null;

  get currentUser(): AdminUser | null {
    return this.user;
  }

  set currentUser(user: AdminUser | null) {
    this.user = user;
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('portfolio_token');
  }

  async login(credentials: LoginCredentials): Promise<AdminUser> {
    const response = await authApi.login(credentials);
    const { token, admin } = response.data.data;
    localStorage.setItem('portfolio_token', token);
    this.user = admin;
    return admin;
  }

  async fetchCurrentUser(): Promise<AdminUser | null> {
    if (!this.isAuthenticated) return null;
    try {
      const response = await authApi.getMe();
      this.user = response.data.data;
      return this.user;
    } catch {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('portfolio_token');
    this.user = null;
    authApi.logout().catch(() => {});
  }
}

export const authService = new AuthService();