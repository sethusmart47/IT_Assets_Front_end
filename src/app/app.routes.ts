import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
 {path: '', component:HomeComponent },
  {path: 'add', component: AddEmployeeComponent },
  { path: 'view1', component: ViewEmployeeComponent }  // 👈 lowercase is standard
];
