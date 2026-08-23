import { TestBed } from '@angular/core/testing';

import { PurchaseAttachmentService } from './purchase-attachment.service';

describe('PurchaseAttachmentService', () => {
  let service: PurchaseAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
