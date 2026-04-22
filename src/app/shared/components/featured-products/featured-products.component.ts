import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { ProductsService } from '../../../core/services/products/products.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { IProduct } from '../../../core/models/i-product.interface';

@Component({
  selector: 'app-featured-products',
  imports: [RouterLink],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  readonly productList = signal<IProduct[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly skeletonCards = Array.from({ length: 10 });

  ngOnInit(): void {
    this.getFeaturedProducts();
  }

  getFeaturedProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productsService
      .getAllProducts({ limit: 10 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.productList.set(res.data ?? []);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Something went wrong while loading products.',
          );
          this.isLoading.set(false);
        },
      });
  }

  addToCartAction(productId: string): void {
    if (!this.isLoggedIn()) {
      this.toastrService.info('Please sign in first to add products to your cart.', 'FreshCart');
      return;
    }

    this.cartService
      .addToCart(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.toastrService.success(
            res?.message || 'Product added to cart successfully.',
            'FreshCart',
          );

          if (res?.numOfCartItems !== undefined) {
            this.cartService.numOfCartItems.set(res.numOfCartItems);
          }
        },
        error: (err) => {
          this.toastrService.error(
            err?.error?.message || 'Failed to add product to cart.',
            'FreshCart',
          );
        },
      });
  }
}
