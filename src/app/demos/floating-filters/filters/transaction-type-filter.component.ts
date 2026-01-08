import { Component } from '@angular/core';
import { IFloatingFilter, IFloatingFilterParams } from 'ag-grid-community';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '@shared/menus/dropdown-menu/dropdown-menu.component';

type TransactionType = '' | 'Credit' | 'Debit' | 'Transfer';

@Component({
  selector: 'app-transaction-type-filter',
  imports: [DropdownMenuComponent],
  template: `
    <app-dropdown-menu
      [label]="selectedType || 'Type'"
      [items]="dropdownItems"
      (itemSelected)="onTypeSelect($event)"
      [size]="'xs'"
      [variant]="'outline'"
      [menuWidth]="'w-32'"
      [menuFontSize]="'text-xs'"
      [radius]="'md'"
    />
  `,
})
export class TransactionTypeFilterComponent implements IFloatingFilter {
  private params!: IFloatingFilterParams;

  selectedType = '';
  dropdownItems: DropdownMenuItem<TransactionType>[] = [
    { label: 'All Types', value: '' },
    { label: 'Credit', value: 'Credit' },
    { label: 'Debit', value: 'Debit' },
    { label: 'Transfer', value: 'Transfer' },
  ];

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onParentModelChanged(parentModel: { filter?: string } | null): void {
    if (!parentModel) {
      this.selectedType = '';
      return;
    }
    this.selectedType = parentModel.filter || '';
  }

  onTypeSelect(type: TransactionType): void {
    this.selectedType = type;

    this.params.parentFilterInstance((instance) => {
      instance.onFloatingFilterChanged('contains', this.selectedType);
    });
  }
}
