export const DEFAULT_LAUNCH_QUERY_TYPE = 'upcoming';

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
