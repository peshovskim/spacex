import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { LaunchesResponseDto } from '../models/launch.model';

@Injectable({
  providedIn: 'root',
})
export class LaunchesService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private readonly http: HttpClient) {}

  getLaunches(type: string): Observable<LaunchesResponseDto> {
    const params = new HttpParams().set('type', type);

    return this.http.get<LaunchesResponseDto>(`${this.baseUrl}/api/launches`, {
      params,
    });
  }
}
