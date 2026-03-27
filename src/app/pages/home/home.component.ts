import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoService, Demo } from '../../services/demo.service';
import { BadgeComponent } from '@shared/components/badge/badge.component';

interface Highlight {
  title: string;
  description: string;
  iconPath: string;
  iconContainerClass: string;
  link?: { text: string; href: string; suffix: string };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <!-- Header -->
      <header class="border-b border-zinc-800/40 backdrop-blur-md bg-zinc-950/70 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="w-7 h-7 rounded-lg bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </div>
            <span class="text-sm font-semibold tracking-tight text-zinc-200">AG-Grid Patterns</span>
          </div>
          <nav class="flex items-center gap-5">
            <a
              href="https://github.com/aghwotu/datatable-patterns-with-ag-grid"
              target="_blank"
              rel="noopener noreferrer"
              class="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <svg class="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              <span class="sr-only">GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section class="relative overflow-hidden border-b border-zinc-800/40">
        <!-- Dot grid background -->
        <div class="absolute inset-0 hero-dot-grid opacity-40"></div>
        <!-- Radial glow -->
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.12),transparent)]"
        ></div>

        <div class="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div class="max-w-3xl">
            <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8 tracking-wide uppercase"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              AG-Grid · Angular 21 · Tailwind 4
            </div>
            <h1 class="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              <span class="text-zinc-100">Production Table</span><br />
              <span class="bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
                >Patterns</span
              >
            </h1>
            <p class="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
              Toggle features in isolation to evaluate their UX trade-offs, then see how they
              compose into a dense, real-world data table.
            </p>
            <div class="flex items-center gap-4">
              <a
                [routerLink]="['/demo', demos[0]?.id]"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-sm transition-colors"
              >
                Explore demos
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
              <a
                href="#about"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 font-medium text-sm border border-zinc-700/50 transition-colors"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Demos -->
      <main class="max-w-6xl mx-auto px-6 py-16">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-sm font-medium text-zinc-500 uppercase tracking-widest">Demos</h2>
          <span class="text-sm text-zinc-600">{{ demos.length }} tables</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          @for (demo of demos; track demo.id; let idx = $index) {
            <a
              [routerLink]="['/demo', demo.id]"
              class="group block h-full"
              [style.view-transition-name]="'demo-card-' + demo.id"
            >
              <article
                class="relative h-full flex flex-col bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden transition-all duration-200 hover:border-zinc-700/80 hover:bg-zinc-900/70 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
              >
                <!-- Preview -->
                <div
                  class="h-48 relative overflow-hidden"
                  [class]="!demo.previewImage ? 'bg-linear-to-br ' + demo.previewGradient : ''"
                  [style.view-transition-name]="'demo-preview-' + demo.id"
                >
                  @if (demo.previewImage) {
                    <img
                      [src]="demo.previewImage"
                      [alt]="demo.title + ' preview'"
                      class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="eager"
                      onerror="this.style.display='none'"
                    />
                  } @else {
                    <div class="absolute inset-0 opacity-15">
                      <div class="grid grid-cols-6 gap-px h-full p-5">
                        @for (i of gridItems; track i) {
                          <div class="bg-white/30 rounded-sm"></div>
                        }
                      </div>
                    </div>
                  }
                  <div
                    class="absolute inset-0 bg-linear-to-t from-zinc-900/80 via-transparent to-transparent"
                  ></div>
                  <!-- Index number -->
                  <div
                    class="absolute top-4 left-4 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  >
                    <span class="text-xs font-mono font-semibold text-zinc-400">{{
                      (idx + 1).toString().padStart(2, '0')
                    }}</span>
                  </div>
                  <!-- Arrow -->
                  <div
                    class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-5 flex-1 flex flex-col">
                  <div class="flex items-center gap-2.5 mb-2">
                    <h3
                      class="text-base font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors"
                      [style.view-transition-name]="'demo-title-' + demo.id"
                    >
                      {{ demo.title }}
                    </h3>
                    @if (demo.isWip) {
                      <app-badge text="WIP" variant="yellow"></app-badge>
                    }
                  </div>
                  <p class="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-4">
                    {{ demo.description }}
                  </p>
                  <div class="flex flex-wrap gap-1.5 mt-auto">
                    @for (tag of demo.tags; track tag) {
                      <span
                        class="px-2 py-0.5 text-xs font-medium rounded-md bg-zinc-800/80 text-zinc-500 border border-zinc-700/30"
                      >
                        {{ tag }}
                      </span>
                    }
                  </div>
                </div>
              </article>
            </a>
          }
        </div>

        <!-- Highlights -->
        <div
          class="mt-20 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60 border border-zinc-800/60 rounded-2xl overflow-hidden"
        >
          @for (highlight of highlights; track highlight.title) {
            <div class="flex items-start gap-4 p-6">
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                [class]="highlight.iconContainerClass"
              >
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    [attr.d]="highlight.iconPath"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-zinc-200 mb-1">{{ highlight.title }}</h3>
                <p class="text-sm text-zinc-500 leading-relaxed">
                  {{ highlight.description }}
                  @if (highlight.link) {
                    <a
                      [href]="highlight.link.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
                      >{{ highlight.link.text }}</a
                    >{{ highlight.link.suffix }}
                  }
                </p>
              </div>
            </div>
          }
        </div>

        <!-- About -->
        <section id="about" class="mt-10 scroll-mt-20">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-sm font-medium text-zinc-500 uppercase tracking-widest">About</h2>
          </div>

          <!-- Tech stack -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-5">
            @for (tech of techStack; track tech.name) {
              <div
                class="flex flex-col gap-1 p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-xl"
              >
                <span class="text-xs font-semibold text-zinc-200">{{ tech.name }}</span>
                <span class="text-xs text-zinc-600 font-mono">{{ tech.version }}</span>
              </div>
            }
          </div>

          <!-- Notes grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
              <h3 class="text-sm font-semibold text-zinc-200 mb-2">AG-Grid Community</h3>
              <p class="text-sm text-zinc-500 leading-relaxed">
                Intentionally uses
                <a
                  href="https://ag-grid.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
                  >AG-Grid</a
                >
                <span class="text-zinc-300">Community</span> only — no Enterprise features — to keep
                the patterns broadly applicable.
              </p>
            </div>
            <div class="p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
              <h3 class="text-sm font-semibold text-zinc-200 mb-2">State model</h3>
              <p class="text-sm text-zinc-500 leading-relaxed">
                Signals hold synchronous UI state (filters, toggles, grid config). Computeds derive
                row data and columns; effects bridge updates into AG-Grid when state changes.
              </p>
            </div>
            <div class="p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
              <h3 class="text-sm font-semibold text-zinc-200 mb-2">Reusable UI</h3>
              <p class="text-sm text-zinc-500 leading-relaxed">
                Menus and popovers follow Angular CDK patterns (overlay + accessibility) and reuse
                components from
                <a
                  href="https://mango-ui-components.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
                  >Mango UI</a
                >.
              </p>
            </div>
            <div class="p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
              <h3 class="text-sm font-semibold text-zinc-200 mb-2">Attribution</h3>
              <p class="text-sm text-zinc-500 leading-relaxed">
                The observability table is inspired by
                <a
                  href="https://data-table.openstatus.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-cyan-400 hover:text-cyan-300 underline decoration-dotted"
                  >OpenStatus' React data-table</a
                >, adapted into Angular + AG-Grid.
              </p>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="border-t border-zinc-800/40 mt-4">
        <div
          class="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p class="text-xs text-zinc-600">AG-Grid Production Patterns · Angular · Tailwind 4</p>
          <div class="flex items-center gap-5">
            <a
              href="https://github.com/aghwotu/datatable-patterns-with-ag-grid"
              target="_blank"
              rel="noopener noreferrer"
              class="text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
              class="text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
              class="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
              >Portfolio</a
            >
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .hero-dot-grid {
      background-image: radial-gradient(circle, rgb(63 63 70 / 0.6) 1px, transparent 1px);
      background-size: 24px 24px;
    }
  `,
})
export class HomeComponent {
  private demoService = inject(DemoService);
  demos: Demo[] = this.demoService.getDemos();

  readonly gridItems = Array.from({ length: 18 }, (_, i) => i);

  readonly techStack = [
    { name: 'Angular', version: '21.0.7' },
    { name: 'Angular CDK', version: '21.0.5' },
    { name: 'AG-Grid Community', version: '35.0.0' },
    { name: 'Tailwind CSS', version: '4.1.12' },
    { name: 'TypeScript', version: '5.9.2' },
    { name: 'Signals', version: 'Built-in' },
  ];

  readonly highlights: Highlight[] = [
    {
      title: 'Feature Isolation',
      description: 'Understand UX trade-offs by toggling features in a controlled environment.',
      iconPath:
        'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      iconContainerClass: 'bg-cyan-500/10 text-cyan-400',
    },
    {
      title: 'Production Constraints',
      description: 'Dense data, conditional actions, and operational monitoring patterns.',
      iconPath:
        'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      iconContainerClass: 'bg-sky-500/10 text-sky-400',
    },
    {
      title: 'Modern Stack',
      description: 'Angular 21 · Signals · ',
      iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      iconContainerClass: 'bg-violet-500/10 text-violet-400',
      link: {
        text: 'AG-Grid Community 35',
        href: 'https://ag-grid.com/',
        suffix: ' · Angular CDK · Tailwind 4',
      },
    },
  ];
}
