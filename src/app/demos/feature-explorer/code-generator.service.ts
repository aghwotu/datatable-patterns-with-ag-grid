import { Injectable } from '@angular/core';

export type CodeMode = 'snippet' | 'full';

/** Minimal structural interface — compatible with the parent's local FeatureToggle via structural typing */
export interface FeatureToggle {
  id: string;
  enabled: boolean;
}

// ─── internal helpers ─────────────────────────────────────────────────────────

function on(fs: FeatureToggle[], id: string): boolean {
  return fs.find((f) => f.id === id)?.enabled ?? false;
}

// ─── imports block ────────────────────────────────────────────────────────────

function buildImports(features: FeatureToggle[], forComponent = false): string {
  const lines: string[] = [];

  if (forComponent) {
    lines.push(
      `import { Component } from '@angular/core';`,
      `import { AgGridAngular } from 'ag-grid-angular';`,
    );
  }

  const communityTypes: string[] = [];
  if (forComponent) communityTypes.push('AllCommunityModule', 'ModuleRegistry');
  communityTypes.push('ColDef', 'GridOptions');
  if (on(features, 'groupedColumns')) communityTypes.push('ColGroupDef');
  if (forComponent) communityTypes.push('themeQuartz');

  lines.push(`import { ${communityTypes.join(', ')} } from 'ag-grid-community';`);

  if (on(features, 'cellRenderers')) {
    lines.push(
      `import { BadgeCellComponent } from './cell-renderers/badge-cell.component';`,
      `import { ProgressCellComponent } from './cell-renderers/progress-cell.component';`,
      `import { TrendCellComponent } from './cell-renderers/trend-cell.component';`,
    );
  }
  if (on(features, 'rowActions')) {
    lines.push(`import { AgGridEllipsisMenuComponent } from './ag-grid-ellipsis-menu.component';`);
  }

  return lines.join('\n');
}

// ─── status cellStyle block ───────────────────────────────────────────────────

function statusCellStyleBlock(indent: string): string {
  return [
    `${indent}cellStyle: (params) => {`,
    `${indent}  const colors: Record<string, { backgroundColor: string; color: string }> = {`,
    `${indent}    Completed: { backgroundColor: '#14532d40', color: '#4ade80' },`,
    `${indent}    'In Progress': { backgroundColor: '#1e3a5f40', color: '#60a5fa' },`,
    `${indent}    Pending: { backgroundColor: '#78350f40', color: '#fbbf24' },`,
    `${indent}    Blocked: { backgroundColor: '#7f1d1d40', color: '#f87171' },`,
    `${indent}  };`,
    `${indent}  return colors[params.value as string] ?? null;`,
    `${indent}},`,
  ].join('\n');
}

// ─── flat column defs ─────────────────────────────────────────────────────────

function flatColLines(features: FeatureToggle[]): string[] {
  const lines: string[] = [];

  if (on(features, 'rowSelection')) {
    lines.push(
      `  {`,
      `    headerName: '', colId: 'select',`,
      `    checkboxSelection: true, headerCheckboxSelection: true,`,
      `    width: 44, maxWidth: 52, pinned: 'left',`,
      `    suppressMovable: true, sortable: false, filter: false, resizable: false,`,
      `  },`,
    );
  }

  lines.push(
    `  { field: 'id', headerName: 'ID', width: 100 },`,
    `  { field: 'title', headerName: 'Task', minWidth: 150 },`,
    `  { field: 'assignee', headerName: 'Assignee', width: 130 },`,
    `  { field: 'effort', headerName: 'Effort', width: 90, valueFormatter: (p) => \`\${p.value}h\` },`,
  );

  if (on(features, 'cellRenderers')) {
    lines.push(
      `  { field: 'priority', headerName: 'Priority', width: 120, cellRenderer: BadgeCellComponent },`,
    );
  } else {
    lines.push(`  { field: 'priority', headerName: 'Priority', width: 100 },`);
  }

  if (on(features, 'statusColors')) {
    lines.push(
      `  {`,
      `    field: 'status', headerName: 'Status', width: 120,`,
      statusCellStyleBlock('    '),
      `  },`,
    );
  } else {
    lines.push(`  { field: 'status', headerName: 'Status', width: 120 },`);
  }

  if (on(features, 'cellRenderers')) {
    lines.push(
      `  { field: 'progress', headerName: 'Progress', width: 150, cellRenderer: ProgressCellComponent },`,
    );
  } else {
    lines.push(
      `  { field: 'progress', headerName: 'Progress', width: 100, valueFormatter: (params) => \`\${params.value}%\` },`,
    );
  }

  lines.push(
    `  { field: 'category', headerName: 'Category', width: 100, hide: true },`,
    `  { field: 'dueDate', headerName: 'Due Date', width: 110 },`,
    `  { field: 'budget', headerName: 'Budget', width: 100, valueFormatter: (p) => \`$\${p.value?.toLocaleString() || 0}\`, hide: true },`,
    `  { field: 'spent', headerName: 'Spent', width: 100, valueFormatter: (p) => \`$\${p.value?.toLocaleString() || 0}\`, hide: true },`,
  );

  if (on(features, 'cellRenderers')) {
    lines.push(
      `  { field: 'variance', headerName: 'Variance', width: 110, cellRenderer: TrendCellComponent },`,
    );
  } else {
    lines.push(
      `  { field: 'variance', headerName: 'Variance', width: 100, valueFormatter: (params) => \`\${params.value > 0 ? '+' : ''}\${params.value}%\` },`,
    );
  }

  if (on(features, 'rowActions')) {
    lines.push(
      `  {`,
      `    headerName: '', colId: 'actions',`,
      `    pinned: 'right', width: 60,`,
      `    filter: false, sortable: false, resizable: false,`,
      `    cellRenderer: AgGridEllipsisMenuComponent,`,
      `  },`,
    );
  }

  return lines;
}

