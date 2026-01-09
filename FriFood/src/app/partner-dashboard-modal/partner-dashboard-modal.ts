import { ChangeDetectorRef, Component, Input, SimpleChanges, inject } from '@angular/core';
import { Offer, Partner } from '../models';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../services/offers.service';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-partner-dashboard-modal',
  imports: [FormsModule, DatePipe],
  standalone: true,
  templateUrl: './partner-dashboard-modal.html',
  styleUrl: './partner-dashboard-modal.less',
})
export class PartnerDashboardModal {
  @Input() partner: Partner | null = null;
  @Input() isOwnerPartner = false;
  @Input() initiatingComponent: 'partners' | 'navbar' = 'navbar';
  offers: Offer[] = [];

  editingOfferId: number | 'new' | null = null;
  draftOffer: Partial<Offer> = {};

  offerService = inject(OfferService);
  cdr = inject(ChangeDetectorRef);
  UserService = inject(UserService);

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['partner']?.currentValue &&
      changes['partner']?.currentValue !== changes['partner']?.previousValue
    ) {
      this.loadOffers();
    }
  }

  loadOffers() {
    if (!this.partner) return;

    this.offerService.listOffersByPartner(this.partner.id).subscribe((offers) => {
      this.offers = offers;
      this.cdr.detectChanges();
    });
  }

  /* ───── UI actions ───── */

  startAddOffer() {
    this.editingOfferId = 'new';
    this.draftOffer = {
      partner_id: this.partner!.id,
      title: '',
      description: '',
      price_original: 0,
      price_discounted: 0,
      expiry_date: new Date().toISOString().split('T')[0], // default to today
    };
  }

  startEditOffer(offer: Offer) {
    this.editingOfferId = offer.id;
    this.draftOffer = { ...offer };
  }

  cancelEdit() {
    this.editingOfferId = null;
    this.draftOffer = {};
  }

  saveOffer() {
    if (!this.partner) return;

    if (this.editingOfferId === 'new') {
      this.offerService.createOffer(this.draftOffer as Offer).subscribe(() => {
        this.cancelEdit();
        this.loadOffers();
      });
    } else {
      this.offerService.updateOffer(this.editingOfferId!, this.draftOffer).subscribe(() => {
        this.cancelEdit();
        this.loadOffers();
      });
    }
  }

  deleteOffer(offerId: number) {
    this.offerService.deleteOffer(offerId).subscribe(() => {
      this.loadOffers();
    });
  }

  discountPercent(offer: Offer): number {
    return Math.round(
      ((offer.price_original - offer.price_discounted) / offer.price_original) * 100
    );
  }

  addToCart(offer: Offer) {
    this.UserService.addOfferToCart(this.UserService.user_id(), offer.id);
  }
}
