import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastContaineComponent } from './toast-containe.component';

describe('ToastContaineComponent', () => {
  let component: ToastContaineComponent;
  let fixture: ComponentFixture<ToastContaineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContaineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToastContaineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
