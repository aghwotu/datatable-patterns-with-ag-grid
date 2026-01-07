import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoService, Demo } from '../../services/demo.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <!-- Header -->
      <header class="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-5">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
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
              <h1 class="text-xl font-semibold tracking-tight">AG-Grid Demos</h1>
              <p class="text-sm text-zinc-500">Interactive table showcases</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-6 py-12">
        <div class="mb-12">
          <h2
            class="text-3xl font-bold mb-3 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent"
          >
            Explore Demos
          </h2>
          <p class="text-zinc-400 max-w-2xl">
            Discover powerful data grid implementations. Click any card to see the full demo in
            action.
          </p>
        </div>

        <!-- Demo Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (demo of demos; track demo.id) {
          <a
            [routerLink]="['/demo', demo.id]"
            class="group block"
            [style.view-transition-name]="'demo-card-' + demo.id"
          >
            <article
              class="relative bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-cyan-500/5 hover:-translate-y-1"
            >
              <!-- Preview Gradient -->
              <div
                class="h-40 bg-gradient-to-br {{ demo.previewGradient }} relative overflow-hidden"
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
                  class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                ></div>
              </div>

              <!-- Content -->
              <div class="p-5">
                <h3
                  class="text-lg font-semibold mb-2 text-zinc-100 group-hover:text-cyan-400 transition-colors"
                  [style.view-transition-name]="'demo-title-' + demo.id"
                >
                  {{ demo.title }}
                </h3>
                <p class="text-sm text-zinc-400 mb-4 line-clamp-2">
                  {{ demo.description }}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2">
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
          <p class="text-sm text-zinc-600 text-center">Built with Angular & AG-Grid</p>
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
