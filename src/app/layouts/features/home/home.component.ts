import { Component } from '@angular/core';
import { HomeSliderComponent } from './home-slider/home-slider.component';
import { FeaturedCategoriesComponent } from './featured-categories/featured-categories.component';
import { FeaturedProductsComponent } from '../../../shared/components/featured-products/featured-products.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { DealAndNewsComponent } from './deal-and-news/deal-and-news.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeSliderComponent,
    FeaturedCategoriesComponent,
    FeaturedProductsComponent,
    NewsletterComponent,
    DealAndNewsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
