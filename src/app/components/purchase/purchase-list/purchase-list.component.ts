import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseDetailDto, PurchaseListDto } from '../../../models/purchase';
import { PURCHASE_STATUSES } from '../../../enums/enum';
import { PurchaseService } from '../../../Services/purchase.service';
import { Route, Router } from '@angular/router';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [ReactiveFormsModule,ClarityModule,CommonModule,FormsModule],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent {
purchases:PurchaseListDto[] = [];
 loading = true;
  totalRecords = 0;
  statuses = PURCHASE_STATUSES;
  selectedStatus: number | null = null;
  deleteConfirmOpen = false;
  completeConfirmOpen = false;
  selectedPurchase: PurchaseListDto | null = null;

constructor(private purchaseService:PurchaseService,private router:Router){}

ngOnInit(){
this.loadPurchase();
}
loadPurchase(){
  this.loading=true;
  const status=this.selectedStatus!==null ?this.selectedStatus:undefined
  this.purchaseService.getAll(status).subscribe(
    {
      next:(res)=>{
        this.purchases=res;
        this.totalRecords=res.length;
        this.loading=false;
      },
      error:()=>{
this.loading=false
      }
    }
  )
}
  getStatusClass(status: number): string {
    return status === 1 ? 'label-warning' : 'label-success';
  }

 onStatusFilterChange(): void {
    this.loadPurchase();
  }

    navigateToCreate() {
    this.router.navigate(['purchases/create']);
  }
  navigateToEdit(purchase: PurchaseListDto): void {
    this.router.navigate(['/purchases', purchase.id, 'edit']);
  }
}
