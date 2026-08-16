import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category-component/category-component.component';
import { BrandComponentComponent } from './components/brand-component/brand-component.component';
import { ModelComponentComponent } from './components/model-component/model-component.component';

export const routes: Routes = [
 {path: '', component:HomeComponent },
  {path: 'add', component: AddEmployeeComponent },
  { path: 'view1', component: ViewEmployeeComponent } ,
   { path: 'view1/:empCode', component: ViewEmployeeComponent }  ,
   {path:'category', component: CategoryComponent},
   {path:'brand',component:BrandComponentComponent},
   {path:'model',component:ModelComponentComponent}
];
