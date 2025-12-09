import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { websocketHandleGuard } from './websocket-handle.guard';

describe('websocketHandleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => websocketHandleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
