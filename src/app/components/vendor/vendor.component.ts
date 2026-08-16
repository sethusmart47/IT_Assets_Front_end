import { Component } from '@angular/core';
import { Vendor } from '../../model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorService } from '../../Services/vendor.service';
import { NotificationService } from '../../Services/notification-service.service';
import { ConfirmDialogComponentComponent } from '../confirm-dialog-component/confirm-dialog-component.component';

import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [ClarityModule, ReactiveFormsModule, CommonModule,ConfirmDialogComponentComponent],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent {

  vendors: Vendor[] = [];
  loading: boolean = false;

  // ─── MODAL ───
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Add Vendor';
  saving: boolean = false;
  form!: FormGroup;
  selectedId: string | null = null;

  // ─── DELETE ───
  isDeleteOpen: boolean = false;
  deleting: boolean = false;
  deleteItemRef: Vendor | null = null;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  // ─── FORM INIT ───
  private initForm(): void {
    this.form = this.fb.group({
      vendorName: ['', [Validators.required, Validators.maxLength(200)]],
      contactPerson: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      gstNumber: ['', [Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  // ─── LOAD DATA ───
  loadData(): void {
    this.loading = true;
    this.vendorService.getAll().subscribe({
      next: (data) => {
        this.vendors = data;
        this.loading = false;
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to load vendors.');
        this.loading = false;
      }
    });
  }

  // ─── OPEN ADD MODAL ───
  openAdd(): void {
    this.isEditMode = false;
    this.modalTitle = 'Add Vendor';
    this.selectedId = null;
    this.form.reset({
      vendorName: '',
      contactPerson: '',
      email: '',
      phone: '',
      gstNumber: '',
      address: '',
      isActive: true
    });
    this.isModalOpen = true;
  }

  // ─── OPEN EDIT MODAL ───
  openEdit(item: Vendor): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Vendor';
    this.selectedId = item.id;
    this.form.patchValue({
      vendorName: item.vendorName,
      contactPerson: item.contactPerson,
      email: item.email,
      phone: item.phone,
      gstNumber: item.gstNumber || '',
      address: item.address || '',
      isActive: item.isActive
    });
    this.isModalOpen = true;
  }

  // ─── SAVE (CREATE / UPDATE) ───
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.form.value;

    if (this.isEditMode && this.selectedId) {
      const dto = {
        vendorName: formValue.vendorName.trim(),
        contactPerson: formValue.contactPerson.trim(),
        email: formValue.email.trim(),
        phone: formValue.phone.trim(),
        gstNumber: formValue.gstNumber?.trim() || null,
        address: formValue.address?.trim() || null,
        isActive: formValue.isActive
      };

      this.vendorService.update(this.selectedId, dto).subscribe({
        next: () => {
          this.notification.success('Vendor updated successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to update vendor.');
          this.saving = false;
        }
      });
    } else {
      const dto = {
        vendorName: formValue.vendorName.trim(),
        contactPerson: formValue.contactPerson.trim(),
        email: formValue.email.trim(),
        phone: formValue.phone.trim(),
        gstNumber: formValue.gstNumber?.trim() || null,
        address: formValue.address?.trim() || null
      };

      this.vendorService.create(dto).subscribe({
        next: () => {
          this.notification.success('Vendor created successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to create vendor.');
          this.saving = false;
        }
      });
    }
  }

  // ─── DELETE ───
  openDelete(item: Vendor): void {
    this.deleteItemRef = item;
    this.isDeleteOpen = true;
  }

  confirmDelete(): void {
    if (!this.deleteItemRef) return;
    this.deleting = true;

    this.vendorService.delete(this.deleteItemRef.id).subscribe({
      next: () => {
        this.notification.success('Vendor deleted successfully.');
        this.isDeleteOpen = false;
        this.deleting = false;
        this.deleteItemRef = null;
        this.loadData();
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to delete vendor.');
        this.deleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.isDeleteOpen = false;
    this.deleteItemRef = null;
  }

  // ─── CLOSE MODAL ───
  closeModal(): void {
    this.isModalOpen = false;
    this.saving = false;
  }
}
