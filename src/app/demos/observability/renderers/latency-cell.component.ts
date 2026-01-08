import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ObservabilityEvent } from '../services/observability-api.service';

@Component({
  selector: 'app-latency-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-end gap-2 font-mono text-sm" [ngClass]="textClass">
      <span>{{ formatted }}</span>
    </div>
  `,
})
export class LatencyCellComponent implements ICellRendererAngularComp {
  @Input() value = 0;

  get formatted(): string {
    return `${this.value}ms`;
  }

  get textClass(): string {
    const val = this.value;
    if (val >= 1300) return 'text-rose-200';
    if (val >= 1100) return 'text-amber-200';
    return 'text-emerald-200';
  }

  agInit(params: ICellRendererParams<ObservabilityEvent>): void {
    this.value = params.data?.latencyMs ?? params.value ?? 0;
  }

  refresh(params: ICellRendererParams<ObservabilityEvent>): boolean {
    this.value = params.data?.latencyMs ?? params.value ?? 0;
    return true;
  }
}
