import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { LaunchType } from '../../models/launch.model';

@Component({
  selector: 'app-launches-filter',
  templateUrl: './launches-filter.html',
  styleUrl: './launches-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesFilterComponent {
  @Input({ required: true }) selectedType!: LaunchType;

  @Output() readonly selectedTypeChange = new EventEmitter<LaunchType>();

  readonly items = [
    { type: LaunchType.Latest, label: 'Latest' },
    { type: LaunchType.Upcoming, label: 'Upcoming' },
    { type: LaunchType.Past, label: 'Past' },
  ];

  onSelect(type: LaunchType): void {
    if (type !== this.selectedType) {
      this.selectedTypeChange.emit(type);
    }
  }
}
