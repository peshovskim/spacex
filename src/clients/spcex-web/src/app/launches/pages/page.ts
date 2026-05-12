import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';

import { LaunchType, toLaunchType, type LaunchDto } from '../models/launch.model';
import { LaunchesService } from '../services/launches.service';
import { LaunchesFilterComponent } from '../components/launches-filter/launches-filter';
import { LaunchesListComponent } from '../components/launches-list/launches-list';

@Component({
  selector: 'app-page',
  imports: [MatToolbarModule, LaunchesFilterComponent, LaunchesListComponent],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  readonly activeType = signal<LaunchType>(LaunchType.Upcoming);
  readonly launches = signal<LaunchDto[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

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
      this.fetchLaunches(slug);
    });
  }

  onTypeChange(type: string): void {
    const slug = toLaunchType(type);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: slug },
    });
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
