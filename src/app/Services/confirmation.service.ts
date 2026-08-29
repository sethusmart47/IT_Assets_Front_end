import { Injectable } from '@angular/core';
import { ConfirmationConfig } from '../components/Delete confirm-dialog-component/confirm-dialog-component.component';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
 private confirmationSubject = new Subject<{
    config: ConfirmationConfig;
    resolve: (result: boolean) => void;
  }>();

  confirmation$ = this.confirmationSubject.asObservable();

  // ─── Base Method (Promise-based) ───────────────────────────────────────────────

  open(config: ConfirmationConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.confirmationSubject.next({ config, resolve });
    });
  }

  // ─── Default Confirmation (Blue Button) ────────────────────────────────────────

  confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.open({ title, message }).then((confirmed) => {
      if (confirmed) onConfirm();
      else if (onCancel) onCancel();
    });
  }

  // ─── Danger Confirmation (Red Button) ──────────────────────────────────────────

  confirmDanger(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.open({ title, message, type: 'danger', confirmText: 'Delete' }).then((confirmed) => {
      if (confirmed) onConfirm();
      else if (onCancel) onCancel();
    });
  }

  // ─── Warning Confirmation (Orange Button) ──────────────────────────────────────

  confirmWarning(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.open({ title, message, type: 'warning', confirmText: 'Proceed' }).then((confirmed) => {
      if (confirmed) onConfirm();
      else if (onCancel) onCancel();
    });
  }}