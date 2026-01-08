import { Component, OnDestroy, signal } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { EllipsisMenuComponent } from '../ellipsis-menu/ellipsis-menu.component';
import { EllipsisActionItem } from '../menu.types';

export interface GridAction<T> {
  label: string;
  action: (rowData: T) => void;
  hidden?: (rowData: T) => boolean;
  disabled?: (rowData: T) => boolean;
  icon?: string; // Future support for icons
}

@Component({
  selector: 'app-ag-grid-ellipsis-menu',
  imports: [EllipsisMenuComponent],
  template: `
    <app-ellipsis-menu [context]="rowData()" [actions]="getVisibleActions()" />
  `,
})
export class AgGridEllipsisMenuComponent<T extends Record<string, unknown> = Record<string, unknown>>
  implements ICellRendererAngularComp, OnDestroy
{
  rowData = signal<T | null>(null);
  private params!: ICellRendererParams & { actions: GridAction<T>[] };

  private destroy$ = new Subject<void>();

  agInit(params: ICellRendererParams & { actions: GridAction<T>[] }): void {
    if (!params.actions?.length) {
      console.warn('No actions provided to ellipsis dropdown');
    }

    this.params = params;
    this.rowData.set(params.data);
  }

  /**
   * Maps GridActions to EllipsisActionItems, handling visibility and disabled states
   */
  protected getVisibleActions(): EllipsisActionItem<T>[] {
    const data = this.rowData();
    if (!data) return [];

    return this.params.actions.map((action) => ({
      label: action.label,
      action: (rowData) => {
        if (rowData) {
          try {
            action.action(rowData);
          } catch (error) {
            console.error('Error executing action', { action, error });
          }
        }
      },
      hidden: (rowData) => (rowData ? (action.hidden ? action.hidden(rowData) : false) : true),
      disabled: (rowData) => (rowData ? (action.disabled ? action.disabled(rowData) : false) : true),
    }));
  }

  refresh(params: ICellRendererParams): boolean {
    this.rowData.set(params.data);
    return true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
