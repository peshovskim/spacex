import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { LaunchType } from '../../models/launch.model';

@Component({
  selector: 'app-launches-filter',
  imports: [MatButtonToggleModule],
  templateUrl: './launches-filter.html',
  styleUrl: './launches-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesFilterComponent {
  @Input({ required: true }) selectedType!: string;

  @Output() readonly selectedTypeChange = new EventEmitter<string>();

  readonly items = [
    { type: LaunchType.Latest, label: 'Latest' },
    { type: LaunchType.Upcoming, label: 'Upcoming' },
    { type: LaunchType.Past, label: 'Past' },
  ];

  onSelectionChange(event: MatButtonToggleChange): void {
    const value = String(event.value);
    if (value !== this.selectedType) {
      this.selectedTypeChange.emit(value);
    }
  }
}
