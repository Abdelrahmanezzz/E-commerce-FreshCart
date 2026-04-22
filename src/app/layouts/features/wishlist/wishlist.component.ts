import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly wishlistItems = signal<any[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly removingIds = signal<Set<string>>(new Set());
  readonly addingToCartIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.wishlistService
      .getUserWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.wishlistItems.set(res.data ?? []);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Failed to load your wishlist.');
          this.isLoading.set(false);
        },
      });
  }

  removeItem(productId: string): void {
    this.removingIds.update((ids) => new Set(ids).add(productId));

    this.wishlistService
      .removeFromWishlist(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.wishlistItems.update((items) => items.filter((item) => item._id !== productId));
          this.removingIds.update((ids) => {
            const next = new Set(ids);
            next.delete(productId);
            return next;
          });
          this.toastrService.success('Product removed from wishlist.', 'FreshCart');
        },
        error: (err) => {
          this.removingIds.update((ids) => {
            const next = new Set(ids);
            next.delete(productId);
            return next;
          });
          this.toastrService.error(err?.error?.message || 'Failed to remove product.', 'FreshCart');
        },
      });
  }

  addProductToCart(productId: string): void {
    this.addingToCartIds.update((ids) => new Set(ids).add(productId));

    this.cartService
      .addToCart(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.addingToCartIds.update((ids) => {
            const next = new Set(ids);
            next.delete(productId);
            return next;
          });
          this.toastrService.success(res?.message || 'Product added to cart.', 'FreshCart');
          if (res?.numOfCartItems !== undefined) {
            this.cartService.numOfCartItems.set(res.numOfCartItems);
          }
        },
        error: (err) => {
          this.addingToCartIds.update((ids) => {
            const next = new Set(ids);
            next.delete(productId);
            return next;
          });
          this.toastrService.error(
            err?.error?.message || 'Failed to add product to cart.',
            'FreshCart',
          );
        },
      });
  }

  isRemoving(productId: string): boolean {
    return this.removingIds().has(productId);
  }

  isAddingToCart(productId: string): boolean {
    return this.addingToCartIds().has(productId);
  }
}
