export enum LaunchType {
  Latest = 'latest',
  Upcoming = 'upcoming',
  Past = 'past',
}

export function toLaunchType(input?: string): LaunchType {
  switch (input?.toLowerCase()) {
    case 'latest':
      return LaunchType.Latest;
    case 'past':
      return LaunchType.Past;
    default:
      return LaunchType.Upcoming;
  }
}

export interface LaunchDto {
  flight_number: number;
  name: string;
  details?: string | null;
  date_utc?: string | null;
  upcoming?: boolean | null;
  success?: boolean | null;
}

export interface LaunchesResponseDto {
  launches: LaunchDto[];
  totalCount: number;
}

export enum LaunchSortField {
  FlightNumber = 'flight_number',
  Name = 'name',
  Details = 'details',
  DateUtc = 'date_utc',
  Upcoming = 'upcoming',
  Success = 'success',
}

export function toSortColumnToApiField(active: string): LaunchSortField {
  switch (active) {
    case 'flightNumber':
      return LaunchSortField.FlightNumber;
    case 'name':
      return LaunchSortField.Name;
    case 'details':
      return LaunchSortField.Details;
    case 'dateUtc':
      return LaunchSortField.DateUtc;
    case 'upcoming':
      return LaunchSortField.Upcoming;
    case 'success':
      return LaunchSortField.Success;
    default:
      return LaunchSortField.DateUtc;
  }
}
