import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import type { LaunchDto } from '../../models/launch.model';

@Component({
  selector: 'app-launches-list',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  templateUrl: './launches-list.html',
  styleUrl: './launches-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesListComponent implements OnChanges {
  readonly displayedColumns: string[] = [
    'flightNumber',
    'name',
    'details',
    'upcoming',
    'success',
    'dateUtc',
  ];

  readonly emptyCell = '—';

  dataSource = new MatTableDataSource<LaunchDto>([]);

  @Input() launches: LaunchDto[] = [];
  @Input() loading = false;
  @Input() errorMessage: string | null = null;
  @Input() totalCount = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() sortActive = 'dateUtc';
  @Input() sortDirection: SortDirection = 'asc';
  @Input() hidePaginator = false;

  @Output() readonly pageChange = new EventEmitter<PageEvent>();
  @Output() readonly sortChange = new EventEmitter<Sort>();

  formatBoolean(value: boolean | null | undefined): string {
    if (value === true) {
      return 'true';
    }
    if (value === false) {
      return 'false';
    }
    return this.emptyCell;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['launches']) {
      this.dataSource.data = this.launches ?? [];
    }
  }
}
