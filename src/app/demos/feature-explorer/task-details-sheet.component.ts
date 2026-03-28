import { Component, inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { BottomSheetComponent } from '@shared/components/bottom-sheet/bottom-sheet.component';

interface ProjectTask {
  id: string;
  title: string;
  assignee: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'In Progress' | 'Pending' | 'Blocked';
  progress: number;
  effort: number;
  category: string;
  dueDate: string;
  budget: number;
  spent: number;
  variance: number;
}

@Component({
  selector: 'app-task-details-sheet',
  standalone: true,
  imports: [BottomSheetComponent],
  template: `
    <app-bottom-sheet>
      <span header>Task Details</span>

      <div class="space-y-6 pb-2">
        <!-- Hero: ID chip + Title -->
        <div class="space-y-2">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700/50"
          >
            {{ task.id }}
          </span>
          <h2 class="text-lg font-semibold text-zinc-100 leading-snug">{{ task.title }}</h2>
        </div>

        <!-- Status + Priority badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            [style.backgroundColor]="statusColor.bg"
            [style.color]="statusColor.text"
          >
            {{ task.status }}
          </span>
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            [class]="priorityClass"
          >
            {{ task.priority }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest"
              >Progress</span
            >
            <span
              class="text-xs font-semibold tabular-nums"
              [class]="task.progress === 100 ? 'text-emerald-400' : 'text-zinc-300'"
              >{{ task.progress }}%</span
            >
          </div>
          <div class="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              [style.width.%]="task.progress"
              [class]="progressBarClass"
            ></div>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-zinc-800/60"></div>

        <!-- Task Details -->
        <div class="space-y-3">
          <p class="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Details</p>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <dt class="text-xs text-zinc-500 mb-1">Assignee</dt>
              <dd class="text-sm font-medium text-zinc-100">{{ task.assignee }}</dd>
            </div>
            <div>
              <dt class="text-xs text-zinc-500 mb-1">Due Date</dt>
              <dd class="text-sm font-medium text-zinc-100">{{ task.dueDate }}</dd>
            </div>
            <div>
              <dt class="text-xs text-zinc-500 mb-1">Effort</dt>
              <dd class="text-sm font-medium text-zinc-100">{{ task.effort }}h</dd>
            </div>
            <div>
              <dt class="text-xs text-zinc-500 mb-1">Category</dt>
              <dd class="text-sm font-medium text-zinc-100">{{ task.category }}</dd>
            </div>
          </dl>
        </div>

        <!-- Divider -->
        <div class="h-px bg-zinc-800/60"></div>

        <!-- Budget -->
        <div class="space-y-3">
          <p class="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Budget</p>
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/30">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5">Budget</p>
              <p class="text-sm font-semibold text-zinc-100">{{ '$' + task.budget.toLocaleString() }}</p>
            </div>
            <div class="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/30">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5">Spent</p>
              <p class="text-sm font-semibold text-zinc-100">{{ '$' + task.spent.toLocaleString() }}</p>
            </div>
            <div class="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/30">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5">Variance</p>
              <p class="text-sm font-semibold tabular-nums" [class]="varianceClass">
                {{ task.variance > 0 ? '+' : '' }}{{ task.variance }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </app-bottom-sheet>
  `,
})
export class TaskDetailsSheetComponent {
  protected task = inject<ProjectTask>(DIALOG_DATA);

  private readonly statusColors: Record<string, { bg: string; text: string }> = {
    Completed: { bg: '#14532d40', text: '#4ade80' },
    'In Progress': { bg: '#1e3a5f40', text: '#60a5fa' },
    Pending: { bg: '#78350f40', text: '#fbbf24' },
    Blocked: { bg: '#7f1d1d40', text: '#f87171' },
  };

  protected get statusColor() {
    return this.statusColors[this.task.status] ?? { bg: '#27272a', text: '#a1a1aa' };
  }

  protected get priorityClass() {
    const map: Record<string, string> = {
      Critical: 'bg-rose-500/15 text-rose-400',
      High: 'bg-orange-500/15 text-orange-400',
      Medium: 'bg-amber-500/15 text-amber-400',
      Low: 'bg-zinc-700/50 text-zinc-400',
    };
    return map[this.task.priority] ?? 'bg-zinc-700/50 text-zinc-400';
  }

  protected get progressBarClass() {
    if (this.task.progress >= 100) return 'bg-emerald-500';
    if (this.task.progress >= 50) return 'bg-cyan-500';
    return 'bg-blue-500';
  }

  protected get varianceClass() {
    if (this.task.variance > 0) return 'text-emerald-400';
    if (this.task.variance < 0) return 'text-rose-400';
    return 'text-zinc-400';
  }
}
