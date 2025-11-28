import { AfterViewInit, Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../auth/auth.service';
import { LoginService } from './login.service';
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
export class Login implements AfterViewInit {
  @ViewChild('loginModal') loginModal!: ElementRef<HTMLElement>;
  @ViewChild('signupModal') signupModal!: ElementRef<HTMLElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly loginService = inject(LoginService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

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

  ngAfterViewInit(): void {
    this.loginService.openLogin$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.openModal(this.loginModal);
    });

    this.loginService.openSignup$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((open: boolean) => {
        if (open) {
          this.openModal(this.signupModal);
        }
      });
  }

  private openModal(ref: ElementRef<HTMLElement>): void {
    const bs = bootstrap as {
      Modal: new (el: HTMLElement) => { show(): void };
    };
    const modal = new bs.Modal(ref.nativeElement);
    modal.show();
  }

  submitLogin(): void {
    console.log('submitLogin called');
    if (this.loginForm.valid) {
      console.log('Login form submitted:', this.loginForm.value);
      // emit event / call API service
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
    } else {
      console.log('Form invalid');
      this.loginForm.markAllAsTouched();
    }
  }

  submitSignup(): void {
    if (this.signupForm.valid) {
      console.log('Signup form submitted:', this.signupForm.value);
      // emit event / call API service
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
