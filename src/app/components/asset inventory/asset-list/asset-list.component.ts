import { Component } from '@angular/core';
import { ASSET_CONDITION_OPTIONS, ASSET_STATUS_OPTIONS, AssetListDto } from '../../../models/Asset';
import { AssetService } from '../../../Services/asset.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ConfirmDialogComponentComponent } from '../../confirm-dialog-component/confirm-dialog-component.component';
import { AssetDetailComponent } from '../asset-detail/asset-detail.component';

import { WarrantyStatusPipe } from '../../../pipes/warranty-status.pipe';
import { AssetEditModalComponent } from '../asset-edit-modal/asset-edit-modal.component';
@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule,ClarityModule,WarrantyStatusPipe,
    ReactiveFormsModule,AssetEditModalComponent],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.css'
})
export class AssetListComponent {

  assets: AssetListDto[] = [];
  loading = false;
  filterForm: FormGroup;
  statusOptions = ASSET_STATUS_OPTIONS;
  conditionOptions = ASSET_CONDITION_OPTIONS;
  categories: string[] = [];
  brands: string[] = [];

  // Edit Modal
  editModalOpen = false;
  selectedAsset: AssetListDto | null = null;

  // Stats
  totalCount = 0;
  availableCount = 0;
  assignedCount = 0;
  inServiceCount = 0;
  retiredCount = 0;

  constructor(
    private assetService: AssetService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      category: [''],
      brand: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.loading = true;
    const filters = this.filterForm.value;
    this.assetService.getAll(filters).subscribe({
      next: (data) => {
        this.assets = data;
        this.calculateStats(data);
        this.extractFilters(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private calculateStats(data: AssetListDto[]): void {
    this.totalCount = data.length;
    this.availableCount = data.filter(a => a.status === 1).length;
    this.assignedCount = data.filter(a => a.status === 2).length;
    this.inServiceCount = data.filter(a => a.status === 3).length;
    this.retiredCount = data.filter(a => a.status === 4).length;
  }

  private extractFilters(data: AssetListDto[]): void {
    this.categories = [...new Set(data.map(a => a.category))];
    this.brands = [...new Set(data.map(a => a.brand))];
  }

  onFilterChange(): void {
    this.loadAssets();
  }

  clearFilters(): void {
    this.filterForm.reset({ status: '', category: '', brand: '', search: '' });
    this.loadAssets();
  }

  onSearch(): void {
    this.loadAssets();
  }

  navigateToRegister(): void {
    this.router.navigate(['/asset/register']);
  }

  viewAsset(asset: AssetListDto): void {
    this.router.navigate(['/asset/detail',asset.id]);
  }

  openEditModal(asset: AssetListDto): void {
    this.selectedAsset = asset;
    this.editModalOpen = true;
  }

  onEditSaved(): void {
    this.editModalOpen = false;
    this.selectedAsset = null;
    this.loadAssets();
  }

  onEditCancelled(): void {
    this.editModalOpen = false;
    this.selectedAsset = null;
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 1: return 'badge-success';
      case 2: return 'badge-info';
      case 3: return 'badge-warning';
      case 4: return 'badge-neutral';
      case 5: return 'badge-danger';
      case 6: return 'badge-neutral';
      default: return '';
    }
  }
}
