import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService } from '../../../Services/confirmation.service';
import { ConfirmationConfig } from '../../Delete confirm-dialog-component/confirm-dialog-component.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
isOpen = false;
  config: ConfirmationConfig = { title: '', message: '' };
  private resolve: ((result: boolean) => void) | null = null;
  private subscription!: Subscription;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.subscription = this.confirmationService.confirmation$.subscribe(({ config, resolve }) => {
      this.config = config;
      this.resolve = resolve;
      this.isOpen = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get confirmText(): string {
    return this.config.confirmText || 'Confirm';
  }

  get cancelText(): string {
    return this.config.cancelText || 'Cancel';
  }

  get confirmBtnClass(): string {
    switch (this.config.type) {
      case 'danger':  return 'btn btn-danger';
      case 'warning': return 'btn btn-warning';
      default:        return 'btn btn-primary';
    }
  }

  get iconShape(): string {
    switch (this.config.type) {
      case 'danger':  return 'exclamation-triangle';
      case 'warning': return 'warning-standard';
      default:        return 'info-circle';
    }
  }

  get iconClass(): string {
    switch (this.config.type) {
      case 'danger':  return 'icon-danger';
      case 'warning': return 'icon-warning';
      default:        return 'icon-info';
    }
  }

  onConfirm(): void {
    this.isOpen = false;
    this.resolve?.(true);
    this.resolve = null;
  }

  onCancel(): void {
    this.isOpen = false;
    this.resolve?.(false);
    this.resolve = null;
  }
}
