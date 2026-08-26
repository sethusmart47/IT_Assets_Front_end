import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ASSET_CONDITION_OPTIONS, AssetListDto, UpdateAssetDto } from '../../../models/Asset';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../../Services/asset.service';

@Component({
  selector: 'app-asset-edit-modal',
  standalone: true,
  imports: [ClarityModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './asset-edit-modal.component.html',
  styleUrl: './asset-edit-modal.component.css'
})
export class AssetEditModalComponent {
@Input() isOpen = false;
  @Input() asset: AssetListDto | any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  editForm: FormGroup;
  conditionOptions = ASSET_CONDITION_OPTIONS;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private assetService: AssetService
  ) {
    this.editForm = this.fb.group({
      condition: [1, Validators.required],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    if (this.asset) {
      this.editForm.patchValue({
        condition: this.asset.condition,
        remarks: this.asset.remarks || ''
      });
    }
  }

  onSave(): void {
    if (this.editForm.invalid || !this.asset) return;

    this.saving = true;
    const dto: UpdateAssetDto = {
      condition: this.editForm.get('condition')?.value,
      remarks: this.editForm.get('remarks')?.value || null
    };

    this.assetService.update(this.asset.id, dto).subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
