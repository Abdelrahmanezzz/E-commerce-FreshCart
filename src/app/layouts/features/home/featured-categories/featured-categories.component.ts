import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CategoryService } from '../../../../core/services/categories/category.service';
import { ICategory } from '../../../../core/models/i-category.interface';

@Component({
  selector: 'app-featured-categories',
  imports: [RouterLink],
  templateUrl: './featured-categories.component.html',
  styleUrl: './featured-categories.component.css',
})
export class FeaturedCategoriesComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categoryList = signal<ICategory[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly skeletonCards = Array.from({ length: 6 });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.categoryList.set(res.data ?? []);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Failed to load categories.');
          this.isLoading.set(false);
        },
      });
  }
}
