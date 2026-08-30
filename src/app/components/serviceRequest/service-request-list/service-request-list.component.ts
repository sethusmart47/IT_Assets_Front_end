import { Component } from '@angular/core';
import { ServiceRequestListDto } from '../../../models/AssetService';
import { ServiceRequestService } from '../../../Services/service-request.service';
import { Router } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-request-list',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule],
  templateUrl: './service-request-list.component.html',
  styleUrl: './service-request-list.component.css'
})
export class ServiceRequestListComponent {
serviceRequests: ServiceRequestListDto[] = [];
  loading = false;
  searchText = '';

  constructor(
    private serviceRequestService: ServiceRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServiceRequests();
  }

  loadServiceRequests(): void {
    this.loading = true;
    this.serviceRequestService.getAll().subscribe({
      next: (data) => {
        this.serviceRequests = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get filteredRequests(): ServiceRequestListDto[] {
    if (!this.searchText.trim()) return this.serviceRequests;
    const search = this.searchText.toLowerCase();
    return this.serviceRequests.filter(r =>
      r.assetTag.toLowerCase().includes(search) ||
      r.serialNumber.toLowerCase().includes(search) ||
      r.category.toLowerCase().includes(search) ||
      r.issueType.toLowerCase().includes(search) ||
      r.priority.toLowerCase().includes(search) ||
      r.status.toLowerCase().includes(search) ||
      (r.vendorName && r.vendorName.toLowerCase().includes(search))
    );
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'critical': return 'priority-critical';
      case 'high':     return 'priority-high';
      case 'medium':   return 'priority-medium';
      case 'low':      return 'priority-low';
      default:         return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':       return 'status-open';
      case 'inprogress': return 'status-inprogress';
      case 'resolved':   return 'status-resolved';
      default:           return '';
    }
  }

  onCreateNew(): void {
    this.router.navigate(['/create/service']);
  }

  onView(request: ServiceRequestListDto): void {
    this.router.navigate(['/service/request', request.id]);
  }
}

