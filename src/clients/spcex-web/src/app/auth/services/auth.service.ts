import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/api/auth/register`,
      request,
    );
  }

  login(request: LoginRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/auth/login`, request);
  }
}
