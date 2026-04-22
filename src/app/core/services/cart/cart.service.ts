import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);

  numOfCartItems = signal<number>(0);

  addToCart(pId: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v2/cart`, {
      productId: pId,
    });
  }

  getUserCart(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/v2/cart`);
  }

  removeFromCart(pId: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/v2/cart/${pId}`);
  }

  updateQuantity(pId: string, count: number): Observable<any> {
    return this.http.put(`${environment.baseUrl}/api/v2/cart/${pId}`, {
      count,
    });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/v2/cart`);
  }
}
