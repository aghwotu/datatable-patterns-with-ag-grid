import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoService, Demo } from '../../services/demo.service';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <!-- Header -->
      <header class="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-6 py-5">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold tracking-tight">AG-Grid Production Patterns</h1>
              <p class="text-sm text-zinc-500">Real-world table design decisions, demonstrated</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-6 py-16">
        <div class="mb-14 text-center">
          <h2
            class="text-4xl font-bold mb-4 bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent"
          >
            AG-Grid Tables.
          </h2>
          <p class="text-zinc-400 max-w-2xl mx-auto text-lg">
            Explore AG-Grid features in isolation, then see how they combine under real
            constraints—dense data, conditional actions, and operational monitoring.
          </p>
        </div>

        <!-- Table Cards: 2-Column Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          @for (demo of demos; track demo.id) {
          <a
            [routerLink]="['/demo', demo.id]"
            class="group block h-full"
            [style.view-transition-name]="'demo-card-' + demo.id"
          >
            <article
              class="relative h-full flex flex-col bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"
            >
              <!-- Preview Gradient -->
              <div
                class="h-52 bg-linear-to-br {{ demo.previewGradient }} relative overflow-hidden"
                [style.view-transition-name]="'demo-preview-' + demo.id"
              >
                <!-- Grid Pattern Overlay -->
                <div class="absolute inset-0 opacity-20">
                  <div class="grid grid-cols-5 gap-px h-full p-6">
                    @for (i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; track i) {
                    <div class="bg-white/20 rounded-sm"></div>
                    }
                  </div>
                </div>
                <!-- Glow Effect -->
                <div
                  class="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent opacity-60"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
                ></div>
              </div>

              <!-- Content -->
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center gap-3 mb-3">
                  <h3
                    class="text-xl font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors"
                    [style.view-transition-name]="'demo-title-' + demo.id"
                  >
                    {{ demo.title }}
                  </h3>
                  @if (demo.isWip) {
                  <app-badge text="WIP" variant="yellow"></app-badge>
                  }
                </div>
                <p class="text-zinc-400 mb-4 leading-relaxed">
                  {{ demo.description }}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-800/50">
                  @for (tag of demo.tags; track tag) {
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                  >
                    {{ tag }}
                  </span>
                  }
                </div>
              </div>

              <!-- Arrow Indicator -->
              <div
                class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </article>
          </a>
          }
        </div>

        <!-- Feature Highlights -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-6">
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-zinc-100 mb-2">Feature Isolation</h3>
            <p class="text-sm text-zinc-500">
              Understand UX trade-offs by toggling features in a controlled environment.
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-zinc-100 mb-2">Production Constraints</h3>
            <p class="text-sm text-zinc-500">
              Dense data, conditional actions, and operational monitoring patterns.
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-zinc-100 mb-2">Modern Stack</h3>
            <p class="text-sm text-zinc-500">
              Angular 21 · Signals ·
              <a
                href="https://ag-grid.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
              >
                AG-Grid Community 35
              </a>
              · Angular CDK · Tailwind 4
            </p>
          </div>
        </div>

        <!-- Design Notes -->
        <section class="mt-20">
          <div
            class="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden"
            [style.view-transition-name]="'design-notes-teaser'"
          >
            <div class="p-8 md:p-10">
              <div class="flex items-start justify-between gap-6 flex-wrap">
                <div class="max-w-2xl">
                  <h3 class="text-2xl font-semibold text-zinc-100 mb-2">Design Notes</h3>
                  <p class="text-zinc-400">
                    A quick overview of the architecture choices and trade-offs behind these tables.
                  </p>
                </div>
                <a
                  routerLink="/design-notes"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/20 hover:border-cyan-300/30 transition-colors text-sm font-medium"
                >
                  Read the full notes
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-5">
                  <div class="text-sm font-semibold text-zinc-100 mb-2">AG-Grid Community</div>
                  <div class="text-sm text-zinc-400 leading-relaxed">
                    These tables use
                    <a
                      href="https://ag-grid.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
                    >
                      AG-Grid
                    </a>
                    <span class="text-zinc-200 font-medium">Community</span>
                    (no Enterprise features), to keep the patterns broadly applicable.
                  </div>
                </div>
                <div class="rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-5">
                  <div class="text-sm font-semibold text-zinc-100 mb-2">
                    Signals as the state backbone
                  </div>
                  <div class="text-sm text-zinc-400 leading-relaxed">
                    Grid configuration and filters are synchronous UI state; signals keep updates
                    predictable and fine-grained without RxJS overhead.
                  </div>
                </div>
                <div class="rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-5">
                  <div class="text-sm font-semibold text-zinc-100 mb-2">
                    Reusable UI (CDK + Mango UI)
                  </div>
                  <div class="text-sm text-zinc-400 leading-relaxed">
                    Menus and popovers are built with Angular CDK patterns and reuse components from
                    Mango UI.
                  </div>
                </div>
                <div class="rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-5">
                  <div class="text-sm font-semibold text-zinc-100 mb-2">Attribution</div>
                  <div class="text-sm text-zinc-400 leading-relaxed">
                    Observability table is inspired by the OpenStatus React data-table.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="border-t border-zinc-800/50 mt-10">
        <div class="max-w-6xl mx-auto px-6 py-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <p class="text-sm text-zinc-500">
                Angular 21 · Signals ·
                <a
                  href="https://ag-grid.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
                >
                  AG-Grid Community 35
                </a>
                · CDK · Tailwind 4
              </p>
              <span class="text-zinc-700">·</span>
              <a
                routerLink="/design-notes"
                class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Design Notes →
              </a>
            </div>
            <div class="flex items-center gap-4">
              <a
                href="https://github.com/aghwotu"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <span class="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/aghwotu-ovuoke/"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                <span class="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://orvorkay.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
              >
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class HomeComponent {
  private demoService = inject(DemoService);
  demos: Demo[] = this.demoService.getDemos();
}
