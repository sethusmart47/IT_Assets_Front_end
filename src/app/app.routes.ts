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

export const routes: Routes = [

   {path:'category', component: CategoryComponent},
   {path:'brand',component:BrandComponentComponent},
   { path: 'vendor', component: VendorComponent },
   {path:'model',component:ModelComponentComponent},
   {path:'purchase',component:PurchaseListComponent},
   {path:'purchases/create',component:PurchaseCreateComponent},
   {path:'purchases/:id/edit',component:PurchaseCreateComponent},
   {path:'asset/register',component:AssetRegisterComponent},
   {path:'asset/list',component:AssetListComponent},
   {path:'asset/detail/:id',component:AssetDetailComponent},
   {path:'asset/edit',component:AssetEditModalComponent}
];
