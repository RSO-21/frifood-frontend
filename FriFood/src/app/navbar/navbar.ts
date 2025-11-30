import { Component, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Login } from '../login/login';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.less'],
  imports: [Login],
})
export class Navbar {
  auth = inject(AuthService);
  login = inject(LoginService);
}
