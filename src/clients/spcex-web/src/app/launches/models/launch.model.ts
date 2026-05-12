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
}
