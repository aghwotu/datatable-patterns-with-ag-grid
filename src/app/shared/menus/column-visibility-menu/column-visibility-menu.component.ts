import { Component, output, input, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridApi, ColDef } from 'ag-grid-community';
import { CheckboxChangeEvent, CheckboxGroupChangeEvent, CheckboxItem } from '../menu.types';
import {
  CheckboxMenuComponent,
  CheckboxMenuConfigDirective,
} from '../checkbox-menu/checkbox-menu.component';
import { ButtonConfigDirective } from '@shared/components/button/button.component';

@Component({
  selector: 'app-column-visibility-menu',
  standalone: true,
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
  // Optional: pass columnDefs to trigger refresh when they change
  columnDefs = input<(ColDef<T> | { children?: ColDef<T>[] })[]>([]);

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
    // Effect to update items when grid API or columnDefs changes
    effect(() => {
      // Track columnDefs input to trigger refresh when column structure changes
      this.columnDefs();
      this.initializeColumnItems();
    });
  }

  private initializeColumnItems(): void {
    const columns = this.gridApi().getColumnDefs();
    if (!columns) return;

    const excludedFields = new Set(this.excludeFields());
    const items: CheckboxItem[] = [];

    // Helper to extract leaf columns (handles both flat and grouped columns)
    const extractColumns = (cols: (ColDef<T> | { children?: ColDef<T>[] })[]): void => {
      for (const col of cols) {
        // Check if it's a column group with children
        if ('children' in col && col.children) {
          extractColumns(col.children);
        } else if ('field' in col && col.field) {
          const field = col.field as string;
          if (!excludedFields.has(field)) {
            items.push({
              id: field,
              label: (col as ColDef<T>).headerName || field,
              checked: !(col as ColDef<T>).hide,
              action: (event: CheckboxChangeEvent) => {
                console.log(`Column ${field} visibility changed:`, event.checked);
              },
            });
          }
        }
      }
    };

    extractColumns(columns as (ColDef<T> | { children?: ColDef<T>[] })[]);
    this.columnItems = items;
  }

  onSelectionChange(event: CheckboxGroupChangeEvent): void {
    const { changed } = event;

    // Actually update the grid column visibility
    this.gridApi().setColumnsVisible([changed.item.id], changed.checked);

    this.columnVisibilityChanged.emit({
      field: changed.item.id,
      visible: changed.checked,
    });
  }
}
