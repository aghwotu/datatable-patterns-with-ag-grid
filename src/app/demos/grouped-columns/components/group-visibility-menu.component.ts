import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ColDef, ColGroupDef, GridApi } from 'ag-grid-community';
import { menuPanelAnimation } from '@shared/menus/animations';

interface ColumnGroup {
  groupId: string;
  headerName: string;
  visible: boolean;
}

@Component({
  selector: 'app-group-visibility-menu',
  imports: [CommonModule, CdkMenu, CdkMenuItem, CdkMenuTrigger],
  template: `
    <div class="relative inline-block text-left">
      <button
        type="button"
        [cdkMenuTriggerFor]="menuPanel"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
        Column Groups
        <svg class="w-4 h-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <ng-template #menuPanel>
        <div
          [@menuPanelAnimation]
          cdkMenu
          class="z-50 w-64 rounded-lg bg-zinc-800 shadow-xl ring-1 ring-zinc-700 focus:outline-none overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-zinc-700">
            <p class="text-sm font-medium text-zinc-200">Toggle Column Groups</p>
            <p class="text-xs text-zinc-500 mt-0.5">Show or hide entire column groups</p>
          </div>
          <div class="py-2">
            @for (group of columnGroups(); track group.groupId) {
              <button
                cdkMenuItem
                (cdkMenuItemTriggered)="toggleGroup(group)"
                class="flex items-center justify-between w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <span class="flex items-center gap-3">
                  <span
                    class="flex items-center justify-center w-5 h-5 rounded border transition-colors"
                    [class.bg-lime-500]="group.visible"
                    [class.border-lime-500]="group.visible"
                    [class.border-zinc-600]="!group.visible"
                  >
                    @if (group.visible) {
                      <svg class="w-3 h-3 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    }
                  </span>
                  {{ group.headerName }}
                </span>
                <span class="text-xs text-zinc-500">
                  {{ group.visible ? 'Visible' : 'Hidden' }}
                </span>
              </button>
            }
          </div>
        </div>
      </ng-template>
    </div>
  `,
  animations: [menuPanelAnimation],
})
export class GroupVisibilityMenuComponent<T> {
  gridApi = input.required<GridApi<T>>();
  columnDefs = input.required<(ColDef | ColGroupDef)[]>();
  columnDefsChange = output<(ColDef | ColGroupDef)[]>();

  columnGroups = computed<ColumnGroup[]>(() => {
    return this.columnDefs()
      .filter((col): col is ColGroupDef => 'groupId' in col && !!col.groupId)
      .map((group) => ({
        groupId: group.groupId!,
        headerName: group.headerName || group.groupId!,
        visible: !group.children?.some((child) => (child as ColDef).hide),
      }));
  });

  toggleGroup(group: ColumnGroup): void {
    const newVisible = !group.visible;
    const updatedDefs = this.columnDefs().map((col) => {
      if ('groupId' in col && col.groupId === group.groupId) {
        return {
          ...col,
          children: col.children?.map((child) => ({
            ...child,
            hide: !newVisible,
          })),
        };
      }
      return col;
    });

    this.columnDefsChange.emit(updatedDefs);
    this.gridApi().setGridOption('columnDefs', updatedDefs);
  }
}
