import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-trend-cell',
  template: `
    <div class="flex items-center gap-2 h-full">
      <div class="flex items-center gap-1" [style.color]="color">
        @if (trend > 0) {
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clip-rule="evenodd"
            />
          </svg>
        } @else if (trend < 0) {
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
              clip-rule="evenodd"
            />
          </svg>
        } @else {
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        }
        <span class="text-sm font-medium">{{ formattedTrend }}</span>
      </div>
    </div>
  `,
})
export class TrendCellComponent implements ICellRendererAngularComp {
  trend = 0;
  formattedTrend = '0%';
  color = '#a1a1aa';

  agInit(params: ICellRendererParams): void {
    this.trend = params.value || 0;
    this.formattedTrend = (this.trend > 0 ? '+' : '') + this.trend.toFixed(1) + '%';
    this.color = this.trend > 0 ? '#4ade80' : this.trend < 0 ? '#f87171' : '#a1a1aa';
  }

  refresh(): boolean {
    return false;
  }
}
