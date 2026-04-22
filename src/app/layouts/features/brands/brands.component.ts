import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BrandService } from '../../../core/services/brands/brands.service';
import { IBrand } from '../../../core/models/i-brand.interface';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  private readonly brandService = inject(BrandService);
  private readonly toastrService = inject(ToastrService);

  readonly brands = signal<IBrand[]>([]);
  readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.isLoading.set(true);

    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.brands.set(res?.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastrService.error(err?.error?.message || 'Failed to load brands', 'FreshCart');
      },
    });
  }
}
