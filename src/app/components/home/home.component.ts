import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ClarityModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  employees: any[] = [];
  searchCode: string = "";
constructor(private router:Router,private api:ApiService){}
ngOnInit(): void {
  this.loadEmployees();
}
viewEmployee(emp: any) {
  debugger
  // Example 1: Navigate to detailed page
  this.router.navigate(['/view1', emp.empCode]);}
loadEmployees() {
  this.api.getAllEmployees().subscribe({
    next: (res) => {
      this.employees = res;
      console.log(this.employees);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
  add() {
    this.router.navigate(['add']);
  }

  view() {
    this.router.navigate(['/view1']); // matches lowercase route
  }

  searchEmployee() {
  if (!this.searchCode.trim()) {
    alert("Please enter employee code");
    return;
  }

  this.api.getEmployeeByEmpCode(this.searchCode).subscribe({
    next: (res) => {
      this.employees = [res]; // show only searched result
    },
    error: () => {
      this.employees = [];
      alert("Employee not found");
    }
  });
  }}