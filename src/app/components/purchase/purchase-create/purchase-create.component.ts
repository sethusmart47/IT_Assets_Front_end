
// components/purchase/purchase-create/purchase-create.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { PurchaseAttachmentDto, PurchaseDetailDto, PurchasedItemDto } from '../../../models/purchase';
import { Vendor } from '../../../models/model';
import { OWNERSHIP_TYPES } from '../../../enums/enum';

import { PurchaseService } from '../../../Services/purchase.service';
import { PurchasedItemService } from '../../../Services/purchased-item.service';
import { PurchaseAttachmentService } from '../../../Services/purchase-attachment.service';
import { VendorService } from '../../../Services/vendor.service';
import { ToastService } from '../../../Services/toast.service';

import { PurchasedItemModalComponent } from '../purchased-item-modal/purchased-item-modal.component';
import { ConfirmDialogComponentComponent } from '../../Delete confirm-dialog-component/confirm-dialog-component.component';


import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';

@Component({
  selector: 'app-purchase-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule,
    PurchasedItemModalComponent,
    ConfirmDialogComponentComponent,
    ImagePreviewModalComponent
  ],
  templateUrl: './purchase-create.component.html',
  styleUrl: './purchase-create.component.css'
})
export class PurchaseCreateComponent implements OnInit {

  purchaseForm!: FormGroup;
  isEditMode = false;
  purchaseId: string | null = null;
  purchaseNumber = '';
  purchaseDetail: PurchaseDetailDto | null = null;
  isLoading = false;

  // Dropdowns
  vendors: Vendor[] = [];
  ownershipTypes = OWNERSHIP_TYPES;

  // Delete confirmation
  isDeleteOpen = false;
  deleteItemRef: PurchasedItemDto | null = null;
  deleting = false;

  // Items
  items: PurchasedItemDto[] = [];
  itemModalOpen = false;
  editingItem: PurchasedItemDto | null = null;

  // Attachments
  attachments: PurchaseAttachmentDto[] = [];
  isDragOver = false;
  uploading = false;

