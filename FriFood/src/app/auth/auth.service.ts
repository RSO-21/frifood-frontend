import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface KeycloakUser {
  sub: string;
  email?: string;
  preferred_username?: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private loginService = inject(LoginService);
  private userService = inject(UserService);

  // base URL of your Flask auth microservice
  private readonly API_GATEWAY_URL = environment.apiGatewayUrl;

  // signals
  private readonly _token = signal<string | null>(null);
  private readonly _keycloakUser = signal<KeycloakUser | null>(null);

  // public read-only signals
  token = computed(() => this._token());
  isAuthenticated = computed(() => this._keycloakUser() !== null);
  username = computed(() => this._keycloakUser()?.preferred_username || null);

  login(username: string, password: string) {
  return this.http
    .post(
      `${this.API_GATEWAY_URL}/auth/login`,  // API_URL = gateway
      { username, password },
      { withCredentials: true }     // da cookies pridejo
    )
    .subscribe({
      next: () => this.loadMe(),
      error: (err) => console.error('Login failed', err),
    });
}

  signup(username: string, email: string, password: string) {
    return this.http
      .post(
        `${this.API_GATEWAY_URL}/auth/signup`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      )
      .subscribe({
        next: () => this.loadMe(),
        error: (err) => console.error('Signup failed', err),
      });
  }

  loadMe() {
    this.http
      .get<KeycloakUser>(`${this.API_GATEWAY_URL}/auth/me`, {
        withCredentials: true,
      })
      .subscribe({
        next: (user) => {
          this._keycloakUser.set(user);
          this.loginService.reset();
          this.userService.loadUser(user.sub);
        },
        error: () => this._keycloakUser.set(null),
      });
  }

  logout() {
    this.http
      .post(
        `${this.API_GATEWAY_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe(() => {
        this._keycloakUser.set(null);
        this.router.navigate(['/']);
      });
  }
}
