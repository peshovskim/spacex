import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LaunchType, type LaunchesResponseDto } from '../models/launch.model';

export interface LaunchesQueryParams {
  type: LaunchType;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LaunchesService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private readonly http: HttpClient) {}

  getLaunches(params: LaunchesQueryParams): Observable<LaunchesResponseDto> {
    const page = params.page ?? 0;
    const pageSize = params.pageSize ?? 10;

    let httpParams = new HttpParams()
      .set('type', params.type)
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    if (params.sortField) {
      httpParams = httpParams.set('sortField', params.sortField);
    }

    if (params.sortDirection) {
      httpParams = httpParams.set('sortDirection', params.sortDirection);
    }

    return this.http.get<LaunchesResponseDto>(`${this.baseUrl}/api/launches`, {
      params: httpParams,
    });
  }
}
