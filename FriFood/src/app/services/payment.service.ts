import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.paymentServiceUrl;

  /** Confirm payment */
  confirmPayment(paymentId: number) {
    return this.http.post(`${this.API_URL}/payments/${paymentId}/confirm`, {});
  }
}
