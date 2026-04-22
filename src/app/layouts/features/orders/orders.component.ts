import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { OrderService } from '../../../core/services/order/order.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);

  readonly orders = signal<any[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly expandedOrderId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);

    const userId = this.authService.userData()?.id;

    if (!userId) {
      this.isLoading.set(false);
      this.toastrService.error('User not found. Please sign in again.', 'FreshCart');
      return;
    }

    this.orderService.getAllUserOrders(userId).subscribe({
      next: (res) => {
        const allOrders = Array.isArray(res) ? res : (res?.data ?? []);
        this.orders.set(allOrders);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastrService.error(err?.error?.message || 'Failed to load your orders.', 'FreshCart');
      },
    });
  }

  toggleDetails(orderId: string): void {
    this.expandedOrderId.update((current) => (current === orderId ? null : orderId));
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrderId() === orderId;
  }

  getStatusConfig(
    paymentMethod: string,
    isPaid: boolean,
    isDelivered: boolean,
  ): { label: string; classes: string; icon: string } {
    if (isDelivered) {
      return {
        label: 'Delivered',
        classes: 'bg-blue-100 text-blue-700',
        icon: 'fa-solid fa-check-double',
      };
    }
    if (isPaid) {
      return {
        label: 'Processing',
        classes: 'bg-emerald-100 text-emerald-700',
        icon: 'fa-solid fa-spinner',
      };
    }
    if (paymentMethod === 'cash') {
      return {
        label: 'Pending',
        classes: 'bg-orange-100 text-orange-700',
        icon: 'fa-solid fa-clock',
      };
    }
    return {
      label: 'Pending',
      classes: 'bg-gray-100 text-gray-600',
      icon: 'fa-solid fa-clock',
    };
  }

  getItemTotal(count: number, price: number): number {
    return count * price;
  }
}
