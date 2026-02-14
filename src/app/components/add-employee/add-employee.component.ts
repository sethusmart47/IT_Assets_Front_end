import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ClarityModule } from '@clr/angular';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule,HttpClientModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit{
employee: any = {};
  accessory: any = {};

  constructor(private api:ApiService,private fb:FormBuilder) {}
EmployeeForm!:FormGroup
   
  ngOnInit(): void {
this.EmployeeForm=this.fb.group({
  empName:[''],
  empcode:[''],
  empEmail:[''],
  accessoryName:[''],
  serialNo:['']
})

  }
// isAccessoryValid() {
//   const a = this.accessory;

//   const type = a.accessoryType?.trim();
//   const name = a.accessoryName?.trim();
//   const serial = a.serialNo?.trim();
//   const date = a.issueDate?.trim();

//   // 1. Check if user filled at least one field
//   const anyFilled = type || name || serial || date;

//   if (!anyFilled) {
//     return true; // Accessory not used → OK
//   }

//   // 2. If ANY is filled → ALL must be filled
//   return (type && name && serial && date) ? true : false;
// }


  saveEmployee() {
    this.employee.accessories = [this.accessory];
    this.api.addEmployee(this.employee).subscribe({
      next: (res) => {
        alert('Employee added successfully!');
        this.employee = {};
        this.accessory = {};
      },
      error: (err) => alert('Error: ' + err.message)
    });
  }
}

