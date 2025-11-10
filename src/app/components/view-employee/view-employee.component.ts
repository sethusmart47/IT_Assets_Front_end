import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { id } from '@cds/core/internal';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [ClarityModule, FormsModule, CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent {
  empCode = '';
 employee: any = {
  empCode: '',
  empName: '',
  empMail: '',
  accessories: []  // ✅ make it an array
};
  newAccessory: any = {};

  constructor(private api: ApiService) {}

  fetchEmployee() {
    debugger
    if (!this.empCode.trim()) {
      alert('Please enter an employee code');
      return;
    }

    this.api.getEmployeeByEmpCode(this.empCode).subscribe({
      next: (res) => {
        console.log('Employee fetched:', res); // ✅ Check in console
        this.employee = res;
         console.log('this.employee', this.employee.accessories); // ✅ Check accessories
      },
      error: (err) => {
        console.error(err);
        alert('Employee not found!');
        this.employee = null;
      }
     
    });
  }

  addAccessory() {
    this.api.addAccessory(this.empCode, this.newAccessory).subscribe({
      next: () => {
        alert('Accessory added!');
        this.fetchEmployee();
        this.newAccessory = {};
      },
      error: (err) => console.error(err)
    });
  }

  deleteAccessory(id: number) {
    this.api.deleteAccessory(this.empCode, id).subscribe({
      next: () => {
        alert('Accessory deleted');
        this.fetchEmployee();
      },
      error: (err) => console.error(err)
    });
  }

  editAccessory(item: any) {
    const updatedName = prompt('Enter new name', item.accessoryName);
    if (updatedName) {
      const updated = { ...item, accessoryName: updatedName };
      this.api.updateAccessory(this.empCode, item.id, updated).subscribe({
        next: () => {
          alert('Accessory updated');
          this.fetchEmployee();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
