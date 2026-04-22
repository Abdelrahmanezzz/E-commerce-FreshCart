import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);

  checkout(cartId: string, shippingAddress: object): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${environment.currentServer}`,
      { shippingAddress },
    );
  }

  createCashOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v2/orders/${cartId}`, { shippingAddress });
  }

  getAllUserOrders(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`);
  }
}
