import { TestBed } from '@angular/core/testing';

import { ProductsProviderService } from './products-provider.service';

describe('ProductsProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsProviderService = TestBed.get(ProductsProviderService);
    expect(service).toBeTruthy();
  });
});
