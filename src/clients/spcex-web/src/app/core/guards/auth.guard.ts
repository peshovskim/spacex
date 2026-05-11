import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { TokenStorage } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokens: TokenStorage,
    private readonly router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    return this.tokens.get()
      ? true
      : this.router.createUrlTree(['/auth/login']);
  }
}
