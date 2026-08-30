import { Component } from '@angular/core';
import { ASSET_CONDITION_OPTIONS, AvailablePurchaseDto, AvailablePurchaseItemDto, BulkCreateAssetDto, OWNERSHIP_TYPE_OPTIONS, SerialEntry } from '../../../models/Asset';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssetService } from '../../../Services/asset.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ToastService } from '../../../Services/toast.service';

@Component({
  selector: 'app-asset-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ClarityModule,FormsModule],
  templateUrl: './asset-register.component.html',
  styleUrl: './asset-register.component.css'
})
export class AssetRegisterComponent {
availablePurchases: AvailablePurchaseDto[] = [];
  selectedPurchase: AvailablePurchaseDto | null = null;
  availableItems: AvailablePurchaseItemDto[] = [];
  selectedItem: AvailablePurchaseItemDto | null = null;

  // Step 2: Common Info Form
  commonForm: FormGroup;
  conditionOptions = ASSET_CONDITION_OPTIONS;
  ownershipOptions = OWNERSHIP_TYPE_OPTIONS;

  // Step 3: Serial Numbers
  serialEntries: SerialEntry[] = [];
  pasteAreaVisible = false;
  pasteText = '';

  // State
  loading = false;
  saving = false;
  validating = false;
  isValidated = false;
  validCount = 0;
  errorCount = 0;

