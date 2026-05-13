import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { PageComponent } from './page';

describe('PageComponent', () => {
  let fixture: ComponentFixture<PageComponent>;
  let httpMock: HttpTestingController;
  const emptyQuery = convertToParamMap({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: emptyQuery },
          },
        },
        { provide: Router, useValue: { navigate: async () => true } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const expectedUrl = `${environment.apiUrl.replace(/\/$/, '')}/api/launches`;
    const req = httpMock.expectOne(
      (r) =>
        r.url.startsWith(expectedUrl) &&
        r.params.get('type') === 'upcoming' &&
        r.params.get('page') === '0' &&
        r.params.get('pageSize') === '10' &&
        r.params.get('sortField') === 'date_utc' &&
        r.params.get('sortDirection') === 'asc',
    );
    req.flush({ launches: [], totalCount: 0 });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
