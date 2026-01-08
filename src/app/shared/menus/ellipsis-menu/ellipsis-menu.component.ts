import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MenuFontSize, EllipsisActionItem } from '../menu.types';
import { menuPanelAnimation } from '../animations';

export const ORIENTATIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;

export type OrientationType = (typeof ORIENTATIONS)[keyof typeof ORIENTATIONS];

@Component({
  selector: 'app-ellipsis-menu',
  imports: [CommonModule, CdkMenu, CdkMenuItem, CdkMenuTrigger],
  template: `
    <div class="relative inline-block text-left">
      <button
        type="button"
        [cdkMenuTriggerFor]="menuPanel"
        class="flex items-center rounded-full text-zinc-400 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        aria-haspopup="true"
      >
        <span class="sr-only">Open options</span>
        <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          @if (orientation() === 'vertical') {
            <path
              d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
            />
          } @else {
            <path
              d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
            />
          }
        </svg>
      </button>

      <ng-template #menuPanel>
        <div
          [@menuPanelAnimation]
          cdkMenu
          class="z-10 {{
            menuWidth()
          }} rounded-md bg-zinc-800 shadow-lg ring-1 ring-zinc-700 focus:outline-none max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain"
        >
          <div class="py-1" role="none">
            @if (visibleActions().length) {
              @for (item of visibleActions(); track item.label) {
                <button
                  cdkMenuItem
                  (cdkMenuItemTriggered)="onMenuItemClick(item)"
                  [cdkMenuItemDisabled]="isDisabled(item)"
                  [class.cursor-not-allowed]="isDisabled(item) ? '' : null"
                  [attr.aria-disabled]="isDisabled(item) ? '' : null"
                  [attr.disabled]="isDisabled(item) ? '' : null"
                  class="block w-full px-4 py-2 text-left {{
                    menuFontSize()
                  }} text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  {{ item.label }}
                </button>
              }
            }
          </div>
        </div>
      </ng-template>
    </div>
  `,
  animations: [menuPanelAnimation],
})
export class EllipsisMenuComponent<T = unknown> {
  actions = input<EllipsisActionItem<T>[]>([]);
  menuWidth = input<string>('w-48');
  menuFontSize = input<MenuFontSize>('text-sm');
  context = input<T | undefined | null>(undefined);
  orientation = input<OrientationType>(ORIENTATIONS.VERTICAL);

  protected visibleActions = computed(() => {
    const currentContext = this.context();
    return this.actions().filter((item) => !item.hidden || !item.hidden(currentContext));
  });

  protected disabledStates = computed(() => {
    const currentContext = this.context();
    return new Map(
      this.actions().map((item) => [
        JSON.stringify(item),
        item.disabled ? item.disabled(currentContext) : false,
      ])
    );
  });

  isDisabled(item: EllipsisActionItem<T>): boolean {
    return this.disabledStates().get(JSON.stringify(item)) ?? false;
  }

  shouldHideItem(item: EllipsisActionItem<T>): boolean {
    return !!item.hidden && item.hidden(this.context());
  }

  onMenuItemClick(item: EllipsisActionItem<T>): void {
    item.action(this.context());
  }
}
