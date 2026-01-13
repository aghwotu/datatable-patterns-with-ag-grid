import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoService } from '@app/services/demo.service';

@Component({
  selector: 'app-demo-nav-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-50">
      <div class="w-full px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Back -->
          <a
            routerLink="/"
            class="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
            <span class="text-sm font-medium">Back to Demos</span>
          </a>

          @if (currentTitle()) {
          <div class="hidden md:block flex-1 text-center text-sm text-zinc-500 truncate px-4">
            {{ currentTitle() }}
          </div>
          } @else {
          <div class="flex-1"></div>
          }

          <!-- Prev / Next -->
          <nav class="flex items-center gap-2">
            <a
              [routerLink]="prevDemo() ? ['/demo', prevDemo()!.id] : null"
              [attr.aria-disabled]="prevDemo() ? null : 'true'"
              [class.pointer-events-none]="!prevDemo()"
              [class.opacity-40]="!prevDemo()"
              class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors text-sm"
              [attr.title]="prevDemo() ? 'Prev: ' + prevDemo()!.title : 'Prev demo unavailable'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span class="hidden sm:inline">Prev</span>
            </a>

            <a
              [routerLink]="nextDemo() ? ['/demo', nextDemo()!.id] : null"
              [attr.aria-disabled]="nextDemo() ? null : 'true'"
              [class.pointer-events-none]="!nextDemo()"
              [class.opacity-40]="!nextDemo()"
              class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors text-sm"
              [attr.title]="nextDemo() ? 'Next: ' + nextDemo()!.title : 'Next demo unavailable'"
            >
              <span class="hidden sm:inline">Next</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </header>
  `,
})
export class DemoNavHeaderComponent {
  private demoService = inject(DemoService);

  demoId = input.required<string>();

  currentTitle = computed(() => this.demoService.getDemoById(this.demoId())?.title ?? '');
  prevDemo = computed(() => this.demoService.getPrevDemo(this.demoId()));
  nextDemo = computed(() => this.demoService.getNextDemo(this.demoId()));
}
