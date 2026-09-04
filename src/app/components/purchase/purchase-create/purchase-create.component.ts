
// components/purchase/purchase-create/purchase-create.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ConfirmationService } from '../../../Services/confirmation.service';
import { AttachmentHelperService } from '../../../Services/attachment-helper.service';
import { notInFutureValidator, purchaseDateOrderValidator } from '../../../utils/validators';

import { PurchasedItemModalComponent } from '../purchased-item-modal/purchased-item-modal.component';


import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';

@Component({
  selector: 'app-purchase-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule,
    PurchasedItemModalComponent,
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
    private toast: ToastService,
    private confirmService: ConfirmationService,
    public attachmentHelper: AttachmentHelperService
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
      purchaseDate: ['', [Validators.required, notInFutureValidator()]],
      invoiceNumber: ['', [Validators.required, Validators.maxLength(100)]],
      invoiceDate: ['', [Validators.required, notInFutureValidator()]],
      expectedDeliveryDate: ['', Validators.required],
      ownershipType: [1, Validators.required],
      remarks: ['']
    }, { validators: purchaseDateOrderValidator() });
  }

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
    const msg = `Are you sure you want to delete "${item.category} - ${item.brand} ${item.model}"?`;
    this.confirmService.confirmDanger('Delete Asset Item', msg, () => {
      this.itemService.delete(this.purchaseId!, item.id).subscribe({
        next: () => {
          this.toast.success('Item deleted successfully.');
          this.loadItems();
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to delete item.');
        }
      });
    });
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
    return this.attachmentHelper.isImage(att.contentType);
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
    this.attachmentHelper.onImageError(event);
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
    return this.attachmentHelper.getFileIcon(contentType);
  }

  formatFileSize(bytes: number): string {
    return this.attachmentHelper.formatFileSize(bytes);
  }


  // ─── COMPLETE ───

  goToView(): void {
    if (!this.purchaseId) return;
    this.router.navigate(['/purchases', this.purchaseId, 'view']);
  }

  goBack(): void {
    this.router.navigate(['/purchase']);
  }
}

