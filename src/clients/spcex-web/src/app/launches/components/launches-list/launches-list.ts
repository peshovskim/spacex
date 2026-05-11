import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import type { LaunchDto } from '../../models/launch.model';
import { LaunchCardComponent } from '../launch-card/launch-card';

@Component({
  selector: 'app-launches-list',
  imports: [MatProgressSpinnerModule, LaunchCardComponent],
  templateUrl: './launches-list.html',
  styleUrl: './launches-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesListComponent {
  @Input() launches: LaunchDto[] = [];
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  constructor() {}
}
