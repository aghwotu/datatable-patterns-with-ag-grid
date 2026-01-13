import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface AvatarCellParams extends ICellRendererParams {
  nameField?: string;
  emailField?: string;
  avatarField?: string;
}

@Component({
  selector: 'app-avatar-cell',
  standalone: true,
  template: `
    <div class="flex items-center gap-3 h-full">
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
        [style.backgroundColor]="avatarBgColor"
        [style.color]="avatarTextColor"
      >
        @if (avatarUrl) {
          <img [src]="avatarUrl" [alt]="name" class="w-full h-full rounded-full object-cover" />
        } @else {
          {{ initials }}
        }
      </div>
      <div class="min-w-0">
        <div class="text-zinc-100 font-medium truncate text-sm">{{ name }}</div>
        @if (email) {
          <div class="text-zinc-500 text-xs truncate">{{ email }}</div>
        }
      </div>
    </div>
  `,
})
export class AvatarCellComponent implements ICellRendererAngularComp {
  name = '';
  email = '';
  avatarUrl = '';
  initials = '';
  avatarBgColor = '';
  avatarTextColor = '#ffffff';

  private colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  ];

  agInit(params: AvatarCellParams): void {
    this.name = params.nameField ? params.data[params.nameField] : params.value || '';
    this.email = params.emailField ? params.data[params.emailField] : '';
    this.avatarUrl = params.avatarField ? params.data[params.avatarField] : '';
    this.initials = this.getInitials(this.name);
    this.avatarBgColor = this.getColorFromName(this.name);
  }

  refresh(): boolean {
    return false;
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.colors[Math.abs(hash) % this.colors.length];
  }
}
