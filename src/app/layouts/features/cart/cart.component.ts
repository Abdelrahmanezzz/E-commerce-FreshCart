import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UpperCasePipe } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { IProductItem } from '../../../core/models/product-item.interface';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  readonly productsList = signal<IProductItem[]>([]);
  readonly totalCartPrice = signal<number>(0);
  readonly cartId = signal<string>('');
  readonly isLoading = signal<boolean>(true);

  readonly numOfCartItems = computed(() => this.cartService.numOfCartItems());

  ngOnInit(): void {
    this.getUserCart();
  }

  getUserCart(): void {
    this.isLoading.set(true);

    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartId.set(res.cartId);
        this.cartService.numOfCartItems.set(res.numOfCartItems);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.productsList.set(res.data.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.productsList.set([]);
        this.isLoading.set(false);
      },
    });
  }

  removeFromCartAction(pId: string): void {
    this.cartService.removeFromCart(pId).subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.productsList.set(res.data.products);
        this.toastrService.success('Item removed from cart', 'FreshCart');
      },
      error: (err) => {
        this.toastrService.error(err?.error?.message || 'Failed to remove item', 'FreshCart');
      },
    });
  }

  updateQuantityAction(pId: string, currentCount: number, change: number): void {
    const newCount = currentCount + change;

    if (newCount < 1) {
      this.removeFromCartAction(pId);
      return;
    }

    this.cartService.updateQuantity(pId, newCount).subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
        this.totalCartPrice.set(res.data.totalCartPrice);
        this.productsList.set(res.data.products);
      },
      error: (err) => {
        this.toastrService.error(err?.error?.message || 'Something went wrong', 'FreshCart');
      },
    });
  }

  clearCartAction(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartService.numOfCartItems.set(0);
        this.totalCartPrice.set(0);
        this.productsList.set([]);
        this.toastrService.success('Cart cleared successfully', 'FreshCart');
      },
      error: (err) => {
        this.toastrService.error(err?.error?.message || 'Failed to clear cart', 'FreshCart');
      },
    });
  }
}
