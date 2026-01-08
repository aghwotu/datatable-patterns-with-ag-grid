import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-currency-cell',
  template: `
    <div class="flex items-center h-full">
      <span class="font-mono text-sm font-semibold" [style.color]="color">
        {{ formatted }}
      </span>
    </div>
  `,
})
export class CurrencyCellComponent implements ICellRendererAngularComp {
  formatted = '$0.00';
  color = '#fafafa';

  agInit(params: ICellRendererParams): void {
    const value = params.value || 0;
    this.formatted = value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    this.color = value >= 100000 ? '#4ade80' : value >= 50000 ? '#facc15' : '#fafafa';
  }

  refresh(): boolean {
    return false;
  }
}