function buildFlatColDefsSnippet(features: FeatureToggle[]): string {
  return `const columnDefs: ColDef[] = [\n${flatColLines(features).join('\n')}\n];`;
}

// ─── grouped column defs ──────────────────────────────────────────────────────

function groupedColLines(features: FeatureToggle[]): string[] {
  const lines: string[] = [];

  if (on(features, 'rowSelection')) {
    lines.push(
      `  {`,
      `    headerName: '', colId: 'select',`,
      `    checkboxSelection: true, headerCheckboxSelection: true,`,
      `    width: 44, maxWidth: 52, pinned: 'left',`,
      `    suppressMovable: true, sortable: false, filter: false, resizable: false,`,
      `  },`,
    );
  }

  lines.push(`  { field: 'id', headerName: 'ID', width: 100 },`);

  lines.push(
    `  {`,
    `    headerName: 'Task Info',`,
    `    children: [`,
    `      { field: 'title', headerName: 'Task', minWidth: 150 },`,
    `      { field: 'assignee', headerName: 'Assignee', width: 130 },`,
    `      { field: 'effort', headerName: 'Effort', width: 90, valueFormatter: (p) => \`\${p.value}h\` },`,
    `      { field: 'category', headerName: 'Category', width: 100, hide: true },`,
    `    ],`,
    `  },`,
  );

  const priorityCol = on(features, 'cellRenderers')
    ? `      { field: 'priority', headerName: 'Priority', width: 120, cellRenderer: BadgeCellComponent },`
    : `      { field: 'priority', headerName: 'Priority', width: 100 },`;

  const progressCol = on(features, 'cellRenderers')
    ? `      { field: 'progress', headerName: 'Progress', width: 150, cellRenderer: ProgressCellComponent },`
    : `      { field: 'progress', headerName: 'Progress', width: 100, valueFormatter: (params) => \`\${params.value}%\` },`;

  if (on(features, 'statusColors')) {
    lines.push(
      `  {`,
      `    headerName: 'Status',`,
      `    children: [`,
      priorityCol,
      `      {`,
      `        field: 'status', headerName: 'Status', width: 120,`,
      statusCellStyleBlock('        '),
      `      },`,
      progressCol,
      `    ],`,
      `  },`,
    );
  } else {
    lines.push(
      `  {`,
      `    headerName: 'Status',`,
      `    children: [`,
      priorityCol,
      `      { field: 'status', headerName: 'Status', width: 120 },`,
      progressCol,
      `    ],`,
      `  },`,
    );
  }

  const varianceCol = on(features, 'cellRenderers')
    ? `      { field: 'variance', headerName: 'Variance', width: 110, cellRenderer: TrendCellComponent },`
    : `      { field: 'variance', headerName: 'Variance', width: 100, valueFormatter: (params) => \`\${params.value > 0 ? '+' : ''}\${params.value}%\` },`;

  lines.push(
    `  {`,
    `    headerName: 'Budget',`,
    `    children: [`,
    `      { field: 'budget', headerName: 'Budget', width: 100, valueFormatter: (p) => \`$\${p.value?.toLocaleString() || 0}\`, hide: true },`,
    `      { field: 'spent', headerName: 'Spent', width: 100, valueFormatter: (p) => \`$\${p.value?.toLocaleString() || 0}\`, hide: true },`,
    varianceCol,
    `    ],`,
    `  },`,
    `  {`,
    `    headerName: 'Timeline',`,
    `    children: [`,
    `      { field: 'dueDate', headerName: 'Due Date', width: 110 },`,
    `    ],`,
    `  },`,
  );

  if (on(features, 'rowActions')) {
    lines.push(
      `  {`,
      `    headerName: '', colId: 'actions',`,
      `    pinned: 'right', width: 60,`,
      `    filter: false, sortable: false, resizable: false,`,
      `    cellRenderer: AgGridEllipsisMenuComponent,`,
      `  },`,
    );
  }

  return lines;
}

function buildGroupedColDefsSnippet(features: FeatureToggle[]): string {
  return `const columnDefs: (ColDef | ColGroupDef)[] = [\n${groupedColLines(features).join('\n')}\n];`;
}

// ─── gridOptions ──────────────────────────────────────────────────────────────

