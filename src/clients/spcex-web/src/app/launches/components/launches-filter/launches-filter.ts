import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';

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

  constructor() {}

  onSelectionChange(event: MatButtonToggleChange): void {
    const value = String(event.value);
    if (value !== this.selectedType) {
      this.selectedTypeChange.emit(value);
    }
  }
}
