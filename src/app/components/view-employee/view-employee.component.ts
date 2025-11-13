import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { id } from '@cds/core/internal';
import { NgIf, NgFor } from '@angular/common';
import { ClrDatagridModule } from '@clr/angular';


@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [ClarityModule, FormsModule, CommonModule,NgIf, NgFor, ClrDatagridModule],
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
accessories1: any[] =[];
  newAccessory: any = {};
accessoryModalOpen:boolean=false;
  constructor(private api: ApiService) {}
openAccessoryModal() {
  this.editingAccessoryId = null;
  this.newAccessory = { accessoryType: '', accessoryName: '', serialNo: '', issueDate: '' };
  this.accessoryModalOpen = true;
}
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
        this.accessories1 = res.accessories; 
         console.log('this.employee', this.employee.accessories);
         console.log('accesseries',this.accessories1) // ✅ Check accessories
      },
      error: (err) => {
        console.error(err);
        alert('Employee not found!');
        this.employee = null;
      }
     
    });
  }
  

  addAccessory1() {
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
  console.log('Deleting accessory with id:', id);
  if (!id) {
    alert('Invalid accessory ID');
    return;
  }
  this.api.deleteAccessory(this.empCode, id).subscribe({
    next: () => {
      alert('Accessory deleted');
      this.fetchEmployee();
    },
    error: (err) => console.error('Delete error:', err)
  });
}


  // editAccessory(item: any) {
  //   const updatedName = prompt('Enter new name', item.accessoryName);
  //   if (updatedName) {
  //     const updated = { ...item, accessoryName: updatedName };
  //     this.api.updateAccessory(this.empCode, item.id, updated).subscribe({
  //       next: () => {
  //         alert('Accessory updated');
  //         this.fetchEmployee();
  //       },
  //       error: (err) => console.error(err)
  //     });
  //   }
  // }
  editingAccessoryId: number | null = null;
editAccessory(item: any) {
  // Step 1: Load data into form so user can edit
  this.newAccessory = {
      accessoryType: item.accessoryType,
      accessoryName: item.accessoryName,
      serialNo: item.serialNo,
      issueDate: item.issueDate
    };
  this.editingAccessoryId = item.id;
}

addAccessory() {
  // Step 2: Check if editing or adding
  if (this.editingAccessoryId) {
    const updated = { ...this.newAccessory, id: this.editingAccessoryId };
    this.api.updateAccessory(this.empCode, this.editingAccessoryId, updated).subscribe({
      next: () => {
        alert('Accessory updated');
        this.fetchEmployee();
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  } else {
    // Add new accessory
    this.api.addAccessory(this.empCode, this.newAccessory).subscribe({
      next: () => {
        alert('Accessory added');
        this.fetchEmployee();
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  }
}

resetForm() {
  this.newAccessory = {
    accessoryType: '',
    accessoryName: '',
    serialNo: '',
    issueDate: ''
  };
  this.editingAccessoryId = null;
}

}
