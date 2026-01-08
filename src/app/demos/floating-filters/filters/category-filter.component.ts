import { Component } from '@angular/core';
import { IFloatingFilter, IFloatingFilterParams } from 'ag-grid-community';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '@shared/menus/dropdown-menu/dropdown-menu.component';

type CategoryType =
  | ''
  | 'Payroll'
  | 'Utilities'
  | 'Software'
  | 'Marketing'
  | 'Equipment'
  | 'Professional Services'
  | 'Revenue';

@Component({
  selector: 'app-category-filter',
  imports: [DropdownMenuComponent],
  template: `
    <app-dropdown-menu
      [label]="selectedCategory || 'Category'"
      [items]="dropdownItems"
      (itemSelected)="onCategorySelect($event)"
      [size]="'xs'"
      [variant]="'outline'"
      [menuWidth]="'w-44'"
      [menuFontSize]="'text-xs'"
      [radius]="'md'"
    />
  `,
})
export class CategoryFilterComponent implements IFloatingFilter {
  private params!: IFloatingFilterParams;

  selectedCategory = '';
  dropdownItems: DropdownMenuItem<CategoryType>[] = [
    { label: 'All Categories', value: '' },
    { label: 'Payroll', value: 'Payroll' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Software', value: 'Software' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Equipment', value: 'Equipment' },
    { label: 'Professional Services', value: 'Professional Services' },
    { label: 'Revenue', value: 'Revenue' },
  ];

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onParentModelChanged(parentModel: { filter?: string } | null): void {
    if (!parentModel) {
      this.selectedCategory = '';
      return;
    }
    this.selectedCategory = parentModel.filter || '';
  }

  onCategorySelect(category: CategoryType): void {
    this.selectedCategory = category;

    this.params.parentFilterInstance((instance) => {
      instance.onFloatingFilterChanged('contains', this.selectedCategory);
    });
  }
}
