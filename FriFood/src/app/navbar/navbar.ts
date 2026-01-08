import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Login } from '../login/login';
import { LoginService } from '../login/login.service';
import { OfferService } from '../services/offers.service';
import { Partner } from '../models';
import { PartnerDashboardModal } from '../partner-dashboard-modal/partner-dashboard-modal';
import { PartnerService } from './../services/partner.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.less'],
  standalone: true,
  imports: [Login, PartnerDashboardModal],
})
export class Navbar {
  auth = inject(AuthService);
  login = inject(LoginService);
  userService = inject(UserService);
  partnerService = inject(PartnerService);
  offerService = inject(OfferService);

  partnerData: Partner | null = null;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    effect(() => {
      const user = this.userService.user();

      if (!user) return;
    });
  }

  loadPartnerInfo() {
    if (!this.userService.user()?.partner_id) return;
    this.partnerService.getPartner(this.userService.user()!.partner_id!).subscribe({
      next: (partner) => {
        this.partnerData = partner;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        // Handle the error
      },
    });
  }

  goToCart() {
    // Navigate to the cart page
    window.location.href = '/cart';
  }
}
