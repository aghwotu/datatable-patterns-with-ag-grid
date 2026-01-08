import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ObservabilityEvent, TimingPhases } from '../services/observability-api.service';

@Component({
  selector: 'app-timing-phases-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2">
      <div class="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden flex">
        <div
          *ngFor="let segment of segments"
          class="h-full"
          [ngStyle]="{ width: segment.width, background: segment.color }"
        ></div>
      </div>
      <div class="hidden xl:flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full" [style.background]="colors.dns"></span> DNS
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full" [style.background]="colors.connection"></span>
          Connection
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full" [style.background]="colors.tls"></span> TLS
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full" [style.background]="colors.ttfb"></span> TTFB
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full" [style.background]="colors.transfer"></span> Transfer
        </span>
      </div>
    </div>
  `,
})
export class TimingPhasesCellComponent implements ICellRendererAngularComp {
  @Input() value: TimingPhases | null = null;

  colors = {
    dns: '#22d3ee',
    connection: '#38bdf8',
    tls: '#818cf8',
    ttfb: '#a855f7',
    transfer: '#22c55e',
  };

  get segments() {
    const phases = this.value;
    if (!phases) return [];
    const total = Math.max(
      phases.dns + phases.connection + phases.tls + phases.ttfb + phases.transfer,
      1
    );
    return [
      { width: `${(phases.dns / total) * 100}%`, color: this.colors.dns },
      { width: `${(phases.connection / total) * 100}%`, color: this.colors.connection },
      { width: `${(phases.tls / total) * 100}%`, color: this.colors.tls },
      { width: `${(phases.ttfb / total) * 100}%`, color: this.colors.ttfb },
      { width: `${(phases.transfer / total) * 100}%`, color: this.colors.transfer },
    ];
  }

  agInit(params: ICellRendererParams<ObservabilityEvent>): void {
    this.value = params.data?.timing ?? null;
  }

  refresh(params: ICellRendererParams<ObservabilityEvent>): boolean {
    this.value = params.data?.timing ?? null;
    return true;
  }
}
