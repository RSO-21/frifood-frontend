import { User as DbUser, UserUpdate } from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly API_GATEWAY_URL = environment.apiGatewayUrl;

  // store full DB user
  private readonly _user = signal<DbUser | null>(null);
  user = this._user.asReadonly();
  user_id = computed(() => this.user()?.id || '');
  user_partner_id = computed(() => this.user()?.partner_id || null);
  user_location = computed(() => {
    const user = this.user();
    if (user && user.latitude !== null && user.longitude !== null) {
      return {
        latitude: user.latitude,
        longitude: user.longitude,
      };
    }
    return null;
  });
  user_cart = computed(() => {
    return this.user()?.cart || [];
  });

  /** Fetch user by Keycloak ID */
  fetchById(userId: string) {
    return this.http.get<DbUser>(`${this.API_GATEWAY_URL}/users/${userId}`);
  }

  /** Load and store user */
  loadUser(userId: string) {
    return this.fetchById(userId).subscribe({
      next: (user) => {
        this._user.set(user);
      },
      error: () => {
        console.error('Failed to load user');
        this._user.set(null);
      },
    });
  }

  updateUser(userId: string, updates: Partial<UserUpdate>) {
    return this.http.patch<DbUser>(`${this.API_GATEWAY_URL}/users/${userId}`, updates).subscribe({
      next: (user) => {
        this._user.set(user);
      },
      error: (err) => {
        console.error('Failed to update user', err);
      },
    });
  }

  /** Add offer to cart (duplicates allowed) */
  addOfferToCart(userId: string, offerId: number) {
    console.log('Adding offer to cart:', offerId);
    return this.http
      .post<DbUser>(`${this.API_GATEWAY_URL}/users/${userId}/cart/${offerId}`, {})
      .subscribe({
        next: (user) => {
          this._user.set(user);
          alert('Item added to cart!');
        },
        error: (err) => {
          console.error('Failed to add offer to cart', err);
        },
      });
  }

  /** Remove ONE occurrence of offer from cart */
  removeOfferFromCart(userId: string, offerId: number) {
    return this.http
      .delete<DbUser>(`${this.API_GATEWAY_URL}/users/${userId}/cart/${offerId}`)
      .subscribe({
        next: (user) => {
          this._user.set(user);
        },
        error: (err) => {
          console.error('Failed to remove offer from cart', err);
        },
      });
  }

  getOrderHistory(userId: string) {
    return this.http.get<{
      user_id: string;
      orders: any[];
    }>(`${this.API_GATEWAY_URL}/users/${userId}/orders`);
  }

  clearCart(userId: string) {
    return this.http
      .delete<DbUser>(`${this.API_GATEWAY_URL}/users/${userId}/cart`)
      .subscribe((user) => this._user.set(user));
  }

  clear() {
    this._user.set(null);
  }
}
