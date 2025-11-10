import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
 
  {path: 'add', component: AddEmployeeComponent },
  { path: 'view1', component: ViewEmployeeComponent }  // 👈 lowercase is standard
];