  constructor(
    private assetService: AssetService,
    private router: Router,
    private fb: FormBuilder,
    private toaster:ToastService
  ) {
    this.commonForm = this.fb.group({
      condition: [1, Validators.required],
      //ownershipType: [1, Validators.required],
      warrantyStartDate: ['', Validators.required],
      warrantyEndDate: ['', Validators.required],
      warrantyMonths: [{ value: 0, disabled: true }],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.loadAvailablePurchases();
    this.setupWarrantyCalculation();
  }

  // ─── Step 1: Load Purchases ───
  private loadAvailablePurchases(): void {
    this.loading = true;
    this.assetService.getAvailablePurchases().subscribe({
      next: (data) => {
        this.availablePurchases = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPurchaseSelect(purchaseId: string): void {
    this.selectedPurchase = this.availablePurchases.find(p => p.id === purchaseId) || null;
    this.selectedItem = null;
    this.serialEntries = [];
    this.isValidated = false;

    if (this.selectedPurchase) {
      this.assetService.getAvailableItems(purchaseId).subscribe({
        next: (items) => { this.availableItems = items; }
      });
    }
  }

  onItemSelect(item: AvailablePurchaseItemDto): void {
    this.selectedItem = item;
    this.serialEntries = [];
    this.isValidated = false;

    // Initialize serial entry slots based on remaining quantity
    for (let i = 0; i < item.remainingQty; i++) {
      this.serialEntries.push({
        index: i + 1,
        serialNumber: '',
        status: 'pending'
      });
    }

    // Auto-fill warranty if item has warrantyMonths
    if (item.warrantyMonths > 0) {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + item.warrantyMonths);

      this.commonForm.patchValue({
        warrantyStartDate: this.formatDate(today),
        warrantyEndDate: this.formatDate(endDate),
        warrantyMonths: item.warrantyMonths
      });
    }
  }

  // ─── Step 2: Warranty Auto-Calculation ───
  private setupWarrantyCalculation(): void {
    this.commonForm.get('warrantyStartDate')?.valueChanges.subscribe(() => this.calculateWarrantyMonths());
    this.commonForm.get('warrantyEndDate')?.valueChanges.subscribe(() => this.calculateWarrantyMonths());
  }

  private calculateWarrantyMonths(): void {
    const start = this.commonForm.get('warrantyStartDate')?.value;
    const end = this.commonForm.get('warrantyEndDate')?.value;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      this.commonForm.patchValue({ warrantyMonths: months }, { emitEvent: false });
    }
  }

  // ─── Step 3: Serial Number Management ───
  onSerialInput(index: number, value: string): void {
    this.serialEntries[index].serialNumber = value.trim();
    this.serialEntries[index].status = 'pending';
    this.isValidated = false;
    this.clientSideValidate();
  }

  togglePasteArea(): void {
    this.pasteAreaVisible = !this.pasteAreaVisible;
    this.pasteText = '';
  }

  onPasteSerials(event?: ClipboardEvent): void {
    let text = '';
    if (event) {
      text = event.clipboardData?.getData('text') || '';
      event.preventDefault();
    } else {
      text = this.pasteText;
    }

    const serials = text
      .split(/[\n\r]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (serials.length === 0) return;

    const maxQty = this.selectedItem?.remainingQty || 0;
    const limitedSerials = serials.slice(0, maxQty);

    // Rebuild serial entries
    this.serialEntries = [];
    for (let i = 0; i < maxQty; i++) {
      this.serialEntries.push({
        index: i + 1,
        serialNumber: limitedSerials[i] || '',
        status: limitedSerials[i] ? 'pending' : 'pending'
      });
    }

    this.pasteAreaVisible = false;
    this.pasteText = '';
    this.isValidated = false;
    this.clientSideValidate();
  }

  private clientSideValidate(): void {
    const seen = new Set<string>();
    this.validCount = 0;
    this.errorCount = 0;

    this.serialEntries.forEach(entry => {
      if (!entry.serialNumber) {
        entry.status = 'empty';
        return;
      }

      const lower = entry.serialNumber.toLowerCase();
      if (seen.has(lower)) {
        entry.status = 'duplicate';
        entry.errorMessage = 'Duplicate in this list';
        this.errorCount++;
      } else {
        seen.add(lower);
        entry.status = 'pending';
      }
    });
  }

  // ─── Validate with Server ───
  validateAll(): void {
    const serials = this.serialEntries
      .filter(e => e.serialNumber.length > 0)
      .map(e => e.serialNumber);

    if (serials.length === 0) return;

    this.validating = true;
    const dto = {
      purchaseId: this.selectedPurchase!.id,
      serialNumbers: serials
    };

    this.assetService.validateSerials(dto).subscribe({
      next: (result) => {
        // Reset all to pending
        this.serialEntries.forEach(entry => {
          if (entry.serialNumber) {
            entry.status = 'pending';
            entry.errorMessage = undefined;
          }
        });

        // Mark valid
        result.validSerials.forEach(serial => {
          const entry = this.serialEntries.find(e => e.serialNumber === serial);
          if (entry) {
            entry.status = 'valid';
            this.validCount++;
          }
        });

        // Mark errors
        result.errors.forEach(err => {
          const entry = this.serialEntries[err.index - 1];
          if (entry) {
            entry.status = 'error';
            entry.errorMessage = err.error;
            this.errorCount++;
          }
        });

        this.isValidated = true;
        this.validating = false;
      },
      error: () => { this.validating = false; }
    });
  }

  // ─── Save Assets ───
  saveAssets(): void {
    if (!this.selectedPurchase || !this.selectedItem || !this.commonForm.valid) return;

    const validSerials = this.serialEntries
      .filter(e => e.status === 'valid' || (e.serialNumber && e.status === 'pending'))
      .map(e => e.serialNumber);

    if (validSerials.length === 0) return;

    const dto: BulkCreateAssetDto = {
      purchaseId: this.selectedPurchase.id,
      category: this.selectedItem.category,
      brand: this.selectedItem.brand,
      model: this.selectedItem.model,
      configuration: this.selectedItem.configuration,
      condition: this.commonForm.get('condition')?.value,
      ownershipType: this.selectedPurchase.ownershipType,
      warrantyStartDate: this.commonForm.get('warrantyStartDate')?.value,
      warrantyEndDate: this.commonForm.get('warrantyEndDate')?.value,
      warrantyMonths: this.commonForm.get('warrantyMonths')?.value,
      remarks: this.commonForm.get('remarks')?.value || null,
      serialNumbers: validSerials
    };

    this.saving = true;
    this.assetService.bulkRegister(dto).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/asset/list']);
      },
      error: (err) => { 
        this.toaster.error(err.error||'Failed to upload Asset')
        this.saving = false;
        
       }
    });
  }

  // ─── Helpers ───
  get enteredCount(): number {
    return this.serialEntries.filter(e => e.serialNumber.length > 0).length;
  }

  get canSave(): boolean {
    return !!this.selectedPurchase &&
           !!this.selectedItem &&
           this.commonForm.valid &&
           this.enteredCount > 0 &&
           this.errorCount === 0 &&
           this.isValidated==true;
  }

  goBack(): void {
    this.router.navigate(['/asset/list']);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
