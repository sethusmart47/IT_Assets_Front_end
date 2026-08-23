import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import {
  CreatePurchasedItemDto,
  PurchasedItemDto,
  UpdatePurchasedItemDto
} from '../../../models/purchase';

import {
  AssetBrand,
  AssetCategoryApi,
  AssetModel
} from '../../../models/model';

import { WARRANTY_PERIODS } from '../../../enums/enum';
import { PurchasedItemService } from '../../../Services/purchased-item.service';
import { CategoryService } from '../../../Services/category-service.service';
import { NotificationService } from '../../../Services/notification-service.service';

@Component({
  selector: 'app-purchased-item-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule
  ],
  templateUrl: './purchased-item-modal.component.html',
  styleUrl: './purchased-item-modal.component.css'
})
export class PurchasedItemModalComponent implements OnInit {

  @Input() isOpen = false;
  @Input() purchaseId!: string;
  @Input() editItem: PurchasedItemDto | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<PurchasedItemDto>();

  form!: FormGroup;

  categories: AssetCategoryApi[] = [];
  filteredBrands: AssetBrand[] = [];
  filteredModels: AssetModel[] = [];

  warrantyPeriods = WARRANTY_PERIODS;

  saving = false;
  isEditMode = false;
  subTotal = 0;

  constructor(
    private fb: FormBuilder,
    private itemService: PurchasedItemService,
    private categoryService: CategoryService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.setupDropdowns();
    this.setupCalculation();
  }

  private initForm(): void {
    this.form = this.fb.group({
      categoryId: ['', Validators.required],
      brandId: ['', Validators.required],
      modelId: ['', Validators.required],
      configuration: ['', [
        Validators.required,
        Validators.maxLength(300)
      ]],
      quantity: [1, [
        Validators.required,
        Validators.min(1)
      ]],
      unitPrice: [0, [
        Validators.required,
        Validators.min(0.01)
      ]],
      warrantyPeriod: ['36 Months', Validators.required]
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: data => {
        this.categories = data.filter(x => x.isActive);

        if (this.editItem) {
          this.openEdit(this.editItem);
        }
      },
      error: () => {
        this.notification.error('Failed to load categories.');
      }
    });
  }

  private setupDropdowns(): void {
    this.form.get('categoryId')?.valueChanges.subscribe(categoryId => {

      const category = this.categories.find(
        x => x.id === categoryId
      );

      this.filteredBrands =
        category?.assetBrandDtos?.filter(x => x.isActive) || [];

      this.filteredModels = [];

      this.form.patchValue({
        brandId: '',
        modelId: ''
      }, { emitEvent: false });
    });

    this.form.get('brandId')?.valueChanges.subscribe(brandId => {

      const categoryId = this.form.get('categoryId')?.value;

      const category = this.categories.find(
        x => x.id === categoryId
      );

      this.filteredModels =
        category?.assetModelDtos?.filter(
          x => x.assetBrandId === brandId && x.isActive
        ) || [];

      this.form.patchValue({
        modelId: ''
      }, { emitEvent: false });
    });
  }

  private setupCalculation(): void {
    this.form.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateSubTotal();
    });

    this.form.get('unitPrice')?.valueChanges.subscribe(() => {
      this.calculateSubTotal();
    });
  }

  private calculateSubTotal(): void {
    const quantity =
      Number(this.form.get('quantity')?.value) || 0;

    const unitPrice =
      Number(this.form.get('unitPrice')?.value) || 0;

    this.subTotal = quantity * unitPrice;
  }
ngOnChanges(changes: SimpleChanges): void {

    if (changes['editItem'] && this.editItem) {

      this.form.patchValue({
        category: this.editItem.category,
        brand: this.editItem.brand,
        model: this.editItem.model,
        configuration: this.editItem.configuration,
        quantity: this.editItem.quantity,
        unitPrice: this.editItem.unitPrice,
        warranty: this.editItem.warrantyPeriod
      });
    }
    }


  openEdit(item: PurchasedItemDto): void {
    if (!this.categories.length) {
      return;
    }

    this.isEditMode = true;
    this.editItem = item;

    const category = this.categories.find(
      x => x.categoryName === item.category
    );

    if (!category) {
      this.notification.error('Category not found.');
      return;
    }

    this.filteredBrands =
      category.assetBrandDtos?.filter(x => x.isActive) || [];

    const brand = this.filteredBrands.find(
      x => x.brandName === item.brand
    );

    if (!brand) {
      this.notification.error('Brand not found.');
      return;
    }

    this.filteredModels =
      category.assetModelDtos?.filter(
        x => x.assetBrandId === brand.id && x.isActive
      ) || [];

    const model = this.filteredModels.find(
      x => x.modelName === item.model
    );

    if (!model) {
      this.notification.error('Model not found.');
      return;
    }

     this.form.patchValue({
        category: this.editItem.category,
        brand: this.editItem.brand,
        model: this.editItem.model,
        configuration: this.editItem.configuration,
        quantity: this.editItem.quantity,
        unitPrice: this.editItem.unitPrice,
        warranty: this.editItem.warrantyPeriod
      });

    this.calculateSubTotal();

    this.isOpen = true;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const category = this.categories.find(
      x => x.id === value.categoryId
    );

    const brand = this.filteredBrands.find(
      x => x.id === value.brandId
    );

    const model = this.filteredModels.find(
      x => x.id === value.modelId
    );

    if (!category || !brand || !model) {
      this.notification.error(
        'Please select a valid category, brand and model.'
      );
      return;
    }

    this.saving = true;

    const payload = {
      category: category.categoryName,
      brand: brand.brandName,
      model: model.modelName,
      configuration: value.configuration.trim(),
      quantity: Number(value.quantity),
      unitPrice: Number(value.unitPrice),
      warrantyPeriod: value.warrantyPeriod
    };

    if (this.isEditMode && this.editItem) {

      const dto: UpdatePurchasedItemDto = {
        ...payload
      };

      this.itemService.update(
        this.purchaseId,
        this.editItem.id,
        dto
      ).subscribe({
        next: result => {
          this.saving = false;
          this.notification.success(
            'Asset item updated successfully.'
          );
          this.saved.emit(result);
          this.close();
        },
        error: err => {
          this.saving = false;
          this.notification.error(
            err.error || 'Failed to update asset item.'
          );
        }
      });

      return;
    }

    const dto: CreatePurchasedItemDto = {
      ...payload
    };

    this.itemService.create(
      this.purchaseId,
      dto
    ).subscribe({
      next: result => {
        this.saving = false;
        this.notification.success(
          'Asset item created successfully.'
        );
        this.saved.emit(result);
        this.close();
      },
      error: err => {
        this.saving = false;
        this.notification.error(
          err.error || 'Failed to create asset item.'
        );
      }
    });
  }

  close(): void {
    this.isOpen = false;
    this.saving = false;
    this.closed.emit();
  }

  get modalTitle(): string {
    return this.isEditMode
      ? 'Edit Asset Item'
      : 'Add Asset Item';
  }

  get submitButtonLabel(): string {
    return this.isEditMode
      ? 'Update'
      : 'Save';
  }

  get selectedCategoryName(): string {
    const id = this.form.get('categoryId')?.value;

    return this.categories.find(
      x => x.id === id
    )?.categoryName || '';
  }

  get selectedBrandName(): string {
    const id = this.form.get('brandId')?.value;

    return this.filteredBrands.find(
      x => x.id === id
    )?.brandName || '';
  }

  get selectedModelName(): string {
    const id = this.form.get('modelId')?.value;

    return this.filteredModels.find(
      x => x.id === id
    )?.modelName || '';
  }
}