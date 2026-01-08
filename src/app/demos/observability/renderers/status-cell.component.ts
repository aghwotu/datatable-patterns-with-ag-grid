import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ObservabilityEvent, StatusLevel, levelFromStatus } from '../services/observability-api.service';

@Component({
  selector: 'app-status-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2 text-sm">
      <span
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold"
        [ngClass]="badgeClass"
      >
        <span class="w-2 h-2 rounded-full" [ngClass]="dotClass"></span>
        {{ status }}
      </span>
    </div>
  `,
})
export class StatusCellComponent implements ICellRendererAngularComp {
  @Input() value = 0;
  @Input() level: StatusLevel = 'success';

  get badgeClass(): string {
    if (this.level === 'error')
      return 'bg-rose-500/10 border-rose-500/50 text-rose-100';
    if (this.level === 'warning')
      return 'bg-amber-500/10 border-amber-500/50 text-amber-100';
    return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100';
  }

  get dotClass(): string {
    if (this.level === 'error') return 'bg-rose-400';
    if (this.level === 'warning') return 'bg-amber-400';
    return 'bg-emerald-400';
  }

  get status(): number | string {
    return this.value ?? '';
  }

  agInit(params: ICellRendererParams<ObservabilityEvent>): void {
    this.value = params.data?.statusCode ?? params.value ?? 0;
    this.level = levelFromStatus(params.data?.statusCode ?? params.value ?? 200);
  }

  refresh(params: ICellRendererParams<ObservabilityEvent>): boolean {
    this.value = params.data?.statusCode ?? params.value ?? 0;
    this.level = levelFromStatus(params.data?.statusCode ?? params.value ?? 200);
    return true;
  }
}
