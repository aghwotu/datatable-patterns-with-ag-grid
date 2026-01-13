import { Component, Directive, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ButtonComponent, ButtonConfigDirective } from '@shared/components/button/button.component';
import { MenuFontSize } from '../menu.types';
import { menuPanelAnimation } from '../animations';

export interface DropdownMenuItem<T = unknown> {
  label: string;
  value: T;
  action?: () => void;
  hidden?: boolean;
}

@Directive({
  standalone: true,
})
export class DropdownMenuConfigDirective<T = unknown> {
  items = input<DropdownMenuItem<T>[]>([]);
  label = input<string>('Options');
  menuWidth = input<string>('w-48');
  menuFontSize = input<MenuFontSize>('text-sm');
  itemSelected = output<T>();
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CdkMenu, CdkMenuItem, CdkMenuTrigger],
  hostDirectives: [
    {
      directive: ButtonConfigDirective,
      inputs: ['variant', 'size', 'radius', 'weight'],
    },
    {
      directive: DropdownMenuConfigDirective,
      inputs: ['label', 'items'],
      outputs: ['itemSelected'],
    },
  ],
  template: `
    <div class="relative inline-block text-left">
      <button
        type="button"
        [cdkMenuTriggerFor]="menuPanel"
        app-button
        [size]="buttonConfig.size()"
        [variant]="buttonConfig.variant()"
        [radius]="buttonConfig.radius()"
        [weight]="buttonConfig.weight()"
        [animate]="false"
        aria-haspopup="true"
      >
        {{ label() }}
        <svg
          class="-mr-1 size-4 text-zinc-400 translate-y-px"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
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
          class="mt-1 z-10 {{
            menuWidth()
          }} rounded-md bg-zinc-800 shadow-lg ring-1 ring-zinc-700 focus:outline-none max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain"
        >
          <div class="py-1" role="none">
            @if (items().length) { @for (item of items(); track item.label) {
            <button
              cdkMenuItem
              (cdkMenuItemTriggered)="onItemClick(item)"
              class="block w-full px-4 py-2 text-left {{
                menuFontSize()
              }} text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100"
            >
              {{ item.label }}
            </button>
            } }
          </div>
        </div>
      </ng-template>
    </div>
  `,
  animations: [menuPanelAnimation],
})
export class DropdownMenuComponent<T = unknown> extends DropdownMenuConfigDirective<T> {
  buttonConfig = inject(ButtonConfigDirective);

  onItemClick(item: DropdownMenuItem<T>): void {
    if (item.action) {
      item.action();
    }
    this.itemSelected.emit(item.value);
  }
}
