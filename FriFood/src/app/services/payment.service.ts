import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly API_GATEWAY_URL = environment.apiGatewayUrl;

  /** Confirm payment for an order */
  confirmPaymentForOrder(orderId: number, externalId: string) {
    console.log('Confirming payment for order:', orderId, externalId);

    return this.http.post(
      `${this.API_GATEWAY_URL}/payments/orders/${orderId}/confirm`,
      {}, // empty body
      {
        params: {
          external_id: externalId,
        },
      },
    );
  }
}
