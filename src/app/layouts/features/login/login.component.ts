import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly showPassword = signal<boolean>(false);

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  submitLogin(): void {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.signIn(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);

        if (res.message === 'success') {
          localStorage.setItem('freshToken', res.token);
          localStorage.setItem('freshUser', JSON.stringify(res.user));
          this.authService.isLoggedIn.set(true);

          this.cartService.getUserCart().subscribe({
            next: (cartRes) => {
              if (cartRes?.numOfCartItems !== undefined) {
                this.cartService.numOfCartItems.set(cartRes.numOfCartItems);
              }
            },
          });

          this.toastrService.success('Welcome back!', 'FreshCart');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Invalid email or password. Please try again.',
        );
      },
    });
  }
}
