import { Component } from '@angular/core';
import { AssetDetail, AssignAssetRequest, Employee } from '../../../models/Employee';
import { ToastService } from '../../../Services/toast.service';
import { AssetAssignmentService } from '../../../Services/asset-assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../../Services/confirmation.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EmployeeService } from '../../../Services/employee.service';

@Component({
  selector: 'app-asset-assignment',
  standalone: true,
  imports: [ClarityModule,CommonModule,ReactiveFormsModule,ConfirmationDialogComponent],
  templateUrl: './asset-assignment.component.html',
  styleUrl: './asset-assignment.component.css'
})
export class AssetAssignmentComponent {
employeeId = '';
  employee: Employee | null = null;
  assetDetail: AssetDetail | null = null;
  searching = false;
  assigning = false;
  searchError = '';

  searchForm = new FormGroup({
    searchType: new FormControl<'serialNumber' | 'assetTag'>('serialNumber'),
    searchValue: new FormControl('', [Validators.required])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetAssignmentService: AssetAssignmentService,
    private toaster: ToastService,
    private confirmation: ConfirmationService,
    private employeeservice:EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEmployee();
  }
loadEmployee(){
  this.employeeservice.getEmployeeById(this.employeeId).subscribe({
    next:(emp)=>{
      this.employee=emp;
    },
    error:(err)=>{
this.toaster.error(err.error ||
'Employee not found.');
    }
  
  })
}
  // loadEmployee(): void {
  //   this.assetAssignmentService.getAllEmployees().subscribe({
  //     next: (employees) => {
  //       this.employee = employees.find(e => e.id === this.employeeId) || null;
  //       if (!this.employee) {
  //         this.toaster.error('Employee not found.');
  //         //this.router.navigate(['/asset-assignment']);
  //         console.log("cje",this.employee);
  //       }
  //     },
  //     error: () => {
  //       this.toaster.error('Failed to load employee.');
  //     }
  //   });
  // }

  // ─── Search Asset ──────────────────────────────────────────────────────────────

  onSearchAsset(): void {
    if (this.searchForm.invalid) return;

    const { searchType, searchValue } = this.searchForm.value;
    if (!searchValue?.trim()) {
      this.toaster.warning('Please enter a search value.');
      return;
    }

    this.searching = true;
    this.assetDetail = null;
    this.searchError = '';

    const serialNumber = searchType === 'serialNumber' ? searchValue.trim() : undefined;
    const assetTag = searchType === 'assetTag' ? searchValue.trim() : undefined;

    this.assetAssignmentService.searchAvailableAsset(serialNumber, assetTag).subscribe({
      next: (data) => {
        this.assetDetail = data;
        this.searching = false;
      },
      error: (err) => {
        this.searching = false;
        this.assetDetail = null;
        if (err.status === 404) {
          this.searchError = 'No available asset found matching the criteria.';
        } else {
          this.searchError = err.error || 'Failed to search asset.';
        }
      }
    });
  }

  onClearSearch(): void {
    this.searchForm.get('searchValue')?.reset();
    this.assetDetail = null;
    this.searchError = '';
  }

  // ─── Confirm Assignment ────────────────────────────────────────────────────────

  // onConfirmAssignment(): void {
  //   debugger
    
  // console.log('Assignment confirmation clicked');

  // if (!this.assetDetail) {
  //   console.log('assetDetail is missing');
  //   return;
  // }

  // if (!this.employee) {
  //   console.log('employee is missing');
  //   return;
  // }
  //   this.confirmation.confirm(
  //     'Confirm Assignment',
  //     `Assign "${this.assetDetail.assetTag}" (${this.assetDetail.serialNumber}) to "?`,
  //     () => {
  //       this.processAssignment();
  //     }
  //   );
  // }

  onConfirmAssignment(): void {
    debugger
    if (!this.assetDetail ) return;

    this.assigning = true;

    const request: AssignAssetRequest = {
      assetId: this.assetDetail.id,
      employeeId: this.employeeId
    };

    this.assetAssignmentService.assignAsset(request).subscribe({
      next: (result) => {
        this.assigning = false;
        this.toaster.success(
          `Asset "${result.assetTag}" assigned to "${result.employeeName}" successfully.`
        );
        this.router.navigate(['/asset-assignment', this.employeeId]);
      },
      error: (err) => {
        this.assigning = false;
        this.toaster.error(err.error || 'Failed to assign asset.');
      }
    });
  }

  // ─── Navigation ────────────────────────────────────────────────────────────────

  onCancel(): void {
    this.router.navigate(['/asset-assignment', this.employeeId]);
  }
}
