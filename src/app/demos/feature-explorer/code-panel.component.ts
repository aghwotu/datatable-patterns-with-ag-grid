import { Component, computed, HostListener, inject, input, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CodeGeneratorService, CodeMode, FeatureToggle } from './code-generator.service';

// ─── syntax highlighter ───────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function tokenize(code: string): string {
  const TOKEN_RE = new RegExp(
    [
      String.raw`(?<comment>\/\/[^\n]*)`,
      String.raw`(?<template>\`(?:[^\`\\]|\\.)*\`)`,
      String.raw`(?<string>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')`,
      String.raw`(?<decorator>@[A-Za-z]\w*)`,
      String.raw`(?<keyword>\b(?:import|export|from|const|let|var|interface|class|type|extends|implements|new|return|true|false|undefined|null|void|string|number|boolean|any|readonly|private|protected|public|static|async|await|as|of|in|for|if|else)\b)`,
      String.raw`(?<classname>\b[A-Z][a-zA-Z0-9]*\b)`,
      String.raw`(?<number>\b\d+(?:\.\d+)?\b)`,
      String.raw`(?<propkey>[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*:(?!:)))`,
      String.raw`(?<whitespace>[ \t\r\n]+)`,
      String.raw`(?<other>[\s\S])`,
    ].join('|'),
    'g',
  );

  // Inline CSS hex values — avoids Tailwind JIT scanning issues for dynamically injected HTML
  const COLOR: Record<string, string> = {
    comment: '#71717a',   // zinc-500
    template: '#34d399',  // emerald-400
    string: '#34d399',    // emerald-400
    decorator: '#fb7185', // rose-400
    keyword: '#a78bfa',   // violet-400
    classname: '#67e8f9', // cyan-300
    number: '#fbbf24',    // amber-400
    propkey: '#7dd3fc',   // sky-300
    other: '#d4d4d8',     // zinc-300
  };

  let html = '';
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    const groups = match.groups!;
    const type = Object.keys(groups).find((k) => groups[k] !== undefined) ?? 'other';
    const escaped = escapeHtml(match[0]);
    const color = COLOR[type];
    html += color ? `<span style="color:${color}">${escaped}</span>` : escaped;
  }
  return html;
}

// ─── component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-code-panel',
  standalone: true,
  template: `
    <div
      class="fixed bottom-0 left-0 right-0 z-40 flex flex-col bg-zinc-950 border-t border-zinc-700/60 transition-transform duration-300 ease-in-out"
      [class.translate-y-full]="!isOpen()"
      [class.pointer-events-none]="!isOpen()"
      [attr.aria-hidden]="!isOpen()"
      style="height:45vh"
    >
      <!-- Header -->
      <div class="shrink-0 flex items-center gap-2 sm:gap-3 px-4 py-2.5 border-b border-zinc-800/60">
        <!-- Icon + Title -->
        <svg
          class="shrink-0 w-4 h-4 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
          Generated Code
        </span>

        <div class="flex-1"></div>

        <!-- Mode toggle -->
        <div class="flex items-center bg-zinc-900 rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
            [class]="
              mode() === 'snippet'
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            "
            (click)="mode.set('snippet')"
          >
            Snippet
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
            [class]="
              mode() === 'full'
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            "
            (click)="mode.set('full')"
          >
            Full component
          </button>
        </div>

        <!-- Copy button -->
        <button
          type="button"
          class="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border transition-colors"
          [class]="
            copied()
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-zinc-800 border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
          "
          (click)="copyCode()"
          title="Copy to clipboard"
        >
          @if (copied()) {
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Copied!
          } @else {
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy
          }
        </button>

        <!-- Close button -->
        <button
          type="button"
          class="flex items-center justify-center w-7 h-7 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          (click)="closed.emit()"
          title="Close code panel (Esc)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Code body -->
      <div class="flex-1 overflow-y-auto px-4 py-3">
        <pre
          class="m-0 text-sm leading-relaxed whitespace-pre"
          style="font-family:var(--font-mono);color:#d4d4d8"
        ><code [innerHTML]="highlightedHtml()"></code></pre>
      </div>
    </div>
  `,
})
export class CodePanelComponent {
  features = input.required<FeatureToggle[]>();
  isOpen = input.required<boolean>();
  closed = output<void>();

  mode = signal<CodeMode>('snippet');
  copied = signal(false);

  private codeGen = inject(CodeGeneratorService);
  private sanitizer = inject(DomSanitizer);

  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  private generatedCode = computed(() => this.codeGen.generate(this.features(), this.mode()));

  highlightedHtml = computed((): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(tokenize(this.generatedCode())),
  );

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.closed.emit();
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.generatedCode()).then(() => {
      this.copied.set(true);
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        this.copied.set(false);
        this.copyTimer = null;
      }, 2000);
    });
  }
}
