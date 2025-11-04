import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.less'],
})
export class Navbar {
  @ViewChild('loginModal') loginModal!: ElementRef<HTMLElement>;
  @ViewChild('signupModal') signupModal!: ElementRef<HTMLElement>;

  private loginInstance: any;
  private signupInstance: any;

  async openLogin() {
    if (typeof window === 'undefined') return; // SSR guard
    const { Modal } = await import('bootstrap'); // loads only in browser
    this.loginInstance ||= new Modal(this.loginModal.nativeElement);
    this.loginInstance.show();
  }

  async openSignup() {
    if (typeof window === 'undefined') return;
    const { Modal } = await import('bootstrap');
    this.signupInstance ||= new Modal(this.signupModal.nativeElement);
    this.signupInstance.show();
  }
}
