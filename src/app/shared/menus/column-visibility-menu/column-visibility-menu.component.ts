import { Component, output, input, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridApi, ColDef } from 'ag-grid-community';
import { CheckboxChangeEvent, CheckboxGroupChangeEvent, CheckboxItem } from '../menu.types';
import { CheckboxMenuComponent, CheckboxMenuConfigDirective } from '../checkbox-menu/checkbox-menu.component';
import { ButtonConfigDirective } from '@shared/components/button/button.component';

@Component({
  selector: 'app-column-visibility-menu',
  imports: [CommonModule, CheckboxMenuComponent],
  hostDirectives: [
    {
      directive: CheckboxMenuConfigDirective,
      inputs: ['menuWidth', 'menuFontSize'],
    },
    {
      directive: ButtonConfigDirective,
      inputs: ['variant', 'size', 'radius', 'weight'],
    },
  ],
  template: `
    <app-checkbox-menu
      [label]="'Toggle Columns'"
      [items]="columnItems"
      (selectionChange)="onSelectionChange($event)"
      [variant]="buttonConfig.variant()"
      [size]="buttonConfig.size()"
      [radius]="buttonConfig.radius()"
      [weight]="buttonConfig.weight()"
      [menuWidth]="checkboxConfig.menuWidth()"
      [menuFontSize]="checkboxConfig.menuFontSize()"
    />
  `,
})
export class ColumnVisibilityMenuComponent<T = unknown> {
  // Input signals
  gridApi = input.required<GridApi<T>>();
  excludeFields = input<string[]>(['rowNumber', 'actions']);

  // Injections via HostDirective
  buttonConfig = inject(ButtonConfigDirective);
  checkboxConfig = inject(CheckboxMenuConfigDirective);

  // Output signals
  columnVisibilityChanged = output<{
    field: string;
    visible: boolean;
  }>();

  // Column items state
  columnItems: CheckboxItem[] = [];

  constructor() {
    // Effect to update items when grid API changes
    effect(() => {
      this.initializeColumnItems();
    });
  }

  private initializeColumnItems(): void {
    const columns = this.gridApi().getColumnDefs();
    if (!columns) return;

    const excludedFields = new Set(this.excludeFields());

    this.columnItems = columns
      .filter((col): col is ColDef<T> => {
        if (!('field' in col) || !col.field) return false;
        const field = col.field as string;
        return !excludedFields.has(field);
      })
      .map((col) => ({
        id: col.field as string,
        label: col.headerName || (col.field as string),
        checked: !col.hide,
        action: (event: CheckboxChangeEvent) => {
          console.log(`Column ${col.field} visibility changed:`, event.checked);
        },
      }));
  }

  onSelectionChange(event: CheckboxGroupChangeEvent): void {
    const { changed } = event;
    this.columnVisibilityChanged.emit({
      field: changed.item.id,
      visible: changed.checked,
    });
  }
}
