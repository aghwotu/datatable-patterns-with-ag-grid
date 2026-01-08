import { Component } from '@angular/core';
import { IFloatingFilterAngularComp } from 'ag-grid-angular';
import { IFloatingFilterParams } from 'ag-grid-community';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '@shared/menus/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-order-type-filter',
  imports: [DropdownMenuComponent],
  template: `
    <app-dropdown-menu
      [label]="selectedLabel"
      [items]="filterOptions"
      (itemSelected)="onFilterChange($event)"
      [size]="'xs'"
      [variant]="'outline'"
      [menuWidth]="'w-32'"
      [menuFontSize]="'text-xs'"
      [radius]="'md'"
    />
  `,
})
export class OrderTypeFilterComponent implements IFloatingFilterAngularComp {
  private params!: IFloatingFilterParams;
  selectedLabel = 'All Types';

  filterOptions: DropdownMenuItem<string>[] = [
    { label: 'All Types', value: 'All' },
    { label: 'Market', value: 'Market' },
    { label: 'Limit', value: 'Limit' },
    { label: 'Stop', value: 'Stop' },
  ];

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onParentModelChanged(): void {
    // Not used in server-side filtering
  }

  onFilterChange(value: string): void {
    const option = this.filterOptions.find((o) => o.value === value);
    this.selectedLabel = option?.label || 'All Types';

    // Dispatch custom event for server-side filtering
    this.params.api.dispatchEvent({
      type: 'filterChanged',
      source: 'floatingFilter',
    } as any);

    // Store filter value on the column for retrieval
    (this.params.column as any).orderTypeFilter = value === 'All' ? undefined : value;
  }
}
