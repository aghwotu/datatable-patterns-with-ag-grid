import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-progress-cell',
  template: `
    <div class="flex items-center gap-3 h-full">
      <div class="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          [style.width.%]="percentage"
          [style.backgroundColor]="progressColor"
        ></div>
      </div>
      <span class="text-xs font-medium min-w-[40px] text-right" [style.color]="progressColor">
        {{ percentage }}%
      </span>
    </div>
  `,
})
export class ProgressCellComponent implements ICellRendererAngularComp {
  percentage = 0;
  progressColor = '#4ade80';

  agInit(params: ICellRendererParams): void {
    this.percentage = Math.min(100, Math.max(0, params.value || 0));
    this.progressColor = this.getColor(this.percentage);
  }

  refresh(): boolean {
    return false;
  }

  private getColor(value: number): string {
    if (value >= 80) return '#4ade80'; // green
    if (value >= 60) return '#facc15'; // yellow
    if (value >= 40) return '#f97316'; // orange
    return '#f87171'; // red
  }
}
