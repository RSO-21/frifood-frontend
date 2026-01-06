import { Injectable, signal } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly _openLogin = new Subject<boolean>();
  private readonly _openSignup = new Subject<boolean>();

  readonly openLogin$ = this._openLogin.asObservable();
  readonly openSignup$ = this._openSignup.asObservable();

  triggerLogin(): void {
    this._openLogin.next(true);
  }

  triggerSignup(): void {
    this._openSignup.next(true);
  }

  reset(): void {
    this._openLogin.next(false);
    this._openSignup.next(false);
  }
}
