import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LaunchType, toLaunchType, type LaunchDto } from '../models/launch.model';
import { LaunchesService } from '../services/launches.service';
import { LaunchesFilterComponent } from '../components/launches-filter/launches-filter';
import { LaunchesListComponent } from '../components/launches-list/launches-list';

@Component({
  selector: 'app-page',
  imports: [
    TitleCasePipe,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    LaunchesFilterComponent,
    LaunchesListComponent,
  ],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  readonly activeType = signal<LaunchType>(LaunchType.Upcoming);
  readonly launches = signal<LaunchDto[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

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
