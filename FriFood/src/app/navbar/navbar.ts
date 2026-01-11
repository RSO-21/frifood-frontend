import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { Notification, NotificationService } from '../services/notification.service';
import { Router, RouterLink } from '@angular/router';

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
  imports: [Login, PartnerDashboardModal, RouterLink],
})
export class Navbar {
  auth = inject(AuthService);
  login = inject(LoginService);
  userService = inject(UserService);
  partnerService = inject(PartnerService);
  offerService = inject(OfferService);
  notificationsService = inject(NotificationService);
  router = inject(Router);

  partnerData: Partner | null = null;
  notifications = signal<Notification[]>([]);
  showDropdown = false;

  unreadCount = computed(() => this.notifications().filter((n) => !n.is_read).length);

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    effect(() => {
      const user = this.userService.user();
      console.log('navbar user', user);

      if (!user) return;

      this.loadNotifications(this.userService.user_id());
    });
  }

  loadNotifications(userId: string) {
    this.notificationsService.list(userId).subscribe({
      next: (list) => {
        console.log('notifications', list);
        this.notifications.set(list);
        this.changeDetectorRef.detectChanges();
      },
      error: () => {},
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  markAsRead(notification: Notification) {
    if (notification.is_read) return;
    console.log('marking it as read?', notification);

    this.notificationsService.markRead(notification.id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
      },
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
  openNotifications() {
    this.showDropdown = !this.showDropdown;
  }
  goToCart() {
    // Navigate to the cart page
    window.location.href = '/cart';
  }
}
