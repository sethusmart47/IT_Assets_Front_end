import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedItemModalComponent } from './purchased-item-modal.component';

describe('PurchasedItemModalComponent', () => {
  let component: PurchasedItemModalComponent;
  let fixture: ComponentFixture<PurchasedItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedItemModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasedItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
