import { Component } from '@angular/core';
import { ResolveServiceRequestDto, ServiceRequestDto } from '../../../models/AssetService';
import { ConfirmationService } from '../../../Services/confirmation.service';
import { ToastService } from '../../../Services/toast.service';
import { ServiceRequestService } from '../../../Services/service-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-request-detail',
  standalone: true,
  imports: [ClarityModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './service-request-detail.component.html',
  styleUrl: './service-request-detail.component.css'
})
export class ServiceRequestDetailComponent {

serviceRequest: ServiceRequestDto | null = null;
  loading = false;
  requestId = '';

  // Resolve Modal
  resolveModalOpen = false;
  resolving = false;
  resolveForm = new FormGroup({
    resolutionNotes: new FormControl<string | null>(null)
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceRequestService: ServiceRequestService,
    private toaster: ToastService,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    debugger
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    this.loadDetail();
  }

  loadDetail(): void {
    this.loading = true;
    this.serviceRequestService.getById(this.requestId).subscribe({
      next: (data) => {
        this.serviceRequest = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toaster.error('Failed to load service request.');
        this.router.navigate(['/service-requests']);
      }
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────────

  get isResolved(): boolean {
    return this.serviceRequest?.status === 'Resolved';
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

  // ─── Resolve ───────────────────────────────────────────────────────────────────

  onOpenResolveModal(): void {
    this.resolveForm.reset();
    this.resolveModalOpen = true;
  }

  onConfirmResolve(): void {
    this.confirmation.confirm(
      'Resolve Service Request',
      'Mark this service request as resolved? The asset status will be restored.',
      () => this.processResolve()
    );
  }

  private processResolve(): void {
    this.resolving = true;

    const dto: ResolveServiceRequestDto = {
      resolutionNotes: this.resolveForm.value.resolutionNotes || null
    };

    this.serviceRequestService.resolve(this.requestId, dto).subscribe({
      next: (result) => {
        this.resolving = false;
        this.resolveModalOpen = false;
        this.toaster.success(`Service request resolved. Asset status: ${result.status}`);
        this.loadDetail();
      },
      error: (err) => {
        this.resolving = false;
        this.toaster.error(err.error || 'Failed to resolve service request.');
      }
    });
  }

  // ─── Navigation ────────────────────────────────────────────────────────────────

  onBackToList(): void {
    this.router.navigate(['/service']);
  }
}
