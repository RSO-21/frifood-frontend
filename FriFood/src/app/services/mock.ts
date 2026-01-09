import { Injectable, inject } from '@angular/core';
import { Offer, PartnerCreate } from '../models';
import { forkJoin, switchMap } from 'rxjs';

import { OfferService } from './offers.service';
import { PartnerService } from './partner.service';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private readonly partnerService = inject(PartnerService);
  private readonly offerService = inject(OfferService);

  /**
   * Call this once (e.g. from AppComponent or a dev-only button)
   */
  seedDatabase(tenantId: string = 'dev') {
    const partners: PartnerCreate[] = [
      {
        name: 'Green Café',
        address: 'Main Street 12',
        city: 'Ljubljana',
        latitude: 46.0569,
        longitude: 14.5058,
        active: true,
        tenant_id: tenantId,
      },
      {
        name: 'Urban Gym',
        address: 'Fitness Ave 8',
        city: 'Ljubljana',
        latitude: 46.065,
        longitude: 14.51,
        active: true,
        tenant_id: tenantId,
      },
      {
        name: 'Tech Store',
        address: 'Innovation Road 3',
        city: 'Maribor',
        latitude: 46.5547,
        longitude: 15.6459,
        active: true,
        tenant_id: tenantId,
      },
      {
        name: 'Wine House',
        address: 'Old Town 1',
        city: 'Ptuj',
        latitude: 46.4199,
        longitude: 15.8697,
        active: true,
        tenant_id: tenantId,
      },
    ];

    // 1️⃣ Create partners
    return forkJoin(partners.map((p) => this.partnerService.createPartner(p, tenantId))).pipe(
      // 2️⃣ Create offers using returned partner IDs
      switchMap((createdPartners) => {
        const offers: Offer[] = [
          {
            id: 1,
            partner_id: createdPartners[0].id,
            title: 'Coffee & Croissant',
            description: 'Morning combo deal',
            price_original: 5,
            price_discounted: 3.5,
            expiry_date: '2026-03-01',
            tenant_id: tenantId,
          },
          {
            id: 2,
            partner_id: createdPartners[1].id,
            title: 'Monthly Gym Pass',
            description: 'Unlimited access',
            price_original: 60,
            price_discounted: 45,
            expiry_date: '2026-04-01',
            tenant_id: tenantId,
          },
          {
            id: 3,
            partner_id: createdPartners[2].id,
            title: 'Wireless Headphones',
            description: 'Noise cancelling',
            price_original: 120,
            price_discounted: 89,
            expiry_date: '2026-05-15',
            tenant_id: tenantId,
          },
          {
            id: 4,
            partner_id: createdPartners[3].id,
            title: 'Wine Tasting',
            description: 'Local premium wines',
            price_original: 40,
            price_discounted: 29,
            expiry_date: '2026-02-20',
            tenant_id: tenantId,
          },
        ];

        return forkJoin(offers.map((o) => this.offerService.createOffer(o, tenantId)));
      })
    );
  }
}
