import { Component, inject } from '@angular/core';
import { Offer, Partner } from '../models';

import { OffersComponent } from '../offers/offers';
import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-partners',
  imports: [OffersComponent],
  templateUrl: './partners.html',
  styleUrl: './partners.less',
})
export class Partners {
  private partnerService = inject(PartnerService);

  partners = this.partnerService.partners;

  protected distanceTo(partner: Partner): string {
    return '';
  }

  protected openPartner(partner: Partner): void {}

  protected offersForPartner(partner: Partner): Offer[] {
    return [];
  }
}
