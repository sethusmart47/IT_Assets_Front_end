import { Component } from '@angular/core';
import { PurchaseAttachmentDto, PurchaseDetailDto } from '../../../models/purchase';
import { ToastService } from '../../../Services/toast.service';
import { PurchaseAttachmentService } from '../../../Services/purchase-attachment.service';
import { AttachmentHelperService } from '../../../Services/attachment-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../../../Services/purchase.service';
import { ConfirmationService } from '../../../Services/confirmation.service';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchasedItemModalComponent } from '../purchased-item-modal/purchased-item-modal.component';
import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';

@Component({
  selector: 'app-purchase-view',
  standalone: true,
  imports: [  CommonModule,
      ReactiveFormsModule,
      ClarityModule,
      PurchasedItemModalComponent,
      ImagePreviewModalComponent],
  templateUrl: './purchase-view.component.html',
  styleUrl: './purchase-view.component.css'
})
export class PurchaseViewComponent {

 
  purchaseId!: string;
  purchase: PurchaseDetailDto | null = null;
  isLoading = true;
  loadError = false;

  totalAmount = 0;
  totalUnits = 0;

  isPreviewOpen = false;
  previewImageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    public attachmentService: PurchaseAttachmentService,
    private toast: ToastService,
    private confirmService: ConfirmationService,
    public attachmentHelper: AttachmentHelperService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toast.error('Purchase ID not found.');
      this.router.navigate(['/purchases']);
      return;
    }
    this.purchaseId = id;
    this.loadPurchase();
  }

  // ─── CHANGED FROM private → public so template can access ───
  loadPurchase(): void {
    this.isLoading = true;
    this.loadError = false;

    this.purchaseService.getById(this.purchaseId).subscribe({
      next: (data) => {
        this.purchase = data;
        this.calculateTotals();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load purchase details.');
        this.isLoading = false;
        this.loadError = true;
      }
    });
  }

  private calculateTotals(): void {
    if (!this.purchase?.items) return;
    this.totalAmount = this.purchase.items.reduce((sum, i) => sum + (i.subTotal || 0), 0);
    this.totalUnits = this.purchase.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  }

  get statusLabel(): string {
    if (!this.purchase) return '';
    switch (this.purchase.status) {
      case 1: return 'Ordered';
      case 2: return 'Confirmed';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  get statusClass(): string {
    if (!this.purchase) return '';
    switch (this.purchase.status) {
      case 1: return 'status-ordered';
      case 2: return 'status-confirmed';
      case 3: return 'status-cancelled';
      default: return 'status-ordered';
    }
  }

  get isConfirmed(): boolean {
    return this.purchase?.status === 2;
  }

  get isCancelled(): boolean {
    return this.purchase?.status === 3;
  }

  get canConfirm(): boolean {
    return !!this.purchase
      && this.purchase.status === 1
      && (this.purchase.items?.length || 0) > 0;
  }

  get canCancel(): boolean {
    return !!this.purchase && this.purchase.status === 1;
  }

  confirmReceive(): void {
    this.confirmService.confirm(
      'Confirm Purchase',
      'Are you sure you want to confirm this purchase? Items will become available for asset registration.',
      () => {
        this.purchaseService.confirm(this.purchaseId).subscribe({
          next: () => {
            this.toast.success('Purchase confirmed successfully! Items are now available for asset creation.');
            this.loadPurchase();
          },
          error: (err) => {
            this.toast.error(err.error?.message || 'Failed to confirm purchase.');
          }
        });
      }
    );
  }

  confirmCancelPurchase(): void {
    this.confirmService.open({
      title: 'Cancel Purchase',
      message: 'Are you sure you want to cancel this purchase? This action cannot be undone.',
      type: 'warning',
      confirmText: 'Cancel Purchase'
    }).then((confirmed) => {
      if (confirmed) {
        this.purchaseService.cancel(this.purchaseId).subscribe({
          next: () => {
            this.toast.success('Purchase cancelled successfully.');
            this.loadPurchase();
          },
          error: (err) => {
            this.toast.error(err.error?.message || 'Failed to cancel purchase.');
          }
        });
      }
    });
  }

   // Check if attachment is an image
  isImageAttachment(att: PurchaseAttachmentDto): boolean {
    return this.attachmentHelper.isImage(att.contentType);
  }

  // ─── THIS IS THE KEY METHOD ───
  // Builds the URL that <img [src]> uses to fetch image bytes from server
  // Hits: GET /api/PurchaseAttachment/{purchaseId}/{attachmentId}/preview
  getPreviewUrl(att: PurchaseAttachmentDto): string {
    return this.attachmentService.getPreviewUrl(this.purchaseId!, att.id);
  }

  // View: images → preview modal, PDFs → new tab
  viewAttachment(att: PurchaseAttachmentDto): void {
    if (this.isImageAttachment(att)) {
      // Show in preview modal
      this.previewImageUrl = this.attachmentService.getPreviewUrl(this.purchaseId!, att.id);
      this.isPreviewOpen = true;
    } else {
      // Open in new browser tab (PDF viewer etc.)
      const url = this.attachmentService.getDownloadUrl(this.purchaseId!, att.id);
      window.open(url, '_blank');
    }
  }

  // Force download
  downloadAttachment(att: PurchaseAttachmentDto): void {
    const url = this.attachmentService.getDownloadUrl(this.purchaseId!, att.id);
    const link = document.createElement('a');
    link.href = url;
    link.download = att.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Fallback when image fails to load
  onImageError(event: Event): void {
    this.attachmentHelper.onImageError(event);
  }

  // Close preview modal
  closePreview(): void {
    this.isPreviewOpen = false;
    this.previewImageUrl = null;
  }

  // File type icon
  getFileIcon(contentType: string): string {
    return this.attachmentHelper.getFileIcon(contentType);
  }

  // Human-readable file size
  formatFileSize(bytes: number): string {
    return this.attachmentHelper.formatFileSize(bytes);
  }

  goBack(): void {
    this.router.navigate(['/purchase']);
  }

  goToEdit(): void {
    this.router.navigate(['/purchases', this.purchaseId, 'edit']);
  }

  printPage(): void {
    window.print();
  }
 
}
