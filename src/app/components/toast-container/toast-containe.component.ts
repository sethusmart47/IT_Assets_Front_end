import { Component } from '@angular/core';
import { ToastMessage, ToastService } from '../../Services/toast.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule,FormsModule,ClarityModule],
  templateUrl: './toast-containe.component.html',
  styleUrl: './toast-containe.component.css'
})
export class ToastContainerComponent {
  toasts$: Observable<ToastMessage[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts;
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  trackById(_: number, toast: ToastMessage): string {
    return toast.id;
  }}
