
// components/purchase/purchased-item-modal/purchased-item-modal.component.ts
import {
  Component, EventEmitter, Input, OnInit,
  OnChanges, Output, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import {
  CreatePurchasedItemDto,
  PurchasedItemDto,
  UpdatePurchasedItemDto
} from '../../../models/purchase';
import { AssetBrand, AssetCategoryApi, AssetModel } from '../../../models/model';
import { WARRANTY_PERIODS } from '../../../enums/enum';
import { PurchasedItemService } from '../../../Services/purchased-item.service';
import { CategoryService } from '../../../Services/category-service.service';
import { ToastService } from '../../../Services/toast.service';

@Component({
  selector: 'app-purchased-item-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClarityModule],
  templateUrl: './purchased-item-modal.component.html',
  styleUrl: './purchased-item-modal.component.css'
})
export class PurchasedItemModalComponent implements OnInit, OnChanges {

  @Input() isOpen = false;
  @Input() purchaseId!: string;
  @Input() editItem: PurchasedItemDto | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<PurchasedItemDto>();

  form!: FormGroup;
  categories: AssetCategoryApi[] = [];
  filteredBrands: AssetBrand[] = [];
  filteredModels: AssetModel[] = [];
 // warrantyPeriods = WARRANTY_PERIODS;

  saving = false;
  isEditMode = false;
  subTotal = 0;

  private categoriesLoaded = false;
  private isPopulating = false;

  constructor(
    private fb: FormBuilder,
    private itemService: PurchasedItemService,
    private categoryService: CategoryService,
    private toast: ToastService
  ) {}

  // ─── LIFECYCLE ───

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.setupCalculation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle editItem change after categories are loaded
    if (changes['editItem'] && this.editItem && this.categoriesLoaded && this.form) {
      this.populateEditForm(this.editItem);
    }

    // Handle modal open with editItem
    if (changes['isOpen'] && this.isOpen && this.editItem && this.categoriesLoaded && this.form) {
      this.populateEditForm(this.editItem);
    }

    // Reset form when opening in add mode
    if (changes['isOpen'] && this.isOpen && !this.editItem && this.form) {
      this.resetForm();
    }
  }

  // ─── FORM INITIALIZATION ───

  private initForm(): void {
    this.form = this.fb.group({
      categoryId: ['', Validators.required],
      brandId: ['', Validators.required],
      modelId: ['', Validators.required],
      configuration: ['', Validators.maxLength(300)],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      // warrantyPeriod: ['36 Months']
    });
  }

  private resetForm(): void {
    this.isEditMode = false;
    this.form.reset({
      categoryId: '',
      brandId: '',
      modelId: '',
      configuration: '',
      quantity: 1,
      unitPrice: 0,
      //warrantyPeriod: '36 Months'
    });
    this.filteredBrands = [];
    this.filteredModels = [];
    this.subTotal = 0;
  }

  // ─── DATA LOADING ───

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data.filter(x => x.isActive);
        this.categoriesLoaded = true;

        // Setup cascading dropdowns after categories loaded
        this.setupDropdowns();

        // If editItem was passed before categories were ready
        if (this.editItem && this.isOpen) {
          this.populateEditForm(this.editItem);
        }
      },
      error: () => {
        this.toast.error('Failed to load categories.');
      }
    });
  }

  // ─── CASCADING DROPDOWNS ───

  private setupDropdowns(): void {
    // When category changes → populate brands, clear model
    this.form.get('categoryId')?.valueChanges.subscribe(categoryId => {
      if (this.isPopulating) return;

      if (!categoryId) {
        this.filteredBrands = [];
        this.filteredModels = [];
        return;
      }

      const category = this.categories.find(x => x.id === categoryId);
      this.filteredBrands = category?.assetBrandDtos?.filter(x => x.isActive) || [];
      this.filteredModels = [];
      this.form.patchValue({ brandId: '', modelId: '' }, { emitEvent: false });
    });

    // When brand changes → populate models
    this.form.get('brandId')?.valueChanges.subscribe(brandId => {
      if (this.isPopulating) return;

      if (!brandId) {
        this.filteredModels = [];
        return;
      }

      const categoryId = this.form.get('categoryId')?.value;
      const category = this.categories.find(x => x.id === categoryId);
      this.filteredModels = category?.assetModelDtos?.filter(
        x => x.assetBrandId === brandId && x.isActive
      ) || [];
      this.form.patchValue({ modelId: '' }, { emitEvent: false });
    });
  }

  // ─── SUBTOTAL CALCULATION ───

  private setupCalculation(): void {
    this.form.get('quantity')?.valueChanges.subscribe(() => this.calcSubTotal());
    this.form.get('unitPrice')?.valueChanges.subscribe(() => this.calcSubTotal());
  }

  private calcSubTotal(): void {
    const qty = Number(this.form.get('quantity')?.value) || 0;
    const price = Number(this.form.get('unitPrice')?.value) || 0;
    this.subTotal = qty * price;
  }

  
  private populateEditForm(item: PurchasedItemDto): void {
    this.isEditMode = true;
    this.isPopulating = true;

    try {
      // Step 1: Resolve Category
      const category = this.categories.find(
        x => x.categoryName.toLowerCase().trim() === item.category.toLowerCase().trim()
      );

      if (!category) {
        this.toast.error(`Category "${item.category}" not found in active categories.`);
        this.isPopulating = false;
        return;
      }

      // Step 2: Build brand list for this category
      this.filteredBrands = category.assetBrandDtos?.filter(x => x.isActive) || [];

      // Step 3: Resolve Brand
      const brand = this.filteredBrands.find(
        x => x.brandName.toLowerCase().trim() === item.brand.toLowerCase().trim()
      );

      if (!brand) {
        this.toast.error(`Brand "${item.brand}" not found under "${item.category}".`);
        this.isPopulating = false;
        return;
      }

      // Step 4: Build model list for this brand
      this.filteredModels = category.assetModelDtos?.filter(
        x => x.assetBrandId === brand.id && x.isActive
      ) || [];

      // Step 5: Resolve Model
      const model = this.filteredModels.find(
        x => x.modelName.toLowerCase().trim() === item.model.toLowerCase().trim()
      );

      if (!model) {
        this.toast.error(`Model "${item.model}" not found under "${item.brand}".`);
        this.isPopulating = false;
        return;
      }

      // Step 6: Patch form with resolved IDs
      this.form.patchValue({
        categoryId: category.id,
        brandId: brand.id,
        modelId: model.id,
        configuration: item.configuration || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        //warrantyPeriod: item.warrantyPeriod || '36 Months'
      }, { emitEvent: false });

      this.calcSubTotal();

    } finally {
      this.isPopulating = false;
    }
  }

  // ─── SAVE (CREATE / UPDATE) ───

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill all required fields.');
      return;
    }

    const value = this.form.getRawValue();

    // Resolve names from IDs for the payload
    const category = this.categories.find(x => x.id === value.categoryId);
    const brand = this.filteredBrands.find(x => x.id === value.brandId);
    const model = this.filteredModels.find(x => x.id === value.modelId);

    if (!category || !brand || !model) {
      this.toast.error('Invalid selection. Please select category, brand and model.');
      return;
    }

    this.saving = true;

    const payload = {
      category: category.categoryName,
      brand: brand.brandName,
      model: model.modelName,
      configuration: (value.configuration || '').trim(),
      quantity: Number(value.quantity),
      unitPrice: Number(value.unitPrice),
      //warrantyPeriod: value.warrantyPeriod || ''
    };

    if (this.isEditMode && this.editItem) {
      // UPDATE
      const dto: UpdatePurchasedItemDto = { ...payload };
   
      this.itemService.update(this.purchaseId, this.editItem.id, dto).subscribe({
        next: (result) => {
          this.saving = false;
          this.toast.success('Asset item updated successfully.');
          this.saved.emit(result);
          this.close();
        },
        error: (err) => {
          this.saving = false;
          this.toast.error(err.error?.message || err.error || 'Failed to update item.');
        }
      });
    } else {
      // CREATE
      const dto: CreatePurchasedItemDto = { ...payload };

      this.itemService.create(this.purchaseId, dto).subscribe({
        next: (result) => {
          this.saving = false;
          this.toast.success('Asset item added successfully.');
          this.saved.emit(result);
          this.close();
        },
        error: (err) => {
          this.saving = false;
          this.toast.error(err.error?.message || err.error || 'Failed to add item.');
        }
      });
    }
  }

  // ─── CLOSE MODAL ───

  close(): void {
    this.isOpen = false;
    this.isEditMode = false;
    this.editItem = null;
    this.saving = false;
    this.resetForm();
    this.closed.emit();
  }
}

