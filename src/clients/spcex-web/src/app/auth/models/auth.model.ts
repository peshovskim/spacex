/** Matches SpaceX.Application.Identity.Requests.RegisterUserRequest */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Matches SpaceX.Application.Identity.Requests.LoginUserRequest */
export interface LoginRequest {
  email: string;
  password: string;
}
