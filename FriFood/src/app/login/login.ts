import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../auth/auth.service';
import { LoginService } from './login.service';
import { Modal } from 'bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

declare const bootstrap: unknown;

@Component({
  selector: 'app-login-modals',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.less',
  host: {
    role: 'region',
    'aria-label': 'User authentication modals',
  },
})
export class Login implements OnInit, AfterViewInit {
  @ViewChild('loginModal') loginModal!: ElementRef<HTMLElement>;
  @ViewChild('signupModal') signupModal!: ElementRef<HTMLElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly loginService = inject(LoginService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  private readonly platformId = inject(PLATFORM_ID);

  // 👇 Typed reactive forms
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  signupForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.auth.loadMe();
  }

  ngAfterViewInit(): void {
    this.loginService.openLogin$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((open: boolean) => {
        if (open) {
          this.openModal(this.loginModal);
        } else {
          console.log('Closing login modal');
          this.closeModal(this.loginModal);
        }
      });

    this.loginService.openSignup$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((open: boolean) => {
        if (open) {
          this.openModal(this.signupModal);
        } else {
          this.closeModal(this.signupModal);
        }
      });
  }

  private async openModal(ref: ElementRef<HTMLElement>): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const { Modal } = await import('bootstrap');
    const modal = new Modal(ref.nativeElement);
    modal.show();
  }

  private async closeModal(ref: ElementRef<HTMLElement>): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const { Modal } = await import('bootstrap');
    const modal = Modal.getInstance(ref.nativeElement);
    modal?.hide();
  }

  submitLogin(): void {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  submitSignup(): void {
    if (this.signupForm.valid) {
      this.auth.signup(
        this.signupForm.value.name,
        this.signupForm.value.email,
        this.signupForm.value.password
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
