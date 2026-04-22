import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductsService } from '../../../core/services/products/products.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { AuthService } from '../../../core/services/auth/auth.service';

import { IProduct } from '../../../core/models/i-product.interface';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);

  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());

  readonly product = signal<IProduct | null>(null);
  readonly relatedProducts = signal<IProduct[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedImage = signal<string>('');

  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProduct(id);
      }
    });
  }

  getProduct(id: string): void {
    this.isLoading.set(true);

    this.productsService.getProductById(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.selectedImage.set(res.data.imageCover);
        this.getRelatedProducts(res.data.category._id);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastrService.error(err?.error?.message || 'Failed to load product', 'FreshCart');
      },
    });
  }

  getRelatedProducts(categoryId: string): void {
    this.productsService.getAllProducts({ 'category[in]': categoryId, limit: 6 }).subscribe({
      next: (res) => {
        const currentId = this.product()?._id;
        const filtered = (res?.data || []).filter((p: IProduct) => p._id !== currentId);
        this.relatedProducts.set(filtered);
      },
    });
  }

  changeImage(img: string): void {
    this.selectedImage.set(img);
  }

  addToCartAction(): void {
    if (!this.isLoggedIn()) {
      this.toastrService.warning('Please sign in first', 'FreshCart');
      return;
    }

    const id = this.product()?._id;
    if (!id) return;

    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        this.toastrService.success(res?.message || 'Product added to cart', 'FreshCart');
        if (res?.numOfCartItems !== undefined) {
          this.cartService.numOfCartItems.set(res.numOfCartItems);
        }
      },
      error: (err) => {
        this.toastrService.error(err?.error?.message || 'Something went wrong', 'FreshCart');
      },
    });
  }

  addToWishlistAction(): void {
    if (!this.isLoggedIn()) {
      this.toastrService.warning('Please sign in first', 'FreshCart');
      return;
    }

    const id = this.product()?._id;
    if (!id) return;

    this.wishlistService.addToWishlist(id).subscribe({
      next: (res) => {
        this.toastrService.success(res?.message || 'Product added to wishlist', 'FreshCart');
      },
      error: (err) => {
        this.toastrService.error(err?.error?.message || 'Something went wrong', 'FreshCart');
      },
    });
  }

  addRelatedToCart(productId: string): void {
    if (!this.isLoggedIn()) {
      this.toastrService.warning('Please sign in first', 'FreshCart');
      return;
    }

    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.toastrService.success(res?.message || 'Product added to cart', 'FreshCart');
        if (res?.numOfCartItems !== undefined) {
          this.cartService.numOfCartItems.set(res.numOfCartItems);
        }
      },
      error: (err) => {
        this.toastrService.error(err?.error?.message || 'Something went wrong', 'FreshCart');
      },
    });
  }

  getStarClass(rating: number, star: number): string {
    return star <= Math.floor(rating || 0) ? 'fas fa-star' : 'far fa-star text-gray-300';
  }
}
