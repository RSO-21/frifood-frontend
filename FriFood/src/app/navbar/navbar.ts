import { Component } from '@angular/core';
import { Login } from '../login/login';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.less'],
  imports: [Login],
})
export class Navbar {
  constructor(private readonly loginService: LoginService) {}

  openLogin(): void {
    this.loginService.triggerLogin();
  }

  openSignup(): void {
    this.loginService.triggerSignup();
  }
}
