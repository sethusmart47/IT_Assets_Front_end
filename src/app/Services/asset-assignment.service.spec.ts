import { TestBed } from '@angular/core/testing';

import { AssetAssignmentService } from './asset-assignment.service';

describe('AssetAssignmentService', () => {
  let service: AssetAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
