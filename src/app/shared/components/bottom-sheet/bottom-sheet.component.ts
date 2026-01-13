import { Component, inject, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 overflow-hidden" role="dialog">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        (click)="onBackdropClick()"
      ></div>

      <!-- Sheet -->
      <div
        class="fixed inset-x-0 bottom-0 max-h-[85vh] transform overflow-y-auto rounded-t-2xl bg-zinc-900 border-t border-zinc-700/50 transition-transform"
        [@slideUpDown]="true"
      >
        <!-- Drag Handle -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-10 h-1 rounded-full bg-zinc-600"></div>
        </div>

        <!-- Header -->
        <div class="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900 px-5 py-3">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-zinc-100">
              <ng-content select="[header]"></ng-content>
            </h3>
            <button
              type="button"
              class="rounded-lg p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              (click)="dismiss()"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-5 py-4">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('250ms cubic-bezier(0.32, 0.72, 0, 1)', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.32, 0.72, 0, 1)', style({ transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class BottomSheetComponent {
  protected data = inject<unknown>(DIALOG_DATA);
  private overlayRef = inject(OverlayRef);

  @HostListener('keydown.escape')
  onEscapeKey() {
    this.dismiss();
  }

  protected onBackdropClick(): void {
    this.dismiss();
  }

  protected dismiss(): void {
    this.overlayRef.dispose();
  }
}
