import { Component, effect, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Login } from '../login/login';
import { LoginService } from '../login/login.service';
import { PartnerDashboardModal } from '../partner-dashboard-modal/partner-dashboard-modal';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.less'],
  imports: [Login, PartnerDashboardModal],
})
export class Navbar {
  auth = inject(AuthService);
  login = inject(LoginService);
  userService = inject(UserService);

  constructor() {
    effect(() => {
      const user = this.userService.user();

      if (!user) return;
    });
  }
}
