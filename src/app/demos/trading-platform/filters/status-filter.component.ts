import { Component } from '@angular/core';
import { IFloatingFilterAngularComp } from 'ag-grid-angular';
import { IFloatingFilterParams } from 'ag-grid-community';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '@shared/menus/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-status-filter',
  imports: [DropdownMenuComponent],
  template: `
    <app-dropdown-menu
      [label]="selectedLabel"
      [items]="filterOptions"
      (itemSelected)="onFilterChange($event)"
      [size]="'xs'"
      [variant]="'outline'"
      [menuWidth]="'w-36'"
      [menuFontSize]="'text-xs'"
      [radius]="'md'"
    />
  `,
})
export class StatusFilterComponent implements IFloatingFilterAngularComp {
  private params!: IFloatingFilterParams;
  selectedLabel = 'All Status';

  filterOptions: DropdownMenuItem<string>[] = [
    { label: 'All Status', value: 'All' },
    { label: '✅ Filled', value: 'Filled' },
    { label: '⏳ Partial', value: 'Partial' },
    { label: '⏸️ Pending', value: 'Pending' },
    { label: '❌ Cancelled', value: 'Cancelled' },
  ];

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onParentModelChanged(): void {
    // Not used in server-side filtering
  }

  onFilterChange(value: string): void {
    const option = this.filterOptions.find((o) => o.value === value);
    this.selectedLabel = option?.label || 'All Status';

    this.params.api.dispatchEvent({
      type: 'filterChanged',
      source: 'floatingFilter',
    } as any);

    (this.params.column as any).statusFilter = value === 'All' ? undefined : value;
  }
}
