import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { PageComponent } from './page';

describe('PageComponent', () => {
  let fixture: ComponentFixture<PageComponent>;
  let httpMock: HttpTestingController;
  const queryParamMap$ = new BehaviorSubject(convertToParamMap({ type: 'upcoming' }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: queryParamMap$.asObservable() },
        },
        { provide: Router, useValue: { navigate: async () => true } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const expectedUrl = `${environment.apiUrl.replace(/\/$/, '')}/api/launches`;
    const req = httpMock.expectOne(
      (r) => r.url.startsWith(expectedUrl) && r.params.get('type') === 'Upcoming',
    );
    req.flush({ launches: [] });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
