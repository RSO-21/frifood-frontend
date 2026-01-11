import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { PartnerRating } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly API_URL_GATEWAY = environment.apiGatewayUrl;

  createReview(input: { order_id: number; user_id: string; rating: number; comment?: string }) {
    return this.http.post(`${this.API_URL_GATEWAY}/reviews`, input);
  }

  getPartnersRatings(partnerIds: string[]) {
    const params = partnerIds.join(',');
    return this.http.get<Record<string, PartnerRating>>(
      `${this.API_URL_GATEWAY}/partners/ratings`,
      {
        params: { partner_ids: params },
      }
    );
  }
}
