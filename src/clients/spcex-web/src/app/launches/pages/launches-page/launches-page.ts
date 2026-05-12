import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { DEFAULT_LAUNCH_QUERY_TYPE, type LaunchDto } from '../../models/launch.model';
import { LaunchesService } from '../../services/launches.service';
import { LaunchesFilterComponent } from '../../components/launches-filter/launches-filter';
import { LaunchesListComponent } from '../../components/launches-list/launches-list';

@Component({
  selector: 'app-launches-page',
  imports: [MatToolbarModule, LaunchesFilterComponent, LaunchesListComponent],
  templateUrl: './launches-page.html',
  styleUrl: './launches-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesPageComponent implements OnInit {
  readonly activeType = signal<string>(DEFAULT_LAUNCH_QUERY_TYPE);
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
      const type = params.get('type') ?? DEFAULT_LAUNCH_QUERY_TYPE;
      this.activeType.set(type);
      this.fetchLaunches(type);
    });
  }

  private fetchLaunches(type: string): void {
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
