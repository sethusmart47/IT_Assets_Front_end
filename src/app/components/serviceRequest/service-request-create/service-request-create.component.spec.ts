import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestCreateComponent } from './service-request-create.component';

describe('ServiceRequestCreateComponent', () => {
  let component: ServiceRequestCreateComponent;
  let fixture: ComponentFixture<ServiceRequestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
