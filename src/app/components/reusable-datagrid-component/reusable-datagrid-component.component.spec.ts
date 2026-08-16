import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDatagridComponentComponent } from './reusable-datagrid-component.component';

describe('ReusableDatagridComponentComponent', () => {
  let component: ReusableDatagridComponentComponent;
  let fixture: ComponentFixture<ReusableDatagridComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDatagridComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReusableDatagridComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
