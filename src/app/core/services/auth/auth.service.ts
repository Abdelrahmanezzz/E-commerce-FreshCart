import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MyPlatformService } from '../myPlatform/my-platform.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly myPlatformService = inject(MyPlatformService);

  isLoggedIn: WritableSignal<boolean> = signal(false);

  constructor() {
    if (this.myPlatformService.checkBrowser()) {
      this.checkLoggedIn();
    }
  }

  signIn(data: object): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v1/auth/signin`, data);
  }

  signUp(data: object): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v1/auth/signup`, data);
  }

  sendEmail(data: object): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  sendVerifyCode(data: object): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  sendNewPassword(data: object): Observable<any> {
    return this.http.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data);
  }

  userData() {
    if (this.myPlatformService.checkBrowser()) {
      return JSON.parse(localStorage.getItem('freshUser') || '{}');
    }
    return {};
  }

  checkLoggedIn(): void {
    if (localStorage.getItem('freshToken')) {
      this.isLoggedIn.set(true);
    } else {
      this.isLoggedIn.set(false);
    }
  }

  logout(): void {
    if (this.myPlatformService.checkBrowser()) {
      localStorage.removeItem('freshToken');
      localStorage.removeItem('freshUser');
    }
    this.isLoggedIn.set(false);
  }
}
