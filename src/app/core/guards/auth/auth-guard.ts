import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MyPlatformService } from '../../services/myPlatform/my-platform.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const myPlatformService = inject(MyPlatformService);

  if (myPlatformService.checkBrowser()) {
    if (localStorage.getItem('freshToken')) {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
  }

  return true;
};
