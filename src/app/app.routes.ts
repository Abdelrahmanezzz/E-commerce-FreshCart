import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./layouts/features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./layouts/features/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./layouts/features/categories/categories.component').then(
        (m) => m.CategoriesComponent,
      ),
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./layouts/features/brands/brands.component').then((m) => m.BrandsComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./layouts/features/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/features/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'checkout/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/features/address/address.component').then((m) => m.AddressComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./layouts/features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./layouts/features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./layouts/features/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./layouts/features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
