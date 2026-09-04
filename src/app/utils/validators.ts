import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notInFutureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const v = new Date(control.value);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return v > t ? { futureDate: true } : null;
  };
}

export function warrantyDateOrderValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('warrantyStartDate')?.value;
    const end = group.get('warrantyEndDate')?.value;
    if (!start || !end) return null;
    const s = new Date(start), e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    return e >= s ? null : { warrantyEndBeforeStart: true };
  };
}

export function purchaseDateOrderValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const purchase = group.get('purchaseDate')?.value;
    const invoice = group.get('invoiceDate')?.value;
    const delivery = group.get('expectedDeliveryDate')?.value;
    if (!purchase || !invoice || !delivery) return null;
    const p = new Date(purchase), i = new Date(invoice), d = new Date(delivery);
    if (i < p) return { invoiceBeforePurchase: true };
    if (d < i) return { deliveryBeforeInvoice: true };
    return null;
  };
}
