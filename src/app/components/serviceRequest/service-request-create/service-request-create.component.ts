import { Component } from '@angular/core';
import {  CreateServiceRequestDto, ISSUE_TYPES, PRIORITIES } from '../../../models/AssetService';
import { ServiceRequestService } from '../../../Services/service-request.service';
import { ToastService } from '../../../Services/toast.service';
import { ConfirmationService } from '../../../Services/confirmation.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { VendorDto } from '../../../models/purchase';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { AssetAssignmentService } from '../../../Services/asset-assignment.service';

import { VendorService } from '../../../Services/vendor.service';
import { Vendor } from '../../../models/model';
import { AssetDetail } from '../../../models/Asset';

@Component({
  selector: 'app-service-request-create',
  standalone: true,
  imports: [ClarityModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './service-request-create.component.html',
  styleUrl: './service-request-create.component.css'
})
export class ServiceRequestCreateComponent {

// Dropdowns
  issueTypes = ISSUE_TYPES;
  priorities = PRIORITIES;
  vendors: Vendor[] = [];

  // Asset Search
  assetTagSearch = '';
  assetDetail: AssetDetail | null = null;
  searching = false;
  searchError = '';

  // Validation Flags
  isWarrantyExpired = false;
  isAlreadyInService = false;
  isAssetLost = false;

  // Form

searchForm = new FormGroup({
    searchType: new FormControl<'serialNumber' | 'assetTag'>('serialNumber'),
    searchValue: new FormControl('', [Validators.required])
  });
  submitting = false;
serviceForm:FormGroup
  constructor(
    private serviceRequestService: ServiceRequestService,
    private toaster: ToastService,
    private confirmation: ConfirmationService,
    private router: Router,
    private fb:FormBuilder,
    private vendorService:VendorService,
    private assetAssignmentService:AssetAssignmentService
  ) {
      this.serviceForm = this.fb.group({
     issueType: ['', Validators.required],
     reportedDate: ['', [Validators.required, this.notInFutureValidator]],
     priority: ['', Validators.required],
     vendorName: [null],
     issueDescription: [null]
   });
  }

  ngOnInit(): void {
    this.loadVendors();
    this.setTodayDate();
  }
 

  // ─── Load Vendors ──────────────────────────────────────────────────────────────

  private loadVendors(): void {
    this.vendorService.getAll().subscribe({
      next: (data) => this.vendors = data,
      error: () => this.toaster.error('Failed to load vendors.')
    });
  }

  // ─── Set Today Date ────────────────────────────────────────────────────────────

  private notInFutureValidator = (c: AbstractControl): ValidationErrors | null => {
    if (!c.value) return null;
    const v = new Date(c.value); const t = new Date(); t.setHours(0,0,0,0);
    return v > t ? { futureDate: true } : null;
  };

  private setTodayDate(): void {
    const today = new Date();
    const formatted = today.toISOString().substring(0, 10);
    this.serviceForm.patchValue({ reportedDate: formatted });
  }

  // ─── Search Asset ──────────────────────────────────────────────────────────────

  onSearchAsset(): void {
    if (this.searchForm.invalid) return;

    const { searchType, searchValue } = this.searchForm.value;
    if (!searchValue?.trim()) {
      this.toaster.warning('Please enter a search value.');
      return;
    }

    this.searching = true;
    this.assetDetail = null;
    this.searchError = '';

    const serialNumber = searchType === 'serialNumber' ? searchValue.trim() : undefined;
    const assetTag = searchType === 'assetTag' ? searchValue.trim() : undefined;

    this.assetAssignmentService.searchAvailableAsset(serialNumber, assetTag).subscribe({
      next: (data) => {
        this.assetDetail = data;
        this.searching = false;
      },
      error: (err) => {
        this.searching = false;
        this.assetDetail = null;
        if (err.status === 404) {
          this.searchError = 'No available asset found matching the criteria.';
        } else {
          this.searchError = err.error || 'Failed to search asset.';
        }
      }
    });
  }
  onClearSearch(): void {
    this.assetTagSearch = '';
    this.assetDetail = null;
    this.searchError = '';
    this.isWarrantyExpired = false;
    this.isAlreadyInService = false;
    this.isAssetLost = false;
  }

  // ─── Validate Asset ────────────────────────────────────────────────────────────

  private validateAsset(asset: AssetDetail): void {
    // Check warranty
    this.isWarrantyExpired = !asset.isWarrantyActive;

    // Check if already in service (status enum: InService = 3 typically)
    this.isAlreadyInService = asset.statusName === 'InService';

    // Check if lost
    this.isAssetLost = asset.statusName === 'Lost';
  }

  // ─── Can Submit ────────────────────────────────────────────────────────────────

  get canSubmit(): boolean {
    return this.assetDetail !== null
      && !this.isWarrantyExpired
      && !this.isAlreadyInService
      && !this.isAssetLost
      && this.serviceForm.valid;
  }

  // ─── Submit ────────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.canSubmit || !this.assetDetail) return;

    this.confirmation.confirm(
      'Submit Service Request',
      `Create a service request for "${this.assetDetail.assetTag}"? The asset status will change to "In Service".`,
      () => this.processSubmit()
    );
  }

  private processSubmit(): void {
    if (!this.assetDetail) return;

    this.submitting = true;

    const formValue = this.serviceForm.getRawValue();
    // reportedDate is already yyyy-MM-dd from <input type="date">
    //const reportedDate = formValue.reportedDate!;

const [month, day, year] = formValue.reportedDate!.split('/');

const reportedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
 const dto: CreateServiceRequestDto = {
   assetId: this.assetDetail.id,
   issueType: formValue.issueType!,
   reportedDate: reportedDate!,
   priority: formValue.priority!,
   vendorName: formValue.vendorName || null,
   issueDescription: formValue.issueDescription || null
 };


    this.serviceRequestService.create(dto).subscribe({
      next: (result) => {
        this.submitting = false;
        this.toaster.success(`Service request created for "${result.assetTag}".`);
        this.router.navigate(['/service']);
      },
      error: (err) => {
        this.submitting = false;
        this.toaster.error(err.error || 'Failed to create service request.');
      }
    });
  }

  // ─── Navigation ────────────────────────────────────────────────────────────────

  onCancel(): void {
    this.router.navigate(['/service']);
  }
}

