import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly step = signal<1 | 2 | 3>(1);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly showNewPassword = signal(false);

  // store email across steps
  private submittedEmail = '';

  readonly firstForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly secondForm = this.formBuilder.group({
    resetCode: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly thirdForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
  });

  get firstEmail() {
    return this.firstForm.get('email');
  }
  get resetCode() {
    return this.secondForm.get('resetCode');
  }
  get thirdEmail() {
    return this.thirdForm.get('email');
  }
  get newPassword() {
    return this.thirdForm.get('newPassword');
  }

  toggleNewPassword(): void {
    this.showNewPassword.update((v) => !v);
  }

  submitFirstForm(): void {
    this.errorMessage.set('');

    if (this.firstForm.invalid) {
      this.firstForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.submittedEmail = this.firstForm.value.email!;

    this.authService
      .sendEmail(this.firstForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastrService.success('Reset code sent to your email.', 'FreshCart');
          // pre-fill email in step 3
          this.thirdForm.patchValue({ email: this.submittedEmail });
          this.step.set(2);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err?.error?.message || 'Failed to send reset code. Please try again.',
          );
        },
      });
  }

  submitSecondForm(): void {
    this.errorMessage.set('');

    if (this.secondForm.invalid) {
      this.secondForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService
      .sendVerifyCode(this.secondForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastrService.success('Code verified!', 'FreshCart');
          this.step.set(3);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err?.error?.message || 'Invalid or expired code. Please try again.',
          );
        },
      });
  }

  submitThirdForm(): void {
    this.errorMessage.set('');

    if (this.thirdForm.invalid) {
      this.thirdForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService
      .sendNewPassword(this.thirdForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastrService.success('Password reset successfully! Please sign in.', 'FreshCart');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err?.error?.message || 'Failed to reset password. Please try again.',
          );
        },
      });
  }

  goBack(): void {
    this.errorMessage.set('');
    if (this.step() === 2) this.step.set(1);
    else if (this.step() === 3) this.step.set(2);
  }
}
