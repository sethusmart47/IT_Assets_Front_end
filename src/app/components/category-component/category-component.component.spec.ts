import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponentComponent } from './category-component.component';

describe('CategoryComponentComponent', () => {
  let component: CategoryComponentComponent;
  let fixture: ComponentFixture<CategoryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
