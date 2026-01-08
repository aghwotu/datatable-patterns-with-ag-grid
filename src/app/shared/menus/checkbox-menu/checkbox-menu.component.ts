import {
  Component,
  inject,
  signal,
  computed,
  Directive,
  input,
  output,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  CheckboxItem,
  CheckboxChangeEvent,
  CheckboxGroupChangeEvent,
  MenuFontSize,
} from '../menu.types';
import { ButtonComponent, ButtonConfigDirective } from '@shared/components/button/button.component';
import { menuPanelAnimation } from '../animations';

@Directive({
  standalone: true,
})
export class CheckboxMenuConfigDirective<T = void> {
  label = input<string>('Select options');
  items = input<CheckboxItem<T>[]>([]);
  context = input<T>(); // Optional context for dynamic item control
  menuWidth = input<string>('w-72');
  menuFontSize = input<MenuFontSize>('text-sm');
  selectionChange = output<CheckboxGroupChangeEvent<T>>(); // Emits when checkbox states change
}

@Component({
  selector: 'app-checkbox-menu',
  imports: [CommonModule, FormsModule, ButtonComponent, CdkMenu, CdkMenuItem, CdkMenuTrigger],
  hostDirectives: [
    {
      directive: ButtonConfigDirective,
      inputs: ['loading', 'disabled', 'loadingText', 'variant', 'size', 'radius', 'weight'],
    },
  ],
  template: `
    <div class="relative inline-block text-left">
      <button
        type="button"
        app-button
        [size]="buttonConfig.size()"
        [variant]="buttonConfig.variant()"
        [weight]="buttonConfig.weight()"
        [animate]="false"
        [cdkMenuTriggerFor]="menuPanel"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="'checkbox-dropdown-' + id()"
        aria-haspopup="true"
      >
        {{ label() }}
        <svg
          class="-mr-1 size-5 text-zinc-400 transition-transform duration-200"
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
          [id]="'checkbox-dropdown-' + id()"
          class="mt-1 absolute left-0 z-10 rounded-md bg-zinc-800 shadow-lg ring-1 ring-zinc-700 focus:outline-none max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain {{
            menuWidth()
          }}"
          role="menu"
          aria-orientation="vertical"
          (keydown)="handleKeydown($event)"
        >
          <fieldset class="p-4">
            <legend class="sr-only">{{ label() }} options</legend>
            <div class="space-y-2">
              @if (visibleItems().length) { @for (item of visibleItems(); track item.id) {
              <div
                class="flex gap-3"
                cdkMenuItem
                cdkMenuItemPreventClose
                (cdkMenuItemTriggered)="onMenuItemTriggered(item)"
              >
                <div class="flex h-6 shrink-0 items-center">
                  <div class="group grid size-4 grid-cols-1">
                    <input
                      [id]="item.id"
                      [name]="item.id"
                      type="checkbox"
                      [(ngModel)]="item.checked"
                      (change)="onCheckboxChange(item, $event)"
                      [disabled]="isDisabled(item)"
                      [attr.aria-describedby]="item.description ? item.id + '-description' : null"
                      class="col-start-1 row-start-1 appearance-none rounded border border-zinc-600 bg-zinc-700 checked:border-cyan-500 checked:bg-cyan-600 indeterminate:border-cyan-500 indeterminate:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:border-zinc-700 disabled:bg-zinc-800 disabled:checked:bg-zinc-700 forced-colors:appearance-auto"
                      (click)="$event.stopPropagation()"
                    />
                    <svg
                      class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        class="opacity-0 group-has-checked:opacity-100"
                        d="M3 8L6 11L11 3.5"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="text-sm/6" (click)="$event.stopPropagation()">
                  <label [for]="item.id" class="{{ menuFontSize() }} text-zinc-100">{{
                    item.label
                  }}</label>
                  @if (item.description) {
                  <span [id]="item.id + '-description'" class="text-zinc-400">
                    <span class="sr-only">{{ item.label }} </span>
                    {{ item.description }}
                  </span>
                  }
                </div>
              </div>
              } }
            </div>
          </fieldset>
        </div>
      </ng-template>
    </div>
  `,
  animations: [menuPanelAnimation],
})
export class CheckboxMenuComponent<T = void>
  extends CheckboxMenuConfigDirective<T>
  implements AfterViewInit
{
  @ViewChildren(CdkMenuItem) menuItems!: QueryList<CdkMenuItem>;
  private keyManager!: FocusKeyManager<CdkMenuItem>;

  ngAfterViewInit() {
    this.keyManager = new FocusKeyManager(this.menuItems).withWrap();
  }

  private readonly _id = signal<string>(crypto.randomUUID());
  isOpen = false;

  readonly id = computed(() => this._id());

  protected visibleItems = computed(() => {
    const currentContext = this.context();
    return this.items().filter((item) => {
      if (!item.hidden) return true;
      return !item.hidden(currentContext!);
    });
  });

  protected disabledStates = computed(() => {
    const currentContext = this.context();
    return new Map(
      this.items().map((item) => [item.id, item.disabled ? item.disabled(currentContext!) : false])
    );
  });

  protected buttonConfig = inject(ButtonConfigDirective);

  protected isDisabled(item: CheckboxItem<T>): boolean {
    return this.disabledStates().get(item.id) ?? false;
  }

  onMenuItemTriggered(item: CheckboxItem<T>): void {
    const checkbox = document.getElementById(item.id) as HTMLInputElement;
    if (checkbox) {
      checkbox.click();
    }
  }

  onCheckboxChange(item: CheckboxItem<T>, event: Event): void {
    if (this.isDisabled(item)) {
      return;
    }

    const currentIndex = this.keyManager.activeItemIndex;
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;
    const previousState = !checked;
    const allItems = this.items();

    const checkboxChangeEvent: CheckboxChangeEvent<T> = {
      item,
      checked,
      previousState,
      allItems,
    };

    if (item.action) {
      item.action(checkboxChangeEvent);
    }

    if (checked && item.onCheck) {
      item.onCheck(checkboxChangeEvent);
    } else if (!checked && item.onUncheck) {
      item.onUncheck(checkboxChangeEvent);
    }

    this.selectionChange.emit({
      items: this.items(),
      changed: checkboxChangeEvent,
    });

    if (currentIndex !== null) {
      requestAnimationFrame(() => {
        this.keyManager.setActiveItem(currentIndex);
      });
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.keyManager) {
      this.keyManager.onKeydown(event);
    }
  }
}
