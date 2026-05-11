import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { TokenStorage } from '../../../core/services/token-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  readonly form;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly auth: AuthService,
    private readonly tokens: TokenStorage,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', { validators: [Validators.required] }),
    });
  }

  protected readonly submitting = signal(false);

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitLogin();
  }

  private submitLogin(): void {
    this.submitting.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.tokens.set(response.accessToken);
          this.snackBar.open('You are now signed in to SpaceX Portal.', 'Close', {
            duration: 5000,
          });
          void this.router.navigate(['/launches']);
        },
        error: (error: HttpErrorResponse) =>
          this.snackBar.open(this.formatLoginErrorMessage(error), 'Close', {
            duration: 5000,
          }),
      });
  }

  private formatLoginErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Invalid email or password.';
    }

    if (error.status === 400) {
      return 'Please enter a valid email and password.';
    }

    return 'Sign-in failed due to a server error. Please try again.';
  }
}
