import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface BadgeConfig {
  bg: string;
  text: string;
  icon?: string;
}

@Component({
  selector: 'app-badge-cell',
  template: `
    <div class="flex items-center h-full">
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        [style.backgroundColor]="config.bg"
        [style.color]="config.text"
      >
        @if (config.icon) {
          <span [innerHTML]="config.icon"></span>
        }
        {{ value }}
      </span>
    </div>
  `,
})
export class BadgeCellComponent implements ICellRendererAngularComp {
  value = '';
  config: BadgeConfig = { bg: '#3f3f46', text: '#a1a1aa' };

  private badgeConfigs: Record<string, BadgeConfig> = {
    // Priority levels
    Critical: {
      bg: '#7f1d1d',
      text: '#fca5a5',
      icon: '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
    },
    High: {
      bg: '#7c2d12',
      text: '#fdba74',
      icon: '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/></svg>',
    },
    Medium: {
      bg: '#854d0e',
      text: '#fde047',
      icon: '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"/></svg>',
    },
    Low: {
      bg: '#14532d',
      text: '#86efac',
      icon: '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
    },
    // Account types
    Premium: {
      bg: '#581c87',
      text: '#d8b4fe',
      icon: '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>',
    },
    Business: {
      bg: '#1e3a5f',
      text: '#93c5fd',
      icon: '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/></svg>',
    },
    Standard: {
      bg: '#1f2937',
      text: '#9ca3af',
      icon: '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>',
    },
    // Risk levels
    'Low Risk': { bg: '#14532d', text: '#86efac' },
    'Medium Risk': { bg: '#854d0e', text: '#fde047' },
    'High Risk': { bg: '#7f1d1d', text: '#fca5a5' },
  };

  agInit(params: ICellRendererParams): void {
    this.value = params.value || '';
    this.config = this.badgeConfigs[this.value] || { bg: '#3f3f46', text: '#a1a1aa' };
  }

  refresh(): boolean {
    return false;
  }
}
