import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AttachmentHelperService {

  isImage(contentType: string | null | undefined): boolean {
    return !!contentType && contentType.startsWith('image/');
  }

  getFileIcon(contentType: string | null | undefined): string {
    if (!contentType) return 'document';
    if (contentType.includes('pdf')) return 'file';
    if (contentType.startsWith('image/')) return 'image';
    return 'document';
  }

  formatFileSize(bytes: number | null | undefined): string {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-preview.png';
    img.alt = 'Image not available';
  }
}
