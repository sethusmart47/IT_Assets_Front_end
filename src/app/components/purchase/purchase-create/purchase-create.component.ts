import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { PurchaseAttachmentDto, PurchaseDetailDto, PurchasedItemDto, PurchaseListDto, VendorDto } from '../../../models/purchase';
import { OWNERSHIP_TYPES } from '../../../enums/enum';
import { PurchaseAttachmentService } from '../../../Services/purchase-attachment.service';
import { PurchasedItemService } from '../../../Services/purchased-item.service';
import { PurchaseService } from '../../../Services/purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../../Services/vendor.service';
import { Vendor } from '../../../models/model';
import { PurchasedItemModalComponent } from '../purchased-item-modal/purchased-item-modal.component';
import { ConfirmDialogComponentComponent } from '../../confirm-dialog-component/confirm-dialog-component.component';

@Component({
  selector: 'app-purchase-create',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,PurchasedItemModalComponent,
    FormsModule,ClarityModule,ConfirmDialogComponentComponent],  
  templateUrl: './purchase-create.component.html',
  styleUrl: './purchase-create.component.css'
})
export class PurchaseCreateComponent {

purchaseForm!: FormGroup;
  isEditMode = false;
  purchaseId: string | null = null;
  purchaseNumber = '';
  purchaseDetail: PurchaseDetailDto | null = null;
  isLoading = false;
  // Dropdowns
  vendors: Vendor[] = [];
  ownershipTypes = OWNERSHIP_TYPES;

  isDeleteOpen: boolean = false;
     deleteItemRef: PurchasedItemDto | null = null;
  deleting: boolean = false;
  // Items
  items: PurchasedItemDto[] = [];
  itemModalOpen = false;
  editingItem: PurchasedItemDto | null = null;
uploadedImage: File | null = null;
uploadedImageUrl: string | null = null;
  // Attachments
  attachments: PurchaseAttachmentDto[] = [];
  isDragOver = false;
  uploading = false;

  // State
  saving = false;
  totalAmount = 0;
  totalUnits = 0;

    constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    private itemService: PurchasedItemService,
    public  attachmentService: PurchaseAttachmentService,
    private vendorService: VendorService
  ) {}   
  
   ngOnInit(): void {
    this.initForm();
    this.loadVendors();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.purchaseId = id;
      this.loadPurchaseDetail(id);
    } else {
      this.loadNextPurchaseNumber();
    }
  }

  private initForm(): void {
    this.purchaseForm = this.fb.group({
      vendorId: [null, Validators.required],
      purchaseDate: ['', Validators.required],
      invoiceNumber: ['', [Validators.required, Validators.maxLength(100)]],
      invoiceDate: ['', Validators.required],
      expectedDeliveryDate: ['', Validators.required],
      ownershipType: [1, Validators.required],
      remarks: ['']
    });
  }

  loadVendors(): void {
    this.isLoading = true;
    this.vendorService.getAll().subscribe({
      next: (data) => {
        this.vendors = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load vendors:', err);
        this.isLoading = false;
      }
    });
  }
   private loadNextPurchaseNumber(): void {
    this.purchaseService.getNextNumber().subscribe({
      next: (res) => this.purchaseNumber = res.purchaseNumber
    });
  }
   private loadPurchaseDetail(id: string): void {
    this.purchaseService.getById(id).subscribe({
      next: (data) => {
        this.purchaseDetail = data;
        this.purchaseNumber = data.purchaseNumber;
        this.items = data.items;
        this.attachments = data.attachments;
        this.calculateTotals();

        // Patch form
        this.purchaseForm.patchValue({
          vendorId: data.vendorId,
          purchaseDate: data.purchaseDate,
          invoiceNumber: data.invoiceNumber,
          invoiceDate: data.invoiceDate,
          expectedDeliveryDate: data.expectedDeliveryDate,
          ownershipType: data.ownershipType,
          remarks: data.remarks || ''
        });
      }
    });
  }
  
  private calculateTotals(): void {
    this.totalAmount = this.items.reduce((sum, i) => sum + i.subTotal, 0);
    this.totalUnits = this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

savePurchase(): void {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.purchaseForm.value;

    if (this.isEditMode && this.purchaseId) {
      this.purchaseService.update(this.purchaseId, formValue).subscribe({
        next: (res) => {
          this.saving = false;
          this.purchaseDetail = res;
          alert('Purchase updated successfully!');
        },
        error: (err) => {
          this.saving = false;
          alert(err.error || 'Failed to update purchase.');
        }
      });
    } else {
      this.purchaseService.create(formValue).subscribe({
        next: (res) => {
          this.saving = false;
          this.isEditMode = true;
          this.purchaseId = res.id;
          this.purchaseNumber = res.purchaseNumber;
          this.purchaseDetail = res;
          // Navigate to edit mode URL
          this.router.navigate(['/purchases', res.id, 'edit'], { replaceUrl: true });
          alert('Purchase created successfully! Now add items below.');
        },
        error: (err) => {
          this.saving = false;
          alert(err.error || 'Failed to create purchase.');
        }
      });
    }
  }
 openAddItemModal(): void {
    this.editingItem = null;
    this.itemModalOpen = true;
  }

  openEditItemModal(item: PurchasedItemDto): void {
    this.editingItem = item;
    this.itemModalOpen = true;
  }

  onItemSaved(item: PurchasedItemDto): void {
    this.itemModalOpen = false;
    this.loadItems();
  }

  // deleteItem(item: PurchasedItemDto): void {
  //   if (!confirm(`Delete item "${item.category} - ${item.brand} ${item.model}"?`)) return;

  //   this.itemService.delete(this.purchaseId!, item.id).subscribe({
  //     next: () => this.loadItems()
  //   });
  // }
   deleteItem(item: PurchasedItemDto): void {
      this.deleteItemRef = item;
      this.isDeleteOpen = true;
    }
    confirmDelete(): void {
    if (!this.deleteItemRef) return;
    this.deleting = true;
 this.itemService.delete(this.purchaseId!,this.deleteItemRef.id).subscribe({
  //     next: () => this.loadItems()
      next: () => {
       // this.notification.success('Model deleted successfully.');
        this.isDeleteOpen = false;
        this.deleting = false;
        this.deleteItemRef = null;
        this.loadItems();
      },
      error: (err) => {
       // this.notification.error(err.error || 'Failed to delete model.');
        this.deleting = false;
      }
    });
  }

  private loadItems(): void {
    if (!this.purchaseId) return;
    this.itemService.getAll(this.purchaseId).subscribe({
      next: (data) => {
        this.items = data;
        this.calculateTotals();
      }
    });
  }

// ─── ATTACHMENTS ───

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFiles(Array.from(input.files));
    }
    input.value = '';
  }

  private uploadFiles(files: File[]): void {
    debugger
    if (!this.purchaseId) {
      alert('Please save the purchase first before uploading attachments.');
      return;
    }

    this.uploading = true;
    this.attachmentService.upload(this.purchaseId, files).subscribe({
      next: (uploaded) => {
        this.attachments = [...this.attachments, ...uploaded];
        this.uploading = false;
      },
      error: (err) => {
        this.uploading = false;
        alert(err.error || 'Failed to upload files.');
      }
    });
  }

  viewAttachment(attachment: PurchaseAttachmentDto): void {
    const url = this.attachmentService.getDownloadUrl(this.purchaseId!, attachment.id);
    window.open(url, '_blank');
  }

  deleteAttachment(attachment: PurchaseAttachmentDto): void {
    if (!confirm(`Delete file "${attachment.fileName}"?`)) return;

    this.attachmentService.delete(this.purchaseId!, attachment.id).subscribe({
      next: () => {
        this.attachments = this.attachments.filter(a => a.id !== attachment.id);
      }
    });
  }

  getFileIcon(contentType: string): string {
    if (contentType.includes('pdf')) return 'file';
    if (contentType.includes('image')) return 'image';
    return 'document';
  }

  getFileIconClass(contentType: string): string {
    if (contentType.includes('pdf')) return 'file-icon-pdf';
    if (contentType.includes('image')) return 'file-icon-image';
    return 'file-icon-default';
  }

  // ─── COMPLETE ───

  completePurchase(): void {
    if (!this.purchaseId) return;
    if (!confirm('Mark this purchase as completed? This confirms all items are received.')) return;

    this.purchaseService.complete(this.purchaseId).subscribe({
      next: () => {
        alert('Purchase completed successfully!');
        //this.router.navigate(['/purchases']);
      },
      error: (err) => {
        alert(err.error || 'Failed to complete purchase.');
      }
    });
  }
 
  cancelDelete(): void {
    this.isDeleteOpen = false;
    this.deleteItemRef = null;
  }
  goBack(): void {
    this.router.navigate(['/purchases']);
  }
}