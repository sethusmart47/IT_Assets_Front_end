import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ClarityModule } from '@clr/angular';
export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;         // Default: 'Confirm'
  cancelText?: string;          // Default: 'Cancel'
  type?: 'default' | 'danger' | 'warning';  // Button color
}
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule,ClarityModule],
  templateUrl: './confirm-dialog-component.component.html',
  styleUrl: './confirm-dialog-component.component.css'
})
export class ConfirmDialogComponentComponent {
@Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Delete';
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Input() loading: boolean = false;

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm(): void {
    this.onConfirm.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
