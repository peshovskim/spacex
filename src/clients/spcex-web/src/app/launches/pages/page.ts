import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import {
  LaunchType,
  toLaunchType,
  toSortColumnToApiField,
  type LaunchDto,
  type LaunchesResponseDto,
} from '../models/launch.model';
import { LaunchesFilterComponent } from '../components/launches-filter/launches-filter';
import { LaunchesListComponent } from '../components/launches-list/launches-list';
import { LaunchesService } from '../services/launches.service';

@Component({
  selector: 'app-page',
  imports: [TitleCasePipe, MatIconModule, LaunchesFilterComponent, LaunchesListComponent],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  readonly activeType = signal<LaunchType>(LaunchType.Upcoming);
  readonly launches = signal<LaunchDto[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly sortActive = signal('dateUtc');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly pageTitle = computed(() => {
    switch (this.activeType()) {
      case LaunchType.Latest:
        return 'Latest launch';
      case LaunchType.Past:
        return 'Completed launches';
      case LaunchType.Upcoming:
      default:
        return 'Upcoming launches';
    }
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly launchesService: LaunchesService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.keys.length > 0) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true,
      });
    }

    this.load();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  onSortChange(sort: Sort): void {
    const type = this.activeType();
    if (!sort.direction) {
      this.sortActive.set('dateUtc');
      this.sortDirection.set(this.defaultSortDirection(type));
    } else {
      this.sortActive.set(sort.active);
      this.sortDirection.set(sort.direction as 'asc' | 'desc');
    }

    this.pageIndex.set(0);
    this.load();
  }

  onTypeChange(type: LaunchType): void {
    const slug = toLaunchType(type);
    this.activeType.set(slug);
    this.pageIndex.set(0);
    this.pageSize.set(10);
    this.sortActive.set('dateUtc');
    this.sortDirection.set(this.defaultSortDirection(slug));
    this.load();
  }

  signOut(): void {
    this.authService.signOut();
  }

  private defaultSortDirection(type: LaunchType): 'asc' | 'desc' {
    return type === LaunchType.Upcoming ? 'asc' : 'desc';
  }

  private load(): void {
    const type = this.activeType();
    this.loading.set(true);
    this.errorMessage.set(null);

    this.launchesService
      .getLaunches({
        type,
        page: this.pageIndex(),
        pageSize: this.pageSize(),
        sortField: toSortColumnToApiField(this.sortActive()),
        sortDirection: this.sortDirection(),
      })
      .subscribe({
        next: (response: LaunchesResponseDto) => {
          this.launches.set(response.launches ?? []);
          this.totalCount.set(response.totalCount ?? 0);
          this.loading.set(false);
        },
        error: () => {
          this.launches.set([]);
          this.totalCount.set(0);
          this.errorMessage.set('Could not load launches.');
          this.loading.set(false);
        },
      });
  }
}
