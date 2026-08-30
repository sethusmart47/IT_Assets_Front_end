import { Component } from '@angular/core';
import { AssetListDto } from '../../models/Asset';
import { AssetService } from '../../Services/asset.service';
import { EmployeeService } from '../../Services/employee.service';
import { ServiceRequestService } from '../../Services/service-request.service';
import { Router } from '@angular/router';
import { ServiceRequestListDto } from '../../models/AssetService';
import ApexCharts from 'apexcharts';
import { forkJoin } from 'rxjs';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

 allAssets: AssetListDto[] = [];
  filteredAssets: AssetListDto[] = [];
  allServiceRequests: ServiceRequestListDto[] = [];
  totalEmployees = 0;

  loading = false;
  error = '';
  searchText = '';

  // ─── Filters ───────────────────────────────────────────────────────────────────
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;
  selectedModel: string | null = null;
  selectedStatus: string | null = null;
  selectedLocation: string | null = null;
  selectedWarranty: string | null = null;

  categoryOptions: string[] = [];
  brandOptions: string[] = [];
  modelOptions: string[] = [];
  locationOptions: string[] = [];
  statuses = ['Available', 'Assigned', 'InService', 'Retired', 'Lost'];
  warrantyOptions = ['Active', 'Expiring', 'Expired'];

  // ─── KPIs ──────────────────────────────────────────────────────────────────────
  totalAssets = 0;
  assignedCount = 0;
  availableCount = 0;
  inServiceCount = 0;
  retiredCount = 0;
  lostCount = 0;
  categoryCount = 0;
  brandCount = 0;
  modelCount = 0;

  // ─── Service KPIs ─────────────────────────────────────────────────────────────
  serviceOpen = 0;
  serviceInProgress = 0;
  serviceResolved = 0;
  serviceTotal = 0;

  // ─── Warranty Stats ────────────────────────────────────────────────────────────
  warrantyActive = 0;
  warrantyExpiring = 0;
  warrantyExpired = 0;

  // ─── Chart Instances (for cleanup) ─────────────────────────────────────────────
  private statusChart: ApexCharts | null = null;
  private categoryChart: ApexCharts | null = null;
  private brandChart: ApexCharts | null = null;
  private warrantyChart: ApexCharts | null = null;

  private statusColorMap: Record<string, string> = {
    'Available': '#4caf50', 'Assigned': '#2196f3', 'InService': '#ff9800',
    'Retired': '#9e9e9e', 'Lost': '#f44336'
  };

  constructor(
    private assetService: AssetService,
    private employeeService: EmployeeService,
    private serviceRequestService: ServiceRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private destroyCharts(): void {
    this.statusChart?.destroy();
    this.categoryChart?.destroy();
    this.brandChart?.destroy();
    this.warrantyChart?.destroy();
    this.statusChart = null;
    this.categoryChart = null;
    this.brandChart = null;
    this.warrantyChart = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // LOAD DATA
  // ═══════════════════════════════════════════════════════════════════════════════

  loadDashboard(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      assets: this.assetService.getAll(),
      employees: this.employeeService.getAllEmployees(),
      serviceRequests: this.serviceRequestService.getAll()
    }).subscribe({
      next: ({ assets, employees, serviceRequests }) => {
        this.allAssets = assets;
        this.totalEmployees = employees.length;
        this.allServiceRequests = serviceRequests;
        this.buildFilterOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load dashboard. Please try again.';
        this.loading = false;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FILTER OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  private buildFilterOptions(): void {
    this.categoryOptions = [...new Set(this.allAssets.map(a => a.category))].sort();
    this.brandOptions = [...new Set(this.allAssets.map(a => a.brand))].sort();
    this.modelOptions = [...new Set(this.allAssets.map(a => a.model))].sort();
  
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // APPLY FILTERS + REBUILD ALL
  // ═══════════════════════════════════════════════════════════════════════════════

  applyFilters(): void {
    this.filteredAssets = this.getFilteredAssets();
    this.buildKPIs();
    this.buildServiceKPIs();
    this.buildWarrantyStats();
    this.updateDependentFilters();

    // Render charts after DOM is ready
    setTimeout(() => this.renderAllCharts(), 100);
  }

  private getFilteredAssets(): AssetListDto[] {
    let assets = [...this.allAssets];
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    if (this.selectedCategory) assets = assets.filter(a => a.category === this.selectedCategory);
    if (this.selectedBrand) assets = assets.filter(a => a.brand === this.selectedBrand);
    if (this.selectedModel) assets = assets.filter(a => a.model === this.selectedModel);
    if (this.selectedStatus) assets = assets.filter(a => a.statusName === this.selectedStatus);
    //if (this.selectedLocation) assets = assets.filter(a => a.currentLocation === this.selectedLocation);

    if (this.selectedWarranty === 'Active') assets = assets.filter(a => new Date(a.warrantyEndDate) > thirtyDays);
    if (this.selectedWarranty === 'Expiring') assets = assets.filter(a => {
      const end = new Date(a.warrantyEndDate);
      return end >= today && end <= thirtyDays;
    });
    if (this.selectedWarranty === 'Expired') assets = assets.filter(a => new Date(a.warrantyEndDate) < today);

    return assets;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BUILD KPIs
  // ═══════════════════════════════════════════════════════════════════════════════

  private buildKPIs(): void {
    const a = this.filteredAssets;
    this.totalAssets = a.length;
    this.assignedCount = a.filter(x => x.statusName === 'Assigned').length;
    this.availableCount = a.filter(x => x.statusName === 'Available').length;
    this.inServiceCount = a.filter(x => x.statusName === 'InService').length;
    this.retiredCount = a.filter(x => x.statusName === 'Retired').length;
    this.lostCount = a.filter(x => x.statusName === 'Lost').length;
    this.categoryCount = new Set(a.map(x => x.category)).size;
    this.brandCount = new Set(a.map(x => x.brand)).size;
    this.modelCount = new Set(a.map(x => x.model)).size;
  }

  private buildServiceKPIs(): void {
    const r = this.allServiceRequests;
    this.serviceOpen = r.filter(x => x.status === 'Open').length;
    this.serviceInProgress = r.filter(x => x.status === 'InProgress').length;
    this.serviceResolved = r.filter(x => x.status === 'Resolved').length;
    this.serviceTotal = r.length;
  }

  private buildWarrantyStats(): void {
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    this.warrantyActive = this.filteredAssets.filter(a => new Date(a.warrantyEndDate) > thirtyDays).length;
    this.warrantyExpiring = this.filteredAssets.filter(a => {
      const end = new Date(a.warrantyEndDate);
      return end >= today && end <= thirtyDays;
    }).length;
    this.warrantyExpired = this.filteredAssets.filter(a => new Date(a.warrantyEndDate) < today).length;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER CHARTS (Direct ApexCharts — No Wrapper)
  // ═══════════════════════════════════════════════════════════════════════════════

  private renderAllCharts(): void {
    this.destroyCharts();
    this.renderStatusChart();
    this.renderCategoryChart();
    this.renderBrandChart();
    this.renderWarrantyChart();
  }

  // ─── Status Donut ──────────────────────────────────────────────────────────────

  private renderStatusChart(): void {
    const el = document.getElementById('statusChart');
    if (!el) return;

    const grouped = this.groupBy(this.filteredAssets, 'statusName');
    if (grouped.length === 0) { el.innerHTML = '<p class="empty-chart">No data</p>'; return; }

    const labels = grouped.map(g => g.label);

    this.statusChart = new ApexCharts(el, {
      chart: {
        type: 'donut',
        height: 320,
        events: {
          dataPointSelection: (_e: any, _ctx: any, cfg: any) => {
            this.onStatusClick(labels[cfg.dataPointIndex]);
          }
        }
      },
      series: grouped.map(g => g.count),
      labels: labels,
      colors: grouped.map(g => this.statusColorMap[g.label] || '#607d8b'),
      legend: { position: 'bottom', fontSize: '13px' },
      plotOptions: { pie: { donut: { size: '60%' } } },
      dataLabels: { enabled: true }
    });
    this.statusChart.render();
  }

  // ─── Category Bar ──────────────────────────────────────────────────────────────

  private renderCategoryChart(): void {
    const el = document.getElementById('categoryChart');
    if (!el) return;

    const grouped = this.groupBy(this.filteredAssets, 'category');
    if (grouped.length === 0) { el.innerHTML = '<p class="empty-chart">No data</p>'; return; }

    const labels = grouped.map(g => g.label);

    this.categoryChart = new ApexCharts(el, {
      chart: {
        type: 'bar',
        height: 320,
        events: {
          dataPointSelection: (_e: any, _ctx: any, cfg: any) => {
            this.onCategoryClick(labels[cfg.dataPointIndex]);
          }
        }
      },
      series: [{ name: 'Assets', data: grouped.map(g => g.count) }],
      xaxis: { categories: labels },
      yaxis: { title: { text: 'Count' } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', distributed: true } },
      dataLabels: { enabled: true },
      colors: ['#1565c0', '#2e7d32', '#e65100', '#7b1fa2', '#c62828', '#00838f', '#4527a0', '#558b2f'],
      legend: { show: false }
    });
    this.categoryChart.render();
  }

  // ─── Brand Horizontal Bar ──────────────────────────────────────────────────────

  private renderBrandChart(): void {
    const el = document.getElementById('brandChart');
    if (!el) return;

    const grouped = this.groupBy(this.filteredAssets, 'brand');
    if (grouped.length === 0) { el.innerHTML = '<p class="empty-chart">No data</p>'; return; }

    const labels = grouped.map(g => g.label);

    this.brandChart = new ApexCharts(el, {
      chart: {
        type: 'bar',
        height: Math.max(320, grouped.length * 40),
        events: {
          dataPointSelection: (_e: any, _ctx: any, cfg: any) => {
            this.onBrandClick(labels[cfg.dataPointIndex]);
          }
        }
      },
      series: [{ name: 'Assets', data: grouped.map(g => g.count) }],
      xaxis: { categories: labels },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%', distributed: true } },
      dataLabels: { enabled: true },
      colors: ['#0072a3', '#00897b', '#5c6bc0', '#ef6c00', '#8e24aa', '#d81b60', '#43a047', '#f4511e'],
      legend: { show: false }
    });
    this.brandChart.render();
  }

  // ─── Warranty Donut ────────────────────────────────────────────────────────────

  private renderWarrantyChart(): void {
    const el = document.getElementById('warrantyChart');
    if (!el) return;

    this.warrantyChart = new ApexCharts(el, {
      chart: {
        type: 'donut',
        height: 300,
        events: {
          dataPointSelection: (_e: any, _ctx: any, cfg: any) => {
            const map: Record<number, string> = { 0: 'Active', 1: 'Expiring', 2: 'Expired' };
            this.onWarrantyClick(map[cfg.dataPointIndex]);
          }
        }
      },
      series: [this.warrantyActive, this.warrantyExpiring, this.warrantyExpired],
      labels: ['Active', 'Expiring Soon', 'Expired'],
      colors: ['#4caf50', '#ff9800', '#f44336'],
      legend: { position: 'right', fontSize: '14px' },
      plotOptions: { pie: { donut: { size: '55%' } } },
      dataLabels: { enabled: true }
    });
    this.warrantyChart.render();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FILTER EVENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  onFilterChange(): void {
    this.applyFilters();
  }

  onCategoryClick(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? null : category;
    this.selectedBrand = null;
    this.selectedModel = null;
    this.applyFilters();
  }

  onBrandClick(brand: string): void {
    this.selectedBrand = this.selectedBrand === brand ? null : brand;
    this.selectedModel = null;
    this.applyFilters();
  }

  onStatusClick(status: string): void {
    this.selectedStatus = this.selectedStatus === status ? null : status;
    this.applyFilters();
  }

  onWarrantyClick(warranty: string): void {
    this.selectedWarranty = this.selectedWarranty === warranty ? null : warranty;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.selectedBrand = null;
    this.selectedModel = null;
    this.selectedStatus = null;
    this.selectedLocation = null;
    this.selectedWarranty = null;
    this.buildFilterOptions();
    this.applyFilters();
  }

  removeFilter(key: string): void {
    switch (key) {
      case 'category': this.selectedCategory = null; this.selectedBrand = null; this.selectedModel = null; break;
      case 'brand': this.selectedBrand = null; this.selectedModel = null; break;
      case 'model': this.selectedModel = null; break;
      case 'status': this.selectedStatus = null; break;
      case 'location': this.selectedLocation = null; break;
      case 'warranty': this.selectedWarranty = null; break;
    }
    this.buildFilterOptions();
    this.applyFilters();
  }

  private updateDependentFilters(): void {
    if (this.selectedCategory) {
      const catAssets = this.allAssets.filter(a => a.category === this.selectedCategory);
      this.brandOptions = [...new Set(catAssets.map(a => a.brand))].sort();
      this.modelOptions = this.selectedBrand
        ? [...new Set(catAssets.filter(a => a.brand === this.selectedBrand).map(a => a.model))].sort()
        : [...new Set(catAssets.map(a => a.model))].sort();
    } else {
      this.brandOptions = [...new Set(this.allAssets.map(a => a.brand))].sort();
      this.modelOptions = [...new Set(this.allAssets.map(a => a.model))].sort();
    }
  }

  get activeFilters(): { key: string; value: string }[] {
    const filters: { key: string; value: string }[] = [];
    if (this.selectedCategory) filters.push({ key: 'category', value: this.selectedCategory });
    if (this.selectedBrand) filters.push({ key: 'brand', value: this.selectedBrand });
    if (this.selectedModel) filters.push({ key: 'model', value: this.selectedModel });
    if (this.selectedStatus) filters.push({ key: 'status', value: this.selectedStatus });
    if (this.selectedLocation) filters.push({ key: 'location', value: this.selectedLocation });
    if (this.selectedWarranty) filters.push({ key: 'warranty', value: this.selectedWarranty });
    return filters;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════════

  goToAsset(id: string): void {
    this.router.navigate(['/asset-inventory', id]);
  }

  goToService(id: string): void {
    this.router.navigate(['/service-requests', id]);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TABLE SEARCH
  // ═══════════════════════════════════════════════════════════════════════════════

  get searchedAssets(): AssetListDto[] {
    if (!this.searchText.trim()) return this.filteredAssets;
    const s = this.searchText.toLowerCase();
    return this.filteredAssets.filter(a =>
      a.assetTag.toLowerCase().includes(s) ||
      a.serialNumber.toLowerCase().includes(s) ||
      a.category.toLowerCase().includes(s) ||
      a.brand.toLowerCase().includes(s) ||
      a.model.toLowerCase().includes(s)
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════════

  private groupBy(data: any[], key: string): { label: string; count: number }[] {
    const map = new Map<string, number>();
    data.forEach(item => {
      const val = item[key] || 'Unknown';
      map.set(val, (map.get(val) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Available': 'status-available', 'Assigned': 'status-assigned',
      'InService': 'status-inservice', 'Retired': 'status-retired', 'Lost': 'status-lost'
    };
    return map[status] || '';
  }

  getServiceStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Open': 'svc-open', 'InProgress': 'svc-progress', 'Resolved': 'svc-resolved'
    };
    return map[status] || '';
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      'Low': 'priority-low', 'Medium': 'priority-medium',
      'High': 'priority-high', 'Critical': 'priority-critical'
    };
    return map[priority] || '';
  }
}