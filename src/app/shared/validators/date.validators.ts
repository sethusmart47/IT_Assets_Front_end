import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notInFuture(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const input = new Date(control.value);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return input > today ? { futureDate: true } : null;
}

export function notInPast(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const input = new Date(control.value);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return input < today ? { pastDate: true } : null;
}

export function dateAfter(otherControlName: string, equalAllowed = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent || !control.value) return null;
    const other = parent.get(otherControlName);
    if (!other || !other.value) return null;
    const thisDate = new Date(control.value);
    const otherDate = new Date(other.value);
    if (isNaN(thisDate.getTime()) || isNaN(otherDate.getTime())) return null;
    const valid = equalAllowed ? thisDate >= otherDate : thisDate > otherDate;
    return valid ? null : { dateOrder: { required: equalAllowed ? `>= ${otherControlName}` : `> ${otherControlName}` } };
  };
}

export function dateRangeValidator(startName: string, endName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startName)?.value;
    const end = group.get(endName)?.value;
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    return e >= s ? null : { dateRange: true };
  };
}
