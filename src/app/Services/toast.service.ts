
// Services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<ToastMessage[]>([]);
  toasts = this.toasts$.asObservable();

  success(message: string, title = 'Success'): void {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title = 'Error'): void {
    this.show({ type: 'error', title, message, duration: 6000 });
  }

  warning(message: string, title = 'Warning'): void {
    this.show({ type: 'warning', title, message });
  }

  info(message: string, title = 'Info'): void {
    this.show({ type: 'info', title, message });
  }

  private show(toast: Omit<ToastMessage, 'id'>): void {
    const id = crypto.randomUUID();
    const duration = toast.duration || 4000;
    const current = this.toasts$.value;
    this.toasts$.next([...current, { ...toast, id }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: string): void {
    const current = this.toasts$.value.filter(t => t.id !== id);
    this.toasts$.next(current);
  }
}