function buildGridOptionsSnippet(features: FeatureToggle[]): string {
  const opts: string[] = [
    `  columnDefs,`,
    `  defaultColDef: { flex: 1, minWidth: 80, resizable: true, sortable: true },`,
    `  animateRows: true,`,
  ];

  if (on(features, 'pagination')) {
    opts.push(
      `  pagination: true,`,
      `  paginationPageSize: 10,`,
      `  paginationPageSizeSelector: [10, 20, 50, 100],`,
    );
  }

  if (on(features, 'rowSelection')) {
    opts.push(
      `  rowSelection: {`,
      `    mode: 'multiRow',`,
      `    enableClickSelection: false,`,
      `    checkboxes: true,`,
      `    headerCheckbox: true,`,
      `  },`,
    );
  }

  if (on(features, 'columnVisibility')) {
    opts.push(`  // columnVisibility: managed via gridApi.setColumnsVisible([field], visible)`);
  }
  if (on(features, 'floatingFilters')) {
    opts.push(`  // quickFilters: managed in toolbar — filter rowData before passing to grid`);
  }

  return `const gridOptions: GridOptions = {\n${opts.join('\n')}\n};`;
}

// ─── snippet mode ─────────────────────────────────────────────────────────────

function buildSnippet(features: FeatureToggle[]): string {
  const colDefs = on(features, 'groupedColumns')
    ? buildGroupedColDefsSnippet(features)
    : buildFlatColDefsSnippet(features);

  return [buildImports(features), '', colDefs, '', buildGridOptionsSnippet(features)].join('\n');
}

// ─── full component mode ──────────────────────────────────────────────────────

function buildFullComponent(features: FeatureToggle[]): string {
  const gridAttrs: string[] = [
    `      [rowData]="rowData"`,
    `      [columnDefs]="columnDefs"`,
    `      [defaultColDef]="defaultColDef"`,
    `      [animateRows]="true"`,
    `      [theme]="theme"`,
  ];

  if (on(features, 'pagination')) {
    gridAttrs.push(
      `      [pagination]="true"`,
      `      [paginationPageSize]="10"`,
      `      [paginationPageSizeSelector]="[10, 20, 50, 100]"`,
    );
  }
  if (on(features, 'rowSelection')) {
    gridAttrs.push(`      [rowSelection]="rowSelection"`);
  }

  const componentImports: string[] = [`AgGridAngular`];
  if (on(features, 'cellRenderers')) {
    componentImports.push('BadgeCellComponent', 'ProgressCellComponent', 'TrendCellComponent');
  }
  if (on(features, 'rowActions')) componentImports.push('AgGridEllipsisMenuComponent');

  // Column defs as class member: indent + remove `const `
  const colDefsSnippet = on(features, 'groupedColumns')
    ? buildGroupedColDefsSnippet(features)
    : buildFlatColDefsSnippet(features);
  const colDefsClassMember = colDefsSnippet
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n')
    .replace(/^  const /, '  ');

  const classBody: string[] = [
    `  theme = themeQuartz.withParams({`,
    `    backgroundColor: '#18181b',`,
    `    foregroundColor: '#fafafa',`,
    `    headerBackgroundColor: '#27272a',`,
    `    headerTextColor: '#a1a1aa',`,
    `    borderColor: '#3f3f46',`,
    `    accentColor: '#06b6d4',`,
    `  });`,
    ``,
    `  defaultColDef: GridOptions['defaultColDef'] = {`,
    `    flex: 1, minWidth: 80, resizable: true, sortable: true,`,
    `  };`,
    ``,
  ];

  if (on(features, 'rowSelection')) {
    classBody.push(
      `  rowSelection = {`,
      `    mode: 'multiRow' as const,`,
      `    enableClickSelection: false,`,
      `    checkboxes: true,`,
      `    headerCheckbox: true,`,
      `  };`,
      ``,
    );
  }

  classBody.push(colDefsClassMember, ``, `  rowData = [ /* your data here */ ];`);

  return [
    buildImports(features, true),
    ``,
    `ModuleRegistry.registerModules([AllCommunityModule]);`,
    ``,
    `@Component({`,
    `  selector: 'app-tasks-grid',`,
    `  standalone: true,`,
    `  imports: [${componentImports.join(', ')}],`,
    `  template: \``,
    `    <ag-grid-angular`,
    `      class="ag-theme-quartz-dark w-full h-full"`,
    ...gridAttrs,
    `    />`,
    `  \`,`,
    `})`,
    `export class TasksGridComponent {`,
    ...classBody,
    `}`,
    ``,
  ].join('\n');
}
// `// Want this themed to match your Figma? → gridsnap.dev`,

// ─── public API ───────────────────────────────────────────────────────────────

export function generateCode(features: FeatureToggle[], mode: CodeMode): string {
  return mode === 'full' ? buildFullComponent(features) : buildSnippet(features);
}

@Injectable({ providedIn: 'root' })
export class CodeGeneratorService {
  generate(features: FeatureToggle[], mode: CodeMode): string {
    return generateCode(features, mode);
  }
}
