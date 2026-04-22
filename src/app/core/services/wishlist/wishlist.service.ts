import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly http = inject(HttpClient);

  getUserWishlist(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId,
    });
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/v1/wishlist/${productId}`);
  }
}
