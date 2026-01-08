import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Offer, OfferUpdate } from '../models';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.offerServiceUrl;

  // state
  private readonly _offers = signal<Offer[]>([]);

  // public read-only signal
  offers = this._offers.asReadonly();

  // setter
  setOffers(offers: Offer[]) {
    this._offers.set(offers);
  }

  /* ─────────────────────────────
   * Helpers
   * ───────────────────────────── */

  private headers(tenantId?: string): HttpHeaders {
    let headers = new HttpHeaders();
    if (tenantId) {
      headers = headers.set('X-Tenant-ID', tenantId);
    }
    return headers;
  }

  /* ─────────────────────────────
   * API calls
   * ───────────────────────────── */

  /** Get all offers */
  listOffers(tenantId?: string) {
    return this.http.get<Offer[]>(`${this.API_URL}/offers`, {
      headers: this.headers(tenantId),
    });
  }

  /** Get a single offer by ID */
  getOffer(offerId: number, tenantId?: string) {
    return this.http.get<Offer>(`${this.API_URL}/offers/${offerId}`, {
      headers: this.headers(tenantId),
    });
  }

  /** Create a new offer */
  createOffer(offer: Offer, tenantId?: string) {
    console.log('Creating offer:', offer);
    return this.http.post<Offer>(`${this.API_URL}/offers`, offer, {
      headers: this.headers(tenantId),
    });
  }

  /** Update an existing offer */
  updateOffer(offerId: number, offer: OfferUpdate, tenantId?: string) {
    return this.http.put<Offer>(`${this.API_URL}/offers/${offerId}`, offer, {
      headers: this.headers(tenantId),
    });
  }

  /** Get all offers for a specific partner */
  listOffersByPartner(partnerId: string, tenantId?: string) {
    return this.http.get<Offer[]>(`${this.API_URL}/offers/by-partner/${partnerId}`, {
      headers: this.headers(tenantId),
    });
  }

  /** Delete an offer */
  deleteOffer(offerId: number, tenantId?: string) {
    return this.http.delete<void>(`${this.API_URL}/offers/${offerId}`, {
      headers: this.headers(tenantId),
    });
  }

  getOffersByIds(ids: number[]) {
    return this.http.post<Offer[]>('/api/offers/bulk', { ids });
  }
}
