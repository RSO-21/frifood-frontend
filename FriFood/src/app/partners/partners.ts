import { Component, inject } from '@angular/core';
import { Offer, Partner } from '../models';

import { OffersComponent } from '../offers/offers';
import { PartnerDashboardModal } from '../partner-dashboard-modal/partner-dashboard-modal';
import { PartnerService } from '../services/partner.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-partners',
  imports: [OffersComponent, PartnerDashboardModal],
  templateUrl: './partners.html',
  styleUrl: './partners.less',
})
export class Partners {
  private partnerService = inject(PartnerService);
  private userService = inject(UserService);

  partners = this.partnerService.partners;
  partnerToOpen: Partner | null = null;

  protected distanceTo(partner: Partner): string | null {
    const userLocation = this.userService.user_location();
    if (
      !userLocation ||
      userLocation.latitude == null ||
      userLocation.longitude == null ||
      partner.latitude == null ||
      partner.longitude == null
    ) {
      return null;
    }
    const userLat = userLocation.latitude;
    const userLng = userLocation.longitude;

    // Same constants as backend
    const KM_PER_DEGREE = 111;

    const latDiff = partner.latitude - userLat;
    const lngDiff = partner.longitude - userLng;

    const latKm = latDiff * KM_PER_DEGREE;
    const lngKm = lngDiff * KM_PER_DEGREE * Math.cos((userLat * Math.PI) / 180);

    // Pythagorean approximation (same accuracy class as BE)
    const distanceKm = Math.sqrt(latKm * latKm + lngKm * lngKm);

    // Format nicely
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }

    return `${distanceKm.toFixed(1)} km`;
  }

  protected openPartner(partner: Partner): void {
    this.partnerToOpen = partner;
  }
}
