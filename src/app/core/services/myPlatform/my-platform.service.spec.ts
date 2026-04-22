import { TestBed } from '@angular/core/testing';

import { MyPlatformService } from './my-platform.service';

describe('MyPlatformService', () => {
  let service: MyPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
