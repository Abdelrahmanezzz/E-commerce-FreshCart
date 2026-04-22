import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly http = inject(HttpClient);

  getAllBrands(limit: number = 100): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/v1/brands?limit=${limit}`);
  }
}
