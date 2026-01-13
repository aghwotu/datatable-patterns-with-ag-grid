import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DesignNote {
  title: string;
  content: string[];
}

@Component({
  selector: 'app-design-notes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <!-- Header -->
      <header class="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-6 py-5">
          <div class="flex items-center justify-between">
            <a routerLink="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div
                class="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <p class="text-sm text-zinc-500">Design Notes</p>
              </div>
            </a>
            <a
              routerLink="/"
              class="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to tables
            </a>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-6 py-12">
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-4 text-zinc-100">Design Notes</h2>
          <p class="text-zinc-400 text-lg">
            A short, scannable overview of the architecture choices behind these tables.
          </p>
        </div>

        <!-- Tech Stack -->
        <section class="mb-12">
          <h3 class="text-xl font-semibold mb-4 text-zinc-100 flex items-center gap-2">
            <!-- <span
              class="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm"
              >1</span
            > -->
            Tech Stack
          </h3>
          <div class="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              @for (tech of techStack; track tech.name) {
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
                <div>
                  <div class="text-sm font-medium text-zinc-100">{{ tech.name }}</div>
                  <div class="text-xs text-zinc-500">{{ tech.version }}</div>
                </div>
              </div>
              }
            </div>
          </div>
        </section>

        <!-- Notes (short) -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-zinc-100 mb-2">AG-Grid Community</h3>
            <p class="text-sm text-zinc-400 leading-relaxed">
              The tables intentionally use
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
            </p>
          </div>

          <div class="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-zinc-100 mb-2">State model</h3>
            <p class="text-sm text-zinc-400 leading-relaxed">
              Signals hold synchronous UI state (filters, toggles, grid config). Computeds derive
              row data / columns; effects bridge updates into AG-Grid when state changes.
            </p>
          </div>

          <div class="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-zinc-100 mb-2">Reusable UI</h3>
            <p class="text-sm text-zinc-400 leading-relaxed">
              Menus and popovers follow Angular CDK patterns (overlay + accessibility) and reuse
              components from Mango UI.
            </p>
          </div>

          <div class="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-zinc-100 mb-2">Attribution</h3>
            <p class="text-sm text-zinc-400 leading-relaxed">
              The observability table is inspired by OpenStatus’ React data-table and adapts those
              UX ideas into an Angular + AG-Grid implementation.
            </p>
            <div class="mt-4 flex flex-wrap gap-3 text-sm">
              <a
                href="https://data-table.openstatus.dev/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
              >
                OpenStatus table (React)
              </a>
              <a
                href="https://mango-ui-components.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
              >
                Mango UI components
              </a>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="border-t border-zinc-800/50 mt-16">
        <div class="max-w-4xl mx-auto px-6 py-8">
          <div class="flex items-center justify-between">
            <a routerLink="/" class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              ← Back to tables
            </a>
            <div class="flex items-center gap-4">
              <a
                href="https://github.com/aghwotu"
                target="_blank"
                rel="noopener noreferrer"
                class="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/aghwotu-ovuoke/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
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
export class DesignNotesComponent {
  techStack = [
    { name: 'Angular', version: '21.0.7' },
    { name: 'Angular CDK', version: '21.0.5' },
    { name: 'AG-Grid Community', version: '35.0.0' },
    { name: 'Tailwind CSS', version: '4.1.12' },
    { name: 'TypeScript', version: '5.9.2' },
    { name: 'Signals', version: 'Built-in' },
  ];
}
