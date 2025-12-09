import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { webSockeHandleResolver } from './web-socke-handle.resolver';

describe('webSockeHandleResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => webSockeHandleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
