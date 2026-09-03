import { Component } from '@angular/core';
import { PurchaseAttachmentDto, PurchaseDetailDto } from '../../../models/purchase';
import { ToastService } from '../../../Services/toast.service';
import { PurchaseAttachmentService } from '../../../Services/purchase-attachment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../../../Services/purchase.service';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponentComponent } from '../../Delete confirm-dialog-component/confirm-dialog-component.component';
import { PurchasedItemModalComponent } from '../purchased-item-modal/purchased-item-modal.component';
import { ImagePreviewModalComponent } from '../../image-preview-modal/image-preview-modal.component';

@Component({
  selector: 'app-purchase-view',
  standalone: true,
  imports: [  CommonModule,
      ReactiveFormsModule,
      ClarityModule,
      PurchasedItemModalComponent,
      ConfirmDialogComponentComponent,
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

  isReceiveOpen = false;
  receiving = false;

  isPreviewOpen = false;
  previewImageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    public attachmentService: PurchaseAttachmentService,
    private toast: ToastService
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
      case 0: return 'Draft';
      case 1: return 'Pending';
      case 2: return 'Completed';
      case 3: return 'Cancelled';
      default: return  'Unknown';
    }
  }

  get statusClass(): string {
    if (!this.purchase) return '';
    switch (this.purchase.status) {
      case 0: return 'status-draft';
      case 1: return 'status-pending';
      case 2: return 'status-completed';
      case 3: return 'status-cancelled';
      default: return 'status-draft';
    }
  }

  get isCompleted(): boolean {
    return this.purchase?.status === 2;
  }

  get canReceive(): boolean {
    return !!this.purchase
      && this.purchase.status !== 2
      && this.purchase.status !== 3
      && (this.purchase.items?.length || 0) > 0;
  }

  openReceiveConfirm(): void {
    this.isReceiveOpen = true;
  }

  cancelReceive(): void {
    this.isReceiveOpen = false;
  }

  confirmReceive(): void {
    this.receiving = true;
    this.purchaseService.complete(this.purchaseId).subscribe({
      next: () => {
        this.receiving = false;
        this.isReceiveOpen = false;
        this.toast.success('Assets received successfully! Asset tags have been generated.');
        this.loadPurchase();
      },
      error: (err) => {
        this.receiving = false;
        this.toast.error(err.error?.message || 'Failed to receive assets.');
      }
    });
  }

   // Check if attachment is an image
  isImageAttachment(att: PurchaseAttachmentDto): boolean {
    if (!att.contentType) return false;
    return att.contentType.startsWith('image/');
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
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-preview.png';
    img.alt = 'Image not available';
  }

  // Close preview modal
  closePreview(): void {
    this.isPreviewOpen = false;
    this.previewImageUrl = null;
  }

  // File type icon
  getFileIcon(contentType: string): string {
    if (!contentType) return 'document';
    if (contentType.includes('pdf')) return 'file';
    if (contentType.startsWith('image/')) return 'image';
    return 'document';
  }

  // Human-readable file size
  formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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