  // Image preview
  previewImageUrl: string | null = null;
  isPreviewOpen = false;

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
    public attachmentService: PurchaseAttachmentService,
    private vendorService: VendorService,
    private toast: ToastService
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
    const todayStr = new Date().toISOString().slice(0, 10);
    this.purchaseForm = this.fb.group({
      vendorId: [null, Validators.required],
      purchaseDate: ['', [Validators.required, this.notInFutureValidator]],
      invoiceNumber: ['', [Validators.required, Validators.maxLength(100)]],
      invoiceDate: ['', [Validators.required, this.notInFutureValidator]],
      expectedDeliveryDate: ['', Validators.required],
      ownershipType: [1, Validators.required],
      remarks: ['']
    }, { validators: this.purchaseDateOrderValidator });
  }

  private notInFutureValidator = (c: AbstractControl): ValidationErrors | null => {
    if (!c.value) return null;
    const v = new Date(c.value); const t = new Date(); t.setHours(0,0,0,0);
    return v > t ? { futureDate: true } : null;
  };

  private purchaseDateOrderValidator = (g: AbstractControl): ValidationErrors | null => {
    const purchase = g.get('purchaseDate')?.value;
    const invoice = g.get('invoiceDate')?.value;
    const delivery = g.get('expectedDeliveryDate')?.value;
    if (!purchase || !invoice || !delivery) return null;
    const p = new Date(purchase), i = new Date(invoice), d = new Date(delivery);
    if (i < p) return { invoiceBeforePurchase: true };
    if (d < i) return { deliveryBeforeInvoice: true };
    return null;
  };

  loadVendors(): void {
    this.isLoading = true;
    this.vendorService.getAll().subscribe({
      next: (data) => {
        this.vendors = data;
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load vendors.');
        this.isLoading = false;
      }
    });
  }

  private loadNextPurchaseNumber(): void {
    this.purchaseService.getNextNumber().subscribe({
      next: (res) => this.purchaseNumber = res.purchaseNumber,
      error: () => this.toast.error('Failed to generate PO number.')
    });
  }

  private loadPurchaseDetail(id: string): void {
    this.isLoading = true;
    this.purchaseService.getById(id).subscribe({
      next: (data) => {
        this.purchaseDetail = data;
        this.purchaseNumber = data.purchaseNumber;
        this.items = data.items || [];
        this.attachments = data.attachments || [];
        this.calculateTotals();
        this.patchForm(data);
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load purchase details.');
        this.isLoading = false;
      }
    });
  }

  private patchForm(data: PurchaseDetailDto): void {
    this.purchaseForm.patchValue({
      vendorId: data.vendorId,
      purchaseDate: this.formatDateForInput(data.purchaseDate),
      invoiceNumber: data.invoiceNumber,
      invoiceDate: this.formatDateForInput(data.invoiceDate),
      expectedDeliveryDate: this.formatDateForInput(data.expectedDeliveryDate),
      ownershipType: data.ownershipType,
      remarks: data.remarks || ''
    });
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  }

  private calculateTotals(): void {
    this.totalAmount = this.items.reduce((sum, i) => sum + (i.subTotal || 0), 0);
    this.totalUnits = this.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  }

  // ─── SAVE / UPDATE ───

  savePurchase(): void {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      this.toast.warning('Please fill all required fields.');
      return;
    }

    this.saving = true;
    const formValue = this.purchaseForm.value;

    if (this.isEditMode && this.purchaseId) {
      this.purchaseService.update(this.purchaseId, formValue).subscribe({
        next: (res) => {
          this.saving = false;
          this.purchaseDetail = res;
          this.toast.success('Purchase updated successfully!');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error(err.error?.message || err.error || 'Failed to update purchase.');
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
          this.router.navigate(['/purchases', res.id, 'edit'], { replaceUrl: true });
          this.toast.success('Purchase created! Now add items and attachments below.');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error(err.error?.message || err.error || 'Failed to create purchase.');
        }
      });
    }
  }

  // ─── ITEM CRUD ───

  openAddItemModal(): void {
    this.editingItem = null;
    this.itemModalOpen = true;
  }

  openEditItemModal(item: PurchasedItemDto): void {
    this.editingItem = { ...item };
    this.itemModalOpen = true;
  }

  onItemSaved(item: PurchasedItemDto): void {
    this.itemModalOpen = false;
    this.editingItem = null;
    this.loadItems();
  }

  onItemModalClosed(): void {
    this.itemModalOpen = false;
    this.editingItem = null;
  }

  deleteItem(item: PurchasedItemDto): void {
    this.deleteItemRef = item;
    this.isDeleteOpen = true;
  }

  get deleteConfirmMessage(): string {
    if (!this.deleteItemRef) return '';
    return `Are you sure you want to delete "${this.deleteItemRef.category} - ${this.deleteItemRef.brand} ${this.deleteItemRef.model}"?`;
  }

  confirmDelete(): void {
    if (!this.deleteItemRef) return;
    this.deleting = true;

    this.itemService.delete(this.purchaseId!, this.deleteItemRef.id).subscribe({
      next: () => {
        this.toast.success('Item deleted successfully.');
        this.isDeleteOpen = false;
        this.deleting = false;
        this.deleteItemRef = null;
        this.loadItems();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to delete item.');
        this.deleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.isDeleteOpen = false;
    this.deleteItemRef = null;
  }

  private loadItems(): void {
    if (!this.purchaseId) return;
    this.itemService.getAll(this.purchaseId).subscribe({
      next: (data) => {
        this.items = data;
        this.calculateTotals();
      },
      error: () => this.toast.error('Failed to reload items.')
    });
  }

  // ─── ATTACHMENTS ───

  // ─── REPLACE these methods in purchase-create.component.ts ───

  // ──────────────────────────────────────────────
  // DRAG & DROP + FILE SELECT (keep as-is)
  // ──────────────────────────────────────────────

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
    if (!this.purchaseId) {
      this.toast.warning('Please save the purchase first.');
      return;
    }

    const maxSize = 25 * 1024 * 1024;
    const oversized = files.filter(f => f.size > maxSize);
    if (oversized.length > 0) {
      this.toast.error(`Files exceed 25MB: ${oversized.map(f => f.name).join(', ')}`);
      return;
    }

    this.uploading = true;
    this.attachmentService.upload(this.purchaseId, files).subscribe({
      next: (uploaded) => {
        this.attachments = [...this.attachments, ...uploaded];
        this.uploading = false;
        this.toast.success(`${uploaded.length} file(s) uploaded.`);
      },
      error: (err) => {
        this.uploading = false;
        this.toast.error(err.error?.message || 'Upload failed.');
      }
    });
  }

  // ──────────────────────────────────────────────
  // ✅ FIX 1: Use getPreviewUrl instead of getDownloadUrl
  // OLD: return this.attachmentService.getDownloadUrl(...)  ← forces download, <img> won't render
  // NEW: return this.attachmentService.getPreviewUrl(...)   ← returns inline, <img> renders it
  // ──────────────────────────────────────────────

  isImageAttachment(att: PurchaseAttachmentDto): boolean {
    if (!att.contentType) return false;
    return att.contentType.startsWith('image/');
  }

  // ✅ FIXED — was getDownloadUrl, now getPreviewUrl
  getThumbnailUrl(att: PurchaseAttachmentDto): string {
    return this.attachmentService.getPreviewUrl(this.purchaseId!, att.id);
  }

  // ✅ FIXED — preview modal uses getPreviewUrl, non-images use getDownloadUrl
  viewAttachment(att: PurchaseAttachmentDto): void {
    if (this.isImageAttachment(att)) {
      // Image → open in preview modal (uses /preview endpoint)
      this.previewImageUrl = this.attachmentService.getPreviewUrl(this.purchaseId!, att.id);
      this.isPreviewOpen = true;
    } else {
      // PDF/other → open in new tab (uses /download endpoint)
      const url = this.attachmentService.getDownloadUrl(this.purchaseId!, att.id);
      window.open(url, '_blank');
    }
  }

  // ✅ NEW — fallback when image fails to load
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-preview.png';
    img.alt = 'Image not available';
  }

  closePreview(): void {
    this.isPreviewOpen = false;
    this.previewImageUrl = null;
  }

  // ──────────────────────────────────────────────
  // DELETE (keep as-is)
  // ──────────────────────────────────────────────

  deleteAttachment(att: PurchaseAttachmentDto): void {
    this.attachmentService.delete(att.id).subscribe({
      next: () => {
        this.attachments = this.attachments.filter(a => a.id !== att.id);
        this.toast.success('Attachment removed.');
      },
      error: () => this.toast.error('Failed to remove attachment.')
    });
  }

  getFileIcon(contentType: string): string {
    if (!contentType) return 'document';
    if (contentType.includes('pdf')) return 'file';
    if (contentType.startsWith('image/')) return 'image';
    return 'document';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }


  // ─── COMPLETE ───

  completePurchase(): void {
    if (!this.purchaseId) return;
    if (this.items.length === 0) {
      this.toast.warning('Add at least one item before completing.');
      return;
    }

    this.purchaseService.complete(this.purchaseId).subscribe({
      next: () => {
        this.toast.success('Purchase completed & assets received!');
        this.router.navigate(['/purchases', this.purchaseId, 'view']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to complete purchase.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/purchase']);
  }
}

