import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandComponentComponent } from './brand-component.component';

describe('BrandComponentComponent', () => {
  let component: BrandComponentComponent;
  let fixture: ComponentFixture<BrandComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
