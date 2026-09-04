import { Component } from '@angular/core';
import { AssetBrand, AssetCategory, AssetModel, DatagridColumn } from '../../models/model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModelService } from '../../Services/model-service.service';
import { BrandService } from '../../Services/brand-service.service';
import { CategoryService } from '../../Services/category-service.service';
import { ReusableDatagridComponentComponent } from '../reusable-datagrid-component/reusable-datagrid-component.component';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ToastService } from '../../Services/toast.service';
import { ConfirmationService } from '../../Services/confirmation.service';

@Component({
  selector: 'app-model-component',
  standalone: true,
  imports: [ClarityModule, ReactiveFormsModule, CommonModule, ReusableDatagridComponentComponent],
  templateUrl: './model-component.component.html',
  styleUrl: './model-component.component.css'
})
export class ModelComponentComponent {
 // Datagrid
  models: AssetModel[] = [];
  columns: DatagridColumn[] = [
    { field: 'categoryName', header: 'Category', type: 'text' },
    { field: 'brandName', header: 'Brand', type: 'text' },
    { field: 'modelName', header: 'Model Name', type: 'text' },
    { field: 'isActive', header: 'Status', type: 'badge', badgeActiveText: 'Active', badgeInactiveText: 'Inactive' }
  ];
  loading: boolean = false;

  // Dropdowns
  categories: AssetCategory[] = [];
  allBrands: AssetBrand[] = [];
  filteredBrands: AssetBrand[] = [];

  // Modal
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Add Model';
  saving: boolean = false;
  form!: FormGroup;
  selectedId: string | null = null;
  

  constructor(
    private fb: FormBuilder,
    private modelService: ModelService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private notification: ToastService,
    private confirmation:ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.loadCategories();
    this.loadAllBrands();
  }

  private initForm(): void {
    this.form = this.fb.group({
      assetCategoryId: ['', Validators.required],
      assetBrandId: ['', Validators.required],
      modelName: ['', [Validators.required, Validators.maxLength(150)]],
      isActive: [true]
    });

    // Cascading: When category changes → filter brands
    this.form.get('assetCategoryId')!.valueChanges.subscribe((categoryId) => {
      this.filteredBrands = this.allBrands.filter(b => b.assetCategoryId === categoryId && b.isActive);
      // Reset brand if not in filtered list
      const currentBrand = this.form.get('assetBrandId')!.value;
      if (currentBrand && !this.filteredBrands.find(b => b.id === currentBrand)) {
        this.form.get('assetBrandId')!.setValue('');
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.modelService.getAll().subscribe({
      next: (data) => {
        this.models = data;
        this.loading = false;
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to load models.');
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

  loadAllBrands(): void {
    this.brandService.getAll().subscribe({
      next: (data) => {
        this.allBrands = data;
      },
      error: () => {
        this.notification.error('Failed to load brands.');
      }
    });
  }

  // ─── ADD ───
  openAdd(): void {
    this.isEditMode = false;
    this.modalTitle = 'Add Model';
    this.selectedId = null;
    this.filteredBrands = [];
    this.form.reset({ assetCategoryId: '', assetBrandId: '', modelName: '', isActive: true });
    this.isModalOpen = true;
  }

  // ─── EDIT ───
  openEdit(item: AssetModel): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Model';
    this.selectedId = item.id;

    // Pre-filter brands for selected category
    this.filteredBrands = this.allBrands.filter(b => b.assetCategoryId === item.assetCategoryId && b.isActive);

    this.form.patchValue({
      assetCategoryId: item.assetCategoryId,
      assetBrandId: item.assetBrandId,
      modelName: item.modelName,
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
        modelName: this.form.value.modelName.trim(),
        assetCategoryId: this.form.value.assetCategoryId,
        assetBrandId: this.form.value.assetBrandId,
        isActive: this.form.value.isActive
      };
      this.modelService.update(this.selectedId, dto).subscribe({
        next: () => {
          this.notification.success('Model updated successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to update model.');
          this.saving = false;
        }
      });
    } else {
      const dto = {
        modelName: this.form.value.modelName.trim(),
        assetCategoryId: this.form.value.assetCategoryId,
        assetBrandId: this.form.value.assetBrandId
      };
      this.modelService.create(dto).subscribe({
        next: () => {
          this.notification.success('Model created successfully.');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.notification.error(err.error || 'Failed to create model.');
          this.saving = false;
        }
      });
    }
  }

  // ─── DELETE ───
  openDelete(item: AssetModel): void {
   this.confirmation.confirmDanger(
    'Delete  Device Model ',`Are you sure you want to delete "${item.modelName}"?`,  
  ()=>{
    this.confirmDelete(item)
  } 
  )
  }

  confirmDelete(item:AssetModel): void {
    this.modelService.delete(item.id).subscribe({
      next: () => {
        this.notification.success('Model deleted successfully.');
        this.loadData();
      },
      error: (err) => {
        this.notification.error(err.error || 'Failed to delete model.');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.saving = false;
  }

}
