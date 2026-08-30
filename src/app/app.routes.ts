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

export const routes: Routes = [

   {path:'category', component: CategoryComponent},
   {path:'brand',component:BrandComponentComponent},
   { path: 'vendor', component: VendorComponent },
   {path:'model',component:ModelComponentComponent},
   {path:'purchase',component:PurchaseListComponent},
   {path:'purchases/create',component:PurchaseCreateComponent},
   {path:'purchases/:id/edit',component:PurchaseCreateComponent},
   {path:'purchases/:id/view',component:PurchaseViewComponent},
   {path:'purchases/:id/view',component:PurchaseViewComponent},
   {path:'asset/register',component:AssetRegisterComponent},
   {path:'asset/list',component:AssetListComponent},
   {path:'asset/detail/:id',component:AssetDetailComponent},
   
   {path:'asset/edit',component:AssetEditModalComponent},
   {path:'employee',component:EmployeeComponent},
   {path:'asset/assignment/:id',component:AssetAssignmentComponent},
   {path:'employee/detail/:id',component:EmployeeDetailComponent},
    {path:'service',component:ServiceRequestListComponent},
    {path:'create/service',component:ServiceRequestCreateComponent},
    {path:'service/request/:id',component:ServiceRequestDetailComponent}
  ];
// <div class="lifecycle-section" *ngIf="assetDetail.lifecycleHistories?.length > 0">
//       <h5>
//         <cds-icon shape="timeline" size="16"></cds-icon> Lifecycle History
//       </h5>
//       <div class="timeline">
//         <div class="timeline-item" *ngFor="let history of assetDetail.lifecycleHistories">
//           <div class="timeline-dot"
//                [class.registered]="history.action === 'Registered'"
//                [class.assigned]="history.action === 'Assigned'"
//                [class.returned]="history.action === 'Returned'">
//           </div>
//           <div class="timeline-content">
//             <div class="timeline-header">
//               <strong>{{ history.action }}</strong>
//               <span class="timeline-date">{{ history.performedDate | date:'dd-MMM-yyyy HH:mm' }}</span>
//             </div>
//             <div class="timeline-detail" *ngIf="history.employeeName">
//               Employee: {{ history.employeeName }} ({{ history.employeeEmail }})
//             </div>
//             <div class="timeline-detail" *ngIf="history.remarks">
//               {{ history.remarks }}
//             </div>
//             <div class="timeline-status">
//               {{ history.oldStatus || '-' }} → {{ history.newStatus }}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>