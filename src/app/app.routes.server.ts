import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // static pages - prerender at build time (no API calls needed)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },
  { path: 'forgot-password', renderMode: RenderMode.Prerender },

  // dynamic pages - client side only (have API calls or auth)
  { path: 'shop', renderMode: RenderMode.Client },
  { path: 'categories', renderMode: RenderMode.Client },
  { path: 'brands', renderMode: RenderMode.Client },
  { path: 'cart', renderMode: RenderMode.Client },
  { path: 'wishlist', renderMode: RenderMode.Client },
  { path: 'orders', renderMode: RenderMode.Client },
  { path: 'checkout/:id', renderMode: RenderMode.Client },
  { path: 'product/:id', renderMode: RenderMode.Client },

  // fallback
  { path: '**', renderMode: RenderMode.Client },
];
