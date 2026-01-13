import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { BadgeComponent, BadgeVariant } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-badge-cell',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="flex items-center h-full">
      <app-badge [text]="value" [variant]="variant"></app-badge>
    </div>
  `,
})
export class BadgeCellComponent implements ICellRendererAngularComp {
  value = '';
  variant: BadgeVariant = 'gray';

  agInit(params: ICellRendererParams): void {
    this.value = params.value || '';
    this.variant = this.variantFromValue(this.value);
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value || '';
    this.variant = this.variantFromValue(this.value);
    return true;
  }

  private variantFromValue(value: string): BadgeVariant {
    // Priority mapping used by Feature Explorer demo:
    // Critical (red), High (yellow/amber), Medium (blue), Low (gray).
    switch (value) {
      case 'Critical':
        return 'red';
      case 'High':
        return 'yellow';
      case 'Medium':
        return 'blue';
      case 'Low':
        return 'gray';
      default:
        return 'gray';
    }
  }
}
