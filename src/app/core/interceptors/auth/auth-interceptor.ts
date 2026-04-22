import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MyPlatformService } from '../../services/myPlatform/my-platform.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const myPlatformService = inject(MyPlatformService);

  if (myPlatformService.checkBrowser()) {
    const token = localStorage.getItem('freshToken');

    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('token', token),
      });
      return next(clonedReq);
    }
  }

  return next(req);
};
