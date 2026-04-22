import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { OrderService } from '../../../core/services/order/order.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-address',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  readonly cartId = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  readonly addressForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    details: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.cartId.set(params.get('id') ?? '');
    });
  }

  addressSubmit(event: SubmitEvent): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.toastrService.warning('Please fill in all required fields', 'FreshCart');
      return;
    }

    const submitter = (event.submitter as HTMLButtonElement).value;
    this.isLoading.set(true);

    if (submitter === 'cash') {
      this.orderService.createCashOrder(this.cartId(), this.addressForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.cartService.numOfCartItems.set(0);
          this.toastrService.success('Order placed successfully!', 'FreshCart');
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastrService.error(err?.error?.message || 'Failed to place order', 'FreshCart');
        },
      });
    } else if (submitter === 'visa') {
      this.orderService.checkout(this.cartId(), this.addressForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          window.open(res.session.url, '_self');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastrService.error(err?.error?.message || 'Payment session failed', 'FreshCart');
        },
      });
    }
  }

  // helpers for template validation
  isInvalid(field: string): boolean {
    const control = this.addressForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
