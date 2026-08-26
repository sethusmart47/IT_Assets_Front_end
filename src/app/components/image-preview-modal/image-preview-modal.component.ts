import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-image-preview-modal',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule],
  templateUrl: './image-preview-modal.component.html',
  styleUrl: './image-preview-modal.component.css'
})
export class ImagePreviewModalComponent {
@Input() isOpen = false;
  @Input() imageUrl = '';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-preview.png';
  }
}
