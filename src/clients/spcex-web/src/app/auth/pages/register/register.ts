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

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  readonly form;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      firstName: this.fb.control('', {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      lastName: this.fb.control('', {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  protected readonly submitting = signal(false);

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitRegistration();
  }

  private submitRegistration(): void {
    this.submitting.set(true);
    this.auth
      .register(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Account created successfully.', 'Close', {
            duration: 5000,
          });
          void this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) =>
          this.snackBar.open(this.formatRegisterErrorMessage(error), 'Close', {
            duration: 5000,
          }),
      });
  }

  private formatRegisterErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 409) {
      return 'An account with this email already exists.';
    }

    if (error.status === 400) {
      return 'Please check your details and try again.';
    }

    return 'Registration failed due to a server error. Please try again.';
  }
}
