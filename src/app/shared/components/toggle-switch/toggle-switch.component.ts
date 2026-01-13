import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div
      class="group relative inline-flex w-11 shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer"
      [class]="checked() ? enabledClasses : disabledClasses"
      (click)="toggle()"
    >
      <span
        class="relative size-5 rounded-full bg-white shadow-sm ring-1 ring-zinc-900/5 transition-transform duration-200 ease-in-out"
        [class.translate-x-5]="checked()"
      >
        <!-- X icon (unchecked) -->
        <span
          aria-hidden="true"
          class="absolute inset-0 flex size-full items-center justify-center transition-opacity duration-200 ease-in"
          [class.opacity-100]="!checked()"
          [class.opacity-0]="checked()"
        >
          <svg viewBox="0 0 12 12" fill="none" class="size-3 text-zinc-400">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <!-- Check icon (checked) -->
        <span
          aria-hidden="true"
          class="absolute inset-0 flex size-full items-center justify-center transition-opacity duration-100 ease-out"
          [class.opacity-0]="!checked()"
          [class.opacity-100]="checked()"
        >
          <svg viewBox="0 0 12 12" fill="currentColor" class="size-3 text-cyan-600">
            <path
              d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
            />
          </svg>
        </span>
      </span>
    </div>
  `,
})
export class ToggleSwitchComponent {
  checked = model<boolean>(false);
  label = input<string>('');

  readonly enabledClasses = 'bg-cyan-600 ring-1 ring-cyan-500/20';
  readonly disabledClasses = 'bg-zinc-700 ring-1 ring-zinc-600/20';

  toggle(): void {
    this.checked.update((v) => !v);
  }
}
