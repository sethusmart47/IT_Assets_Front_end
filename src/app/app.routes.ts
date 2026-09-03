import { Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { CategoryComponent } from './components/category-component/category-component.component';
import { BrandComponentComponent } from './components/brand-component/brand-component.component';
import { ModelComponentComponent } from './components/model-component/model-component.component';
import { VendorComponent } from './components/vendor/vendor.component';
import { PurchaseListComponent } from './components/purchase/purchase-list/purchase-list.component';
import { PurchaseCreateComponent } from './components/purchase/purchase-create/purchase-create.component';
import { AssetRegisterComponent } from './components/asset inventory/asset-register/asset-register.component';
import { AssetListComponent } from './components/asset inventory/asset-list/asset-list.component';
import { AssetDetailComponent } from './components/asset inventory/asset-detail/asset-detail.component';
import { AssetEditModalComponent } from './components/asset inventory/asset-edit-modal/asset-edit-modal.component';
import { EmployeeComponent } from './components/Employee/employee/employee.component';
import { AssetAssignmentComponent } from './components/Employee/asset-assignment/asset-assignment.component';
import { EmployeeDetailComponent } from './components/Employee/employee-detail/employee-detail.component';
import { PurchaseViewComponent } from './components/purchase/purchase-view/purchase-view.component';
import { ServiceRequestListComponent } from './components/serviceRequest/service-request-list/service-request-list.component';
import { ServiceRequestCreateComponent } from './components/serviceRequest/service-request-create/service-request-create.component';
import { ServiceRequestDetailComponent } from './components/serviceRequest/service-request-detail/service-request-detail.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'brand', component: BrandComponentComponent },
    { path: 'vendor', component: VendorComponent },
    { path: 'model', component: ModelComponentComponent },
    { path: 'purchase', component: PurchaseListComponent },
    { path: 'purchases/create', component: PurchaseCreateComponent },
    { path: 'purchases/:id/edit', component: PurchaseCreateComponent },
    { path: 'purchases/:id/view', component: PurchaseViewComponent },
    { path: 'asset/register', component: AssetRegisterComponent },
    { path: 'asset/list', component: AssetListComponent },
    { path: 'asset/detail/:id', component: AssetDetailComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'asset/assignment/:id', component: AssetAssignmentComponent },
    { path: 'employee/detail/:id', component: EmployeeDetailComponent },
    { path: 'service', component: ServiceRequestListComponent },
    { path: 'create/service', component: ServiceRequestCreateComponent },
    { path: 'service/request/:id', component: ServiceRequestDetailComponent },
    { path: '**', redirectTo: '' }
  ];
