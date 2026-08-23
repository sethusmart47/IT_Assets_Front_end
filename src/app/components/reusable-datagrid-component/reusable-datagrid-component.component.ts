import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatagridColumn } from '../../models/model';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-reusable-datagrid',
  standalone: true,
  imports: [CommonModule,ClarityModule],
  templateUrl: './reusable-datagrid-component.component.html',
  styleUrl: './reusable-datagrid-component.component.css'
})
export class ReusableDatagridComponentComponent {
 @Input() columns: DatagridColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() showSerialNo: boolean = true;
  @Input() showActions: boolean = true;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  currentPage: number = 1;

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  get totalItems(): number {
    return this.data.length;
  }

  editItem(item: any): void {
    this.onEdit.emit(item);
  }

  deleteItem(item: any): void {
    this.onDelete.emit(item);
  }

  getSerialNo(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

}
