import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAssignmentComponent } from './asset-assignment.component';

describe('AssetAssignmentComponent', () => {
  let component: AssetAssignmentComponent;
  let fixture: ComponentFixture<AssetAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
