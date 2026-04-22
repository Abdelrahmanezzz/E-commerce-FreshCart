import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyPlatformService {
  private readonly platformId = inject(PLATFORM_ID);

  checkBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
