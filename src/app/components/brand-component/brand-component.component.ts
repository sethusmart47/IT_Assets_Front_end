import { Component, OnInit } from '@angular/core';
import { AssetBrand, AssetCategory, DatagridColumn } from '../../model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../Services/category-service.service';
import { NotificationService } from '../../Services/notification-service.service';
import { ClarityModule } from '@clr/angular';

import {  ConfirmDialogComponentComponent } from '../confirm-dialog-component/confirm-dialog-component.component';
import { ReusableDatagridComponentComponent } from '../reusable-datagrid-component/reusable-datagrid-component.component';
import { CommonModule } from '@angular/common';     
import { BrandService } from '../../Services/brand-service.service';
@Component({
  selector: 'app-brand-component',
  standalone: true,
  imports: [ConfirmDialogComponentComponent, ReusableDatagridComponentComponent, ReactiveFormsModule, ClarityModule, CommonModule],
  templateUrl: './brand-component.component.html',
  styleUrl: './brand-component.component.css'
})
export class BrandComponentComponent {
brands: AssetBrand[] = [];
  columns: DatagridColumn[] = [
    { field: 'categoryName', header: 'Category', type: 'text' },
    { field: 'brandName', header: 'Brand Name', type: 'text' },
    { field: 'isActive', header: 'Status', type: 'badge', badgeActiveText: 'Active', badgeInactiveText: 'Inactive' }
  ];
  loading: boolean = false;

  // Dropdown
  categories: AssetCategory[] = [];

  // Modal
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Add Brand';
  saving: boolean = false;
  form!: FormGroup;
  selectedId: string | null = null;

  // Delete
  isDeleteOpen: boolean = false;
  deleting: boolean = false;
  deleteItemRef: AssetBrand | null = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.loadCategories();
  }

  private initForm(): void {
    this.form = this.fb.group({
      assetCategoryId: ['', Validators.required],
      brandName: ['', [Validators.required, Validators.maxLength(100)]],
      isActive: [true]
    });
  }

  loadData(): void {
    this.loading = true;
    this.brandService.getAll().subscribe({
      next: (data) => {
        this.brands = data;
        this.loading = false;
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to load brands.');
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data.filter(c => c.isActive);
      },
      error: () => {
        this.notification.error('Failed to load categories.');
      }
    });
  }

  // ─── ADD ───
  openAdd(): void {
    this.isEditMode = false;
    this.modalTitle = 'Add Brand';
    this.selectedId = null;
    this.form.reset({ assetCategoryId: '', brandName: '', isActive: true });
    this.isModalOpen = true;
  }

  // ─── EDIT ───
  openEdit(item: AssetBrand): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Brand';
    this.selectedId = item.id;
    this.form.patchValue({
      assetCategoryId: item.assetCategoryId,
      brandName: item.brandName,
      isActive: item.isActive
    });
    this.isModalOpen = true;
  }

  // ─── SAVE ───
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedId) {
      const dto = {
        brandName: this.form.value.brandName.trim(),
        assetCategoryId: this.form.value.assetCategoryId,
        isActive: this.form.value.isActive
      };
      this.brandService.update(this.selectedId, dto).subscribe({
        next: () => {
          this.notification.success('Brand updated successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to update brand.');
          this.saving = false;
        }
      });
    } else {
      const dto = {
        brandName: this.form.value.brandName.trim(),
        assetCategoryId: this.form.value.assetCategoryId
      };
      this.brandService.create(dto).subscribe({
        next: () => {
          this.notification.success('Brand created successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to create brand.');
          this.saving = false;
        }
      });
    }
  }

  // ─── DELETE ───
  openDelete(item: AssetBrand): void {
    this.deleteItemRef = item;
    this.isDeleteOpen = true;
  }

  confirmDelete(): void {
    if (!this.deleteItemRef) return;
    this.deleting = true;
    this.brandService.delete(this.deleteItemRef.id).subscribe({
      next: () => {
        this.notification.success('Brand deleted successfully.');
        this.isDeleteOpen = false;
        this.deleting = false;
        this.deleteItemRef = null;
        this.loadData();
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to delete brand.');
        this.deleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.isDeleteOpen = false;
    this.deleteItemRef = null;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.saving = false;
  }

}
