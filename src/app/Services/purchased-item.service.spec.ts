import { TestBed } from '@angular/core/testing';

import { PurchasedItemService } from './purchased-item.service';

describe('PurchasedItemService', () => {
  let service: PurchasedItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasedItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
