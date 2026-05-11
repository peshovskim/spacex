import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import type { LaunchDto } from '../../models/launch.model';

@Component({
  selector: 'app-launch-card',
  imports: [MatCardModule, MatChipsModule, DatePipe],
  templateUrl: './launch-card.html',
  styleUrl: './launch-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchCardComponent {
  @Input({ required: true }) launch!: LaunchDto;

  constructor() {}
}
