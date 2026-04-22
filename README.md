```markdown
# 🛒 FreshCart — E-Commerce Application

A full-featured e-commerce web application built with **Angular 21** featuring SSR, lazy loading, signals, and a modern UI powered by Tailwind CSS and Flowbite.

---

## 🚀 Live Demo

> https://freshcart-jvzc7z5pd-abdel-rahmanel-sayed1230162-4848s-projects.vercel.app*

---

## ✨ Features

- 🔐 **Authentication** — Register, Login, Forgot Password (with OTP verify + reset)
- 🛍️ **Shop** — Browse all products with search, filter, and pagination
- 📦 **Product Details** — Image gallery, ratings, related products
- 🗂️ **Categories & Brands** — Browse by category or brand
- 🛒 **Cart** — Add, remove, update quantity, clear cart
- ❤️ **Wishlist** — Save products for later
- 💳 **Checkout** — Cash on delivery or online payment via Stripe
- 📋 **Orders** — View full order history with expandable details
- 📱 **Fully Responsive** — Mobile-first design with Flowbite drawer
- ⚡ **SSR** — Server-side rendering with Angular Universal
- 🎨 **Modern UI** — Tailwind CSS + Flowbite + Exo font + skeleton loaders

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 21** | Frontend framework |
| **Angular SSR** | Server-side rendering |
| **Tailwind CSS v4** | Utility-first styling |
| **Flowbite** | UI components (navbar drawer, carousel) |
| **ngx-toastr** | Toast notifications |
| **RxJS** | Reactive HTTP calls |
| **Angular Signals** | Reactive state management |

---

## Project Structure

```
src/app/
├── core/
│   ├── directives/          # Custom directives (future)
│   ├── guards/              # Auth guard
│   ├── interceptors/        # JWT auth interceptor
│   ├── models/              # TypeScript interfaces
│   ├── pipes/               # Custom pipes (future)
│   └── services/            # All API services
│       ├── auth/
│       ├── brands/
│       ├── cart/
│       ├── categories/
│       ├── flowbite/
│       ├── myPlatform/
│       ├── order/
│       ├── products/
│       └── wishlist/
├── layouts/
│   ├── features/            # Page components
│   │   ├── address/         # Checkout page
│   │   ├── brands/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── forgot-password/
│   │   ├── home/
│   │   │   ├── deal-and-news/
│   │   │   ├── featured-categories/
│   │   │   ├── home-slider/
│   │   │   └── newsletter/
│   │   ├── login/
│   │   ├── not-found/
│   │   ├── orders/
│   │   ├── product-details/
│   │   ├── register/
│   │   ├── shop/
│   │   └── wishlist/
│   └── staticComponents/    # Navbar + Footer
│       ├── footer/
│       └── navbar/
└── shared/
    └── components/
        └── featured-products/
```
"# E-commerce-FreshCart" 
