import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.reviewServiceUrl;

  createReview(input: { order_id: number; user_id: string; rating: number; comment?: string }) {
    return this.http.post(`${this.API_URL}/reviews`, input);
  }
}
