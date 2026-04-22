import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http: HttpClient = inject(HttpClient);
  getAllProducts(params?: any): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/api/v1/products`, { params });
  }

  getProductById(id: string) {
    return this.http.get<any>(`${environment.baseUrl}/api/v1/products/${id}`);
  }
}
