import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { Offer, Partner, PartnerRating } from '../models';

import { OffersComponent } from '../offers/offers';
import { PartnerDashboardModal } from '../partner-dashboard-modal/partner-dashboard-modal';
import { PartnerService } from '../services/partner.service';
import { ReviewService } from '../services/review.service';
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
  private reviewService = inject(ReviewService);
  protected partners: any[] = [];
  private cdr = inject(ChangeDetectorRef);
  partnerRatings = signal<Map<string, PartnerRating>>(new Map());
  ratingsLoaded = signal(false);

  private samePartners(a: Partner[], b: Partner[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i].id !== b[i].id) return false;
    }

    return true;
  }
  constructor() {
    effect(() => {
      const partners = this.partnerService.partners();
      console.log('Effect happening?', partners);

      if (!partners || partners.length === 0) {
        this.partners = partners;
        this.cdr.detectChanges();
        return;
      }

      // prevent refetching on every signal tick
      if (this.ratingsLoaded() && this.samePartners(this.partners, partners)) {
        this.partners = partners;
        this.cdr.detectChanges();
        return;
      }

      const partnerIds = partners.map((p) => p.id);

      this.reviewService.getPartnersRatings(partnerIds).subscribe({
        next: (ratings) => {
          const map = new Map(this.partnerRatings());

          Object.values(ratings).forEach((r) => {
            map.set(r.partner_id, r);
          });

          this.partners = partners;
          console.log('Setting partners');
          this.partnerRatings.set(map);
          this.ratingsLoaded.set(true);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load partner ratings', err);
          this.partners = partners;
          this.cdr.detectChanges();
        },
      });
    });
  }

  ratingFor(partnerId: string): PartnerRating | undefined {
    return this.partnerRatings().get(partnerId);
  }

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
