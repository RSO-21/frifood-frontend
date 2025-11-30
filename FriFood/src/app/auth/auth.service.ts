import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface User {
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

  // base URL of your Flask auth microservice
  private readonly API_URL = environment.authServiceUrl;

  // signals
  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);

  // public read-only signals
  token = computed(() => this._token());
  currentUser = computed(() => this._user());
  isAuthenticated = computed(() => this._token() !== null);

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('access_token');
      if (savedToken) {
        this._token.set(savedToken);
        this.loadMe();
      }
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, {
        username,
        password,
      })
      .subscribe({
        next: (res) => {
          this._token.set(res.access_token);
          localStorage.setItem('access_token', res.access_token);
          this.loadMe();
        },
        error: (err) => {
          console.error('Login failed', err);
        },
      });
  }

  signup(username: string, email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/signup`, {
        username,
        email,
        password,
      })
      .subscribe({
        next: (res) => {
          this._token.set(res.access_token);
          localStorage.setItem('access_token', res.access_token);
          this.loadMe();
        },
        error: (err) => {
          console.error('Signup failed', err);
        },
      });
  }

  loadMe() {
    const token = this._token();
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<User>(`${this.API_URL}/auth/me`, { headers }).subscribe({
      next: (user) => this._user.set(user),
      error: (e) => {
        console.error('Failed to load user', e);
        this.logout();
      },
    });
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
