import { Component } from '@angular/core';
import { AssetService } from '../../../Services/asset.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssetEditModalComponent } from '../asset-edit-modal/asset-edit-modal.component';
import { AssetDetail } from '../../../models/Asset';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule,ReactiveFormsModule,AssetEditModalComponent],
  templateUrl: './asset-detail.component.html',
  styleUrl: './asset-detail.component.css'
})
export class AssetDetailComponent {
asset: AssetDetail | null = null;
  loading = false;
  editModalOpen = false;
  deleteConfirmOpen = false;

  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadAsset(id);
  }

  private loadAsset(id: string): void {
    this.loading = true;
    this.assetService.getById(id).subscribe({
      next: (data) => {
        this.asset = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/asset-inventory']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/asset/list']);
  }

  openEditModal(): void {
    this.editModalOpen = true;
  }

  onEditSaved(): void {
    this.editModalOpen = false;
    if (this.asset) this.loadAsset(this.asset.id);
  }

  onEditCancelled(): void {
    this.editModalOpen = false;
  }

  confirmDelete(): void {
    this.deleteConfirmOpen = true;
  }

  onDeleteConfirmed(): void {
    if (!this.asset) return;
    this.assetService.delete(this.asset.id).subscribe({
      next: () => {
        this.deleteConfirmOpen = false;
        this.router.navigate(['/asset-inventory']);
      },
      error: () => {
        this.deleteConfirmOpen = false;
      }
    });
  }

  onDeleteCancelled(): void {
    this.deleteConfirmOpen = false;
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

  getTimelineIcon(action: string): string {
    const a = action.toLowerCase().replace(/\s+/g, '');
    switch (a) {
      case 'registered': return 'plus-circle';
      case 'assigned': return 'user';
      case 'returned': return 'undo';
      case 'senttoservice':
      case 'inservice':
      case 'servicecompleted': return 'wrench';
      case 'conditionchanged': return 'sync';
      case 'retired': return 'times-circle';
      case 'disposed': return 'trash';
      default: return 'event';
    }
  }

  getTimelineColor(action: string): string {
    const a = action.toLowerCase().replace(/\s+/g, '');
    switch (a) {
      case 'registered': return 'timeline-green';
      case 'assigned': return 'timeline-blue';
      case 'returned': return 'timeline-orange';
      case 'senttoservice': return 'timeline-yellow';
      case 'servicecompleted': return 'timeline-yellow';
      case 'conditionchanged': return 'timeline-gray';
      case 'retired': return 'timeline-red';
      case 'disposed': return 'timeline-dark';
      default: return 'timeline-gray';
    }
  }

  lifecycleFilter: 'all' | 'assignment' | 'service' | 'registration' = 'all';

  get filteredHistories() {
    if (!this.asset?.lifecycleHistories) return [];
    if (this.lifecycleFilter === 'all') return this.asset.lifecycleHistories;
    return this.asset.lifecycleHistories.filter(h => {
      const a = h.action.toLowerCase().replace(/\s+/g, '');
      if (this.lifecycleFilter === 'assignment') return a === 'assigned' || a === 'returned';
      if (this.lifecycleFilter === 'service') return a === 'senttoservice' || a === 'servicecompleted';
      if (this.lifecycleFilter === 'registration') return a === 'registered' || a === 'conditionchanged';
      return true;
    });
  }
}
