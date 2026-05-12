import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
  private _sort?: MatSort;
  private _paginator?: MatPaginator;

  readonly displayedColumns: string[] = [
    'flightNumber',
    'name',
    'details',
    'upcoming',
    'success',
    'dateUtc',
  ];

  @ViewChild(MatSort)
  set sort(value: MatSort | undefined) {
    this._sort = value;
    this.bindTableFeatures();
  }

  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator | undefined) {
    this._paginator = value;
    this.bindTableFeatures();
  }

  readonly emptyCell = '—';

  dataSource = new MatTableDataSource<LaunchDto>([]);

  @Input() launches: LaunchDto[] = [];
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  constructor() {
    this.dataSource.sortingDataAccessor = (row, columnId) => {
      switch (columnId) {
        case 'flightNumber':
          return row.flight_number;
        case 'name':
          return row.name.toLowerCase();
        case 'details':
          return (row.details ?? '').toLowerCase();
        case 'dateUtc':
          return row.date_utc ? new Date(row.date_utc).getTime() : 0;
        case 'upcoming':
          return LaunchesListComponent.boolSortKey(row.upcoming);
        case 'success':
          return LaunchesListComponent.boolSortKey(row.success);
        default:
          return '';
      }
    };
  }

  formatBoolean(value: boolean | null | undefined): string {
    if (value === true) {
      return 'true';
    }
    if (value === false) {
      return 'false';
    }
    return this.emptyCell;
  }

  private static boolSortKey(value: boolean | null | undefined): number {
    if (value === true) {
      return 1;
    }
    if (value === false) {
      return 0;
    }
    return -1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['launches']) {
      this.dataSource.data = this.launches ?? [];
    }
  }

  private bindTableFeatures(): void {
    if (this._sort) {
      this.dataSource.sort = this._sort;
    }
    if (this._paginator) {
      this.dataSource.paginator = this._paginator;
    }
  }
}
