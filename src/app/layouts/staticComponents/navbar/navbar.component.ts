import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  readonly numOfCartItems = computed(() => this.cartService.numOfCartItems());

  readonly isMobileMenuOpen = signal(false);
  readonly isUserDropdownOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen.update((v) => !v);
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpen.set(false);
  }

  logout(): void {
    localStorage.removeItem('freshToken');
    localStorage.removeItem('freshUser');
    this.authService.isLoggedIn.set(false);
    this.closeMobileMenu();
    this.closeUserDropdown();
    this.router.navigate(['/login']);
  }
}
