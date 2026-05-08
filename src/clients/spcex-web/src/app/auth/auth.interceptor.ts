import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TokenStorage } from './services/token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly tokens: TokenStorage) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokens.get();

    if (!token) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      }),
    );
  }
}
