import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

export interface Notification {
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService{

  constructor() { }
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  success(message: string): void {
    this.notificationSubject.next({ type: 'success', message });
  }

  error(message: string): void {
    this.notificationSubject.next({ type: 'danger', message });
  }

  warning(message: string): void {
    this.notificationSubject.next({ type: 'warning', message });
  }

  info(message: string): void {
    this.notificationSubject.next({ type: 'info', message });
  }
}
