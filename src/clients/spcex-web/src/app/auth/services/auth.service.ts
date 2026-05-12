import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TokenStorage } from '../../core/services/token-storage.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(
    private readonly http: HttpClient,
    private readonly tokens: TokenStorage,
    private readonly router: Router,
  ) {}

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/api/auth/register`,
      request,
    );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/api/auth/login`,
      request,
    );
  }

  signOut(): void {
    this.tokens.clear();
    void this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}
