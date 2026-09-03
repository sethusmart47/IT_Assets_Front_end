import { Component } from '@angular/core';
import { Employee, EmployeeAssignment, ReturnAssetRequest, SurrenderAssetsRequest } from '../../../models/Employee';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetAssignmentService } from '../../../Services/asset-assignment.service';
import { ToastService } from '../../../Services/toast.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../../Services/confirmation.service';
import { EmployeeService } from '../../../Services/employee.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [ClarityModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent {
employeeId = '';
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  assignments: EmployeeAssignment[] = [];
  loading = false;
  assignmentsLoading = false;

  // Return Modal
  returnModalOpen = false;
  selectedAssignment: EmployeeAssignment | null = null;
  returnForm = new FormGroup({
    conditionAtReturn: new FormControl<number | null>(null, [Validators.required]),
    remarks: new FormControl<string | null>(null)
  });

  // Surrender Modal
  surrenderModalOpen = false;
  surrenderSelections: { assignment: EmployeeAssignment; conditionAtReturn: number; remarks: string }[] = [];

  // Conditions
  conditions = [
    { value: 1, label: 'New' },
    { value: 2, label: 'Good' },
    { value: 3, label: 'Fair' },
    { value: 4, label: 'poor' },
    { value: 5, label: 'Damaged' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetAssignmentService: AssetAssignmentService,
    private toaster: ToastService,
    private employeeservice:EmployeeService,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEmployeeData();
  }
loadEmployeeData(){
  this.loading = true;
  this.employeeservice.getEmployeeById(this.employeeId).subscribe({
    next:(emp)=>{
      this.selectedEmployee=emp;
      this.loading = false;
        if (this.selectedEmployee) {
          this.loadAssignments();
        }
    },
   error: () => {
        this.loading = false;
        this.toaster.error('Failed to load employee data.');
      }
  
  })
}
  // loadEmployeeData(): void {
  //   this.loading = true;
  //   this.assetAssignmentService.getAllEmployees().subscribe({
  //     next: (data) => {
  //       this.employees = data;
  //       this.selectedEmployee = data.find(e => e.id === this.employeeId) || null;
  //       this.loading = false;
  //       if (this.selectedEmployee) {
  //         this.loadAssignments();
  //       }
  //     },
  //     error: () => {
  //       this.loading = false;
  //       this.toaster.error('Failed to load employee data.');
  //     }
  //   });
  // }

  loadAssignments(): void {
    this.assignmentsLoading = true;
    this.assetAssignmentService.getAssignmentsByEmployee(this.employeeId).subscribe({
      next: (data) => {
        this.assignments = data;
        this.assignmentsLoading = false;
      },
      error: () => {
        this.assignmentsLoading = false;
        this.toaster.error('Failed to load assignments.');
      }
    });
  }

  // ─── Computed ──────────────────────────────────────────────────────────────────

  get activeAssignments(): EmployeeAssignment[] {
    return this.assignments.filter(a => !a.returnedDate);
  }

  get historyAssignments(): EmployeeAssignment[] {
    return this.assignments.filter(a => !!a.returnedDate);
  }

  // ─── Navigation ───────────────────────────────────────────────────────────────

  onAssignAsset(): void {
    this.router.navigate(['/asset/assignment', this.employeeId]);
  }

  onBackToList(): void {
    this.router.navigate(['/employee']);
  }

  // ─── Return Single Asset ───────────────────────────────────────────────────────

  onOpenReturnModal(assignment: EmployeeAssignment): void {
    this.selectedAssignment = assignment;
    this.returnForm.reset();
    this.returnModalOpen = true;
  }

  onConfirmReturn(): void {
    if (this.returnForm.invalid || !this.selectedAssignment) return;

    const request: ReturnAssetRequest = {
      conditionAtReturn: this.returnForm.value.conditionAtReturn!,
      remarks: this.returnForm.value.remarks || null
    };

    this.assetAssignmentService.returnAsset(this.selectedAssignment.assignmentId, request).subscribe({
      next: (result) => {
        this.toaster.success(`Asset '${result.assetTag}' returned successfully. New status: ${result.newStatus}`);
        this.returnModalOpen = false;
        this.selectedAssignment = null;
        this.loadAssignments();
        this.loadEmployeeData();
      },
      error: (err) => {
        this.toaster.error(err.error || 'Failed to return asset.');
      }
    });
  }

  // ─── Surrender All ─────────────────────────────────────────────────────────────

  onOpenSurrenderModal(): void {
    if (this.activeAssignments.length === 0) {
      this.toaster.warning('No active assets to surrender.');
      return;
    }

    this.surrenderSelections = this.activeAssignments.map(a => ({
      assignment: a,
      conditionAtReturn: 1,
      remarks: ''
    }));

    this.surrenderModalOpen = true;
  }

  onConfirmSurrender(): void {
    if (this.surrenderSelections.length === 0) return;

    const request: SurrenderAssetsRequest = {
      assets: this.surrenderSelections.map(s => ({
        assignmentId: s.assignment.assignmentId,
        conditionAtReturn: s.conditionAtReturn,
        remarks: s.remarks || null
      }))
    };

    this.confirmation.confirm(
      'Surrender All Assets',
      `Are you sure you want to surrender ${this.surrenderSelections.length} asset(s)? This action cannot be undone.`,
      () => {
        this.assetAssignmentService.surrenderAssets(this.employeeId, request).subscribe({
          next: (results) => {
            this.toaster.success(`${results.length} asset(s) surrendered successfully.`);
            this.surrenderModalOpen = false;
            this.loadAssignments();
            this.loadEmployeeData();
          },
          error: (err) => {
            this.toaster.error(err.error || 'Failed to surrender assets.');
          }
        });
      }
    );
  }
}
