import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Partner, PartnerCreate, PartnerNearbyParams, PartnerUpdate } from '../models';

import { environment } from '../../environments/environment';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private readonly http = inject(HttpClient);
  private readonly API_GATEWAY_URL = environment.apiGatewayUrl;

  // state
  private readonly _partners = signal<Partner[]>([]);

  // public read-only signal
  partners = this._partners.asReadonly();

  // setter
  setPartners(partners: any[]) {
    console.log('Partners', partners);
    this._partners.set(partners);
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

  /** Get all partners */
  listPartners(tenantId?: string) {
    return this.http.get<Partner[]>(`${this.API_GATEWAY_URL}/partners/list_partners`, {
      headers: this.headers(tenantId),
    });
  }

  /** Get partners nearby (approximate geo search) */
  getNearbyPartners(params: PartnerNearbyParams, tenantId: string = 'public') {
    return this.http.get<Partner[]>(`${this.API_GATEWAY_URL}/partners/nearby`, {
      headers: this.headers(tenantId),
      params: {
        lat: params.lat,
        lng: params.lng,
        radius_km: params.radius_km ?? 5,
      },
    });
  }

  /** Get a single partner by ID */
  getPartner(id: string, tenantId?: string) {
    return this.http.get<Partner>(`${this.API_GATEWAY_URL}/partners/${id}`, {
      headers: this.headers(tenantId),
    });
  }

  /** Create a new partner */
  createPartner(partner: PartnerCreate, tenantId?: string) {
    return this.http.post<Partner>(`${this.API_GATEWAY_URL}/partners`, partner, {
      headers: this.headers(tenantId),
    });
  }

  /** Update an existing partner */
  updatePartner(id: string, partner: PartnerUpdate, tenantId?: string) {
    return this.http.put<Partner>(`${this.API_GATEWAY_URL}/partners/${id}`, partner, {
      headers: this.headers(tenantId),
    });
  }

  /** Delete a partner */
  deletePartner(id: string, tenantId?: string) {
    return this.http.delete<void>(`${this.API_GATEWAY_URL}/partners/${id}`, {
      headers: this.headers(tenantId),
    });
  }
}
