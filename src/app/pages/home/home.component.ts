import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoService, Demo } from '../../services/demo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <!-- Header -->
      <header class="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-5">
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
              <h1 class="text-xl font-semibold tracking-tight">Enterprise Data Table Patterns</h1>
              <p class="text-sm text-zinc-500">
                Production-style data grid implementations for data-heavy UIs
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-6 py-12">
        <div class="mb-12">
          <h2
            class="text-3xl font-bold mb-3 bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent"
          >
            Reference Scenarios
          </h2>
          <p class="text-zinc-400 max-w-2xl">
            A collection of production-style
            <a class="underline" href="https://ag-grid.com/">AG Grid</a> implementations modeling
            real-world workflows (trading, observability, internal tools, and server-driven datasets).
            Each scenario highlights UX constraints, performance considerations, and customization
            trade-offs.
          </p>
        </div>

        <!-- Demo Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (demo of demos; track demo.id) {
          <a
            [routerLink]="['/demo', demo.id]"
            class="group block h-full"
            [style.view-transition-name]="'demo-card-' + demo.id"
          >
            <article
              class="relative h-full flex flex-col bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-cyan-500/5 hover:-translate-y-1"
            >
              <!-- Preview Gradient -->
              <div
                class="h-40 bg-linear-to-br {{ demo.previewGradient }} relative overflow-hidden"
                [style.view-transition-name]="'demo-preview-' + demo.id"
              >
                <!-- Grid Pattern Overlay -->
                <div class="absolute inset-0 opacity-20">
                  <div class="grid grid-cols-4 gap-px h-full p-4">
                    @for (i of [1,2,3,4,5,6,7,8,9,10,11,12]; track i) {
                    <div class="bg-white/20 rounded-sm"></div>
                    }
                  </div>
                </div>
                <!-- Glow Effect on Hover -->
                <div
                  class="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent opacity-60"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
                ></div>
              </div>

              <!-- Content -->
              <div class="p-5 flex-1 flex flex-col">
                <h3
                  class="text-lg font-semibold mb-2 text-zinc-100 group-hover:text-cyan-400 transition-colors"
                  [style.view-transition-name]="'demo-title-' + demo.id"
                >
                  {{ demo.title }}
                </h3>
                <p class="text-sm text-zinc-400 mb-3 line-clamp-3">
                  {{ demo.description }}
                </p>
                <div class="text-xs text-zinc-500 mb-4">View details →</div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mt-auto">
                  @for (tag of demo.tags; track tag) {
                  <span
                    class="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                  >
                    {{ tag }}
                  </span>
                  }
                </div>
              </div>

              <!-- Arrow Indicator -->
              <div
                class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-4 h-4 text-white"
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
      </main>

      <!-- Footer -->
      <footer class="border-t border-zinc-800/50 mt-20">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-zinc-500">Built with Angular & AG-Grid</p>
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
                href="https://linkedin.com/in/aghwotu"
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
