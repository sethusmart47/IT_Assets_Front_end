import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule,HttpClientModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {
employee: any = {};
  accessory: any = {};

  constructor(private api:ApiService) {}

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

