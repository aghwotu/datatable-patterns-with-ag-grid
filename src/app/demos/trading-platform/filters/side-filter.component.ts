import { Component } from '@angular/core';
import { IFloatingFilterAngularComp } from 'ag-grid-angular';
import { IFloatingFilterParams } from 'ag-grid-community';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '@shared/menus/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-side-filter',
  imports: [DropdownMenuComponent],
  template: `
    <app-dropdown-menu
      [label]="selectedLabel"
      [items]="filterOptions"
      (itemSelected)="onFilterChange($event)"
      [size]="'xs'"
      [variant]="'outline'"
      [menuWidth]="'w-28'"
      [menuFontSize]="'text-xs'"
      [radius]="'md'"
    />
  `,
})
export class SideFilterComponent implements IFloatingFilterAngularComp {
  private params!: IFloatingFilterParams;
  selectedLabel = 'All Sides';

  filterOptions: DropdownMenuItem<string>[] = [
    { label: 'All Sides', value: 'All' },
    { label: '🟢 Buy', value: 'Buy' },
    { label: '🔴 Sell', value: 'Sell' },
  ];

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onParentModelChanged(): void {
    // Not used in server-side filtering
  }

  onFilterChange(value: string): void {
    const option = this.filterOptions.find((o) => o.value === value);
    this.selectedLabel = option?.label || 'All Sides';

    this.params.api.dispatchEvent({
      type: 'filterChanged',
      source: 'floatingFilter',
    } as any);

    (this.params.column as any).sideFilter = value === 'All' ? undefined : value;
  }
}
