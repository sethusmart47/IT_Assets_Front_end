import { Component } from '@angular/core';
import { Employee } from '../../../models/Employee';
import { Router } from '@angular/router';
import { AssetAssignmentService } from '../../../Services/asset-assignment.service';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../Services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
employees: Employee[] = [];
  loading = false;
  searchText = '';

  constructor(
    private assetAssignmentService: AssetAssignmentService,
    private router: Router,
    private employeeService:EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get filteredEmployees(): Employee[] {
    if (!this.searchText.trim()) return this.employees;
    const search = this.searchText.toLowerCase();
    return this.employees.filter(e =>
      e.employeeName.toLowerCase().includes(search) ||
      e.email.toLowerCase().includes(search) ||
      e.department.toLowerCase().includes(search) ||
      e.designation.toLowerCase().includes(search)
    );
  }

  onViewEmployee(employee: Employee): void {
    
    this.router.navigate(['/employee/detail',employee.id]);
  }
}
