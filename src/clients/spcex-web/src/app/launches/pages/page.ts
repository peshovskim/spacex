import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LaunchType, toLaunchType, type LaunchDto } from '../models/launch.model';
import { LaunchesFilterComponent } from '../components/launches-filter/launches-filter';
import { LaunchesListComponent } from '../components/launches-list/launches-list';
import { LaunchesService } from '../services/launches.service';

@Component({
  selector: 'app-page',
  imports: [
    TitleCasePipe,
    RouterLink,
    MatIconModule,
    LaunchesFilterComponent,
    LaunchesListComponent,
  ],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly activeType = signal<LaunchType>(LaunchType.Upcoming);
  readonly launches = signal<LaunchDto[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /** Applied when the user presses Enter in the search field. */
  readonly searchQuery = signal('');

  readonly displayedLaunches = computed(() => {
    const items = this.launches();
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return items;
    }

    return items.filter((launch) => {
      const haystack = [
        launch.name,
        launch.details ?? '',
        String(launch.flight_number),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  });

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
    private readonly destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const slug = toLaunchType(params.get('type') ?? undefined);
      this.activeType.set(slug);
      this.searchQuery.set('');
      setTimeout(() => this.clearSearchField(), 0);
      this.fetchLaunches(slug);
    });
  }

  onSearchEnter(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value.trim());
  }

  onTypeChange(type: LaunchType): void {
    const slug = toLaunchType(type);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: slug },
    });
  }

  private clearSearchField(): void {
    const el = this.searchInput()?.nativeElement;
    if (el) {
      el.value = '';
    }
  }

  private fetchLaunches(type: LaunchType): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.launchesService.getLaunches(type).subscribe({
      next: (response) => {
        this.launches.set(response.launches ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.launches.set([]);
        this.errorMessage.set('Could not load launches.');
        this.loading.set(false);
      },
    });
  }
}
