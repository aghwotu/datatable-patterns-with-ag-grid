import { Component } from '@angular/core';
import { IFloatingFilter, IFloatingFilterParams } from 'ag-grid-community';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '@shared/menus/dropdown-menu/dropdown-menu.component';

type StatusType = '' | 'Completed' | 'Pending' | 'Processing' | 'Failed';

@Component({
  selector: 'app-status-filter',
  imports: [DropdownMenuComponent],
  template: `
    <app-dropdown-menu
      [label]="selectedStatus || 'Status'"
      [items]="dropdownItems"
      (itemSelected)="onStatusSelect($event)"
      [size]="'xs'"
      [variant]="'outline'"
      [menuWidth]="'w-36'"
      [menuFontSize]="'text-xs'"
      [radius]="'md'"
    />
  `,
})
export class StatusFilterComponent implements IFloatingFilter {
  private params!: IFloatingFilterParams;

  selectedStatus = '';
  dropdownItems: DropdownMenuItem<StatusType>[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Failed', value: 'Failed' },
  ];

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onParentModelChanged(parentModel: { filter?: string } | null): void {
    if (!parentModel) {
      this.selectedStatus = '';
      return;
    }
    this.selectedStatus = parentModel.filter || '';
  }

  onStatusSelect(status: StatusType): void {
    this.selectedStatus = status;

    this.params.parentFilterInstance((instance) => {
      instance.onFloatingFilterChanged('contains', this.selectedStatus);
    });
  }
}
