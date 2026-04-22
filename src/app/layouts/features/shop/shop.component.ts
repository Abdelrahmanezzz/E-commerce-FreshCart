import { Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { ProductsService } from '../../../core/services/products/products.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IProduct } from '../../../core/models/i-product.interface';

@Component({
  selector: 'app-shop',
  imports: [RouterLink, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  readonly products = signal<IProduct[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly addingToCartIds = signal<Set<string>>(new Set());

  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly keyword = signal('');
  readonly sortOption = signal('');
  readonly selectedCategory = signal<string | null>(null);

  readonly skeletonCards = Array.from({ length: 20 });
  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  private readonly searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.selectedCategory.set(params.get('category'));
      this.currentPage.set(1);
      this.getProducts();
    });

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentPage.set(1);
        this.getProducts();
      });
  }

  onSearchInput(value: string): void {
    this.keyword.set(value);
    this.searchSubject.next(value);
  }

  onSortChange(value: string): void {
    this.sortOption.set(value);
    this.currentPage.set(1);
    this.getProducts();
  }

  getProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const params: Record<string, any> = {
      page: this.currentPage(),
      limit: 20,
    };

    if (this.selectedCategory()) params['category'] = this.selectedCategory();
    if (this.keyword()) params['keyword'] = this.keyword();
    if (this.sortOption()) params['sort'] = this.sortOption();

    this.productsService
      .getAllProducts(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.products.set(res.data ?? []);
          this.totalPages.set(res.metadata?.numberOfPages ?? 1);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Failed to load products.');
          this.isLoading.set(false);
        },
      });
  }

  changePage(page: number): void {
    if (page === this.currentPage()) return;
    this.currentPage.set(page);
    this.getProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addProductToCart(productId: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.isLoggedIn()) {
      this.toastrService.info('Please sign in to add products to your cart.', 'FreshCart');
      return;
    }

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

  isAddingToCart(productId: string): boolean {
    return this.addingToCartIds().has(productId);
  }
}
