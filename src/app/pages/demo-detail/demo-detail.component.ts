import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { DemoService, Demo } from '../../services/demo.service';
import { DemoNavHeaderComponent } from '@shared/components/demo-nav-header/demo-nav-header.component';
import { map } from 'rxjs';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-demo-detail',
  standalone: true,
  imports: [AgGridAngular, RouterLink, DemoNavHeaderComponent],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <app-demo-nav-header [demoId]="demoId()" />

      @if (demo()) {
      <!-- Demo Info Banner -->
      <div
        class="bg-linear-to-br {{ demo()!.previewGradient }} relative"
        [style.view-transition-name]="'demo-preview-' + demo()!.id"
      >
        <div
          class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              [style.view-transition-name]="'demo-title-' + demo()!.id"
            >
              {{ demo()!.title }}
            </h1>
            <p class="text-zinc-300 text-lg mb-5">
              {{ demo()!.description }}
            </p>
            <div class="flex flex-wrap gap-2">
              @for (tag of demo()!.tags; track tag) {
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                {{ tag }}
              </span>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- AG-Grid Container -->
      <div class="flex-1 p-6" [style.view-transition-name]="'demo-card-' + demo()!.id">
        <div class="max-w-7xl mx-auto h-full">
          <div
            class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden h-[500px] md:h-[600px]"
          >
            <ag-grid-angular
              class="w-full h-full"
              [theme]="theme"
              [rowData]="demo()!.rowData"
              [columnDefs]="demo()!.columnDefs"
              [defaultColDef]="defaultColDef"
              [animateRows]="true"
              [pagination]="true"
              [paginationPageSize]="10"
              [rowSelection]="rowSelection"
            />
          </div>
        </div>
      </div>
      } @else {
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-2xl font-semibold mb-2">Demo not found</h2>
          <p class="text-zinc-400 mb-6">The demo you're looking for doesn't exist.</p>
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
})
export class DemoDetailComponent {
  private route = inject(ActivatedRoute);
  private demoService = inject(DemoService);

  demoId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id') ?? '')), {
    initialValue: '',
  });

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#164e63',
    accentColor: '#06b6d4',
  });

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  rowSelection: 'single' | 'multiple' = 'multiple';

  demo = computed(() => {
    const id = this.demoId();
    return id ? this.demoService.getDemoById(id) : undefined;
  });
}
