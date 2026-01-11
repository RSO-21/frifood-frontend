import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiGatewayUrl}/graphql`;

  private headers(tenantId?: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (tenantId) {
      headers = headers.set('X-Tenant-ID', tenantId);
    }

    return headers;
  }

  /** Get all orders */
  getOrders(tenantId: string = 'public') {
    const query = `
      query GetOrders {
        getOrders {
          id
          userId
          orderStatus
          paymentStatus
          createdAt
          items {
            id
            offerId
            quantity
          }
        }
      }
    `;

    return this.http.post<any>(this.GRAPHQL_URL, { query }, { headers: this.headers(tenantId) });
  }

  createOrder(
    input: {
      userId: string;
      partnerId: string;
      items: { offerId: number; quantity: number }[];
      amount: number; // Decimal-safe
    },
    tenantId: string = 'public'
  ) {
    const mutation = `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id
        userId
        orderStatus
        paymentStatus
        createdAt
        items {
          id
          offerId
          quantity
        }
      }
    }
  `;

    return this.http.post<any>(
      this.GRAPHQL_URL,
      {
        query: mutation,
        variables: {
          input,
        },
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
        }),
      }
    );
  }
}
