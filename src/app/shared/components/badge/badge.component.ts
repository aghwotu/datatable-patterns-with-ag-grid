import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant =
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
      [ngClass]="variantClasses"
    >
      {{ text }}
    </span>
  `,
})
export class BadgeComponent {
  @Input({ required: true }) text!: string;
  @Input() variant: BadgeVariant = 'gray';

  get variantClasses(): string {
    // Tailwind-native replacement for "inset-ring" is "ring-1 ring-inset" + "ring-*/opacity".
    // Matches the intent of the design snippet while staying compatible with Tailwind v4 defaults.
    switch (this.variant) {
      case 'red':
        return 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20';
      case 'green':
        return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-500/20';
      case 'blue':
        return 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30';
      case 'purple':
        return 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30';
      case 'pink':
        return 'bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/20';
      case 'gray':
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20';
    }
  }
}
