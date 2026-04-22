import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlowbiteService } from '../../../../core/services/flowbite/flowbite.service';

@Component({
  selector: 'app-home-slider',
  imports: [RouterLink],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
})
export class HomeSliderComponent implements AfterViewInit {
  private readonly flowbiteService = inject(FlowbiteService);

  readonly slides = [
    {
      title: 'Fresh Products Delivered to your Door',
      subtitle: 'Get 20% off your first order',
      badge: '🎉 Limited Time Offer',
      btnText: 'Shop Now',
      btnLink: '/shop',
    },
    {
      title: 'Discover Premium Brands at Best Prices',
      subtitle: 'Free shipping on orders over 500 EGP',
      badge: '🚚 Free Delivery',
      btnText: 'Browse Brands',
      btnLink: '/brands',
    },
    {
      title: 'Explore Hundreds of Categories',
      subtitle: 'Find everything you need in one place',
      badge: '🛍️ New Arrivals',
      btnText: 'View Categories',
      btnLink: '/categories',
    },
  ];

  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      flowbite.initFlowbite();
    });
  }
}
