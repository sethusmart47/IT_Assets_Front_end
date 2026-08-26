
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'warrantyStatus',
  standalone: true
})
export class WarrantyStatusPipe implements PipeTransform {
  transform(endDate: string): { label: string; class: string } {
    const end = new Date(endDate);
    const today = new Date();
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) return { label: 'Expired', class: 'label-danger' };
    if (daysLeft <= 90) return { label: `${daysLeft} days left`, class: 'label-warning' };
    return { label: 'Active', class: 'label-success' };
  }
}