import { Component, OnInit } from '@angular/core';
import { AssetCategory, DatagridColumn } from '../../models/model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../Services/category-service.service';
import { ClarityModule } from '@clr/angular';

import { ReusableDatagridComponentComponent } from '../reusable-datagrid-component/reusable-datagrid-component.component';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../Services/toast.service';
import { ConfirmationService } from '../../Services/confirmation.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ClarityModule,CommonModule,
    ReusableDatagridComponentComponent,
  ReactiveFormsModule],
  templateUrl: './category-component.component.html',
  styleUrl: './category-component.component.css'
})
export class CategoryComponent implements OnInit  {
  categories: AssetCategory[] = [];
  columns: DatagridColumn[] = [
    { field: 'categoryName', header: 'Category Name', type: 'text' },
    { field: 'isActive', header: 'Status', type: 'badge', badgeActiveText: 'Active', badgeInactiveText: 'Inactive' }
  ];
  loading: boolean = false;

  // Modal
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Add Category';
  saving: boolean = false;
  form!: FormGroup;
  selectedId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notification: ToastService,
    private confirmation:ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      categoryName: ['', [Validators.required, Validators.maxLength(100)]],
      isActive: [true]
    });
  }

  loadData(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to load categories.');
        this.loading = false;
      }
    });
  }

  // ─── ADD ───
  openAdd(): void {
    this.isEditMode = false;
    this.modalTitle = 'Add Category';
    this.selectedId = null;
    this.form.reset({ categoryName: '', isActive: true });
    this.isModalOpen = true;
  }

  // ─── EDIT ───
  openEdit(item: AssetCategory): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Category';
    this.selectedId = item.id;
    this.form.patchValue({
      categoryName: item.categoryName,
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
        categoryName: this.form.value.categoryName.trim(),
        isActive: this.form.value.isActive
      };
      this.categoryService.update(this.selectedId, dto).subscribe({
        next: () => {
          this.notification.success('Category updated successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to update category.');
          this.saving = false;
        }
      });
    } else {
      const dto = { categoryName: this.form.value.categoryName.trim() };
      this.categoryService.create(dto).subscribe({
        next: () => {
          this.notification.success('Category created successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to create category.');
          this.saving = false;
        }
      });
            }}
      // ─── DELETE ───
  openDelete(item: AssetCategory): void {
     this.confirmation.confirmDanger(
    'Delete Vendor',
    `Are you sure you want to delete "${item.categoryName}"?`,
    () => {
      this.confirmDelete(item);
    }
  );
  }

  confirmDelete(item:AssetCategory): void {
    this.categoryService.delete(item.id).subscribe({
      next: () => {
        this.notification.success('Category deleted successfully.');
        this.loadData();
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to delete category.');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.saving = false;
  }
}


