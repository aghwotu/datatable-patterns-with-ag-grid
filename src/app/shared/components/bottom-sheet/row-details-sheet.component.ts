import { Component, inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { BottomSheetComponent } from './bottom-sheet.component';

interface RowField {
  label: string;
  value: unknown;
}

@Component({
  selector: 'app-row-details-sheet',
  standalone: true,
  imports: [BottomSheetComponent],
  template: `
    <app-bottom-sheet>
      <span header>Row Details</span>

      <div class="space-y-4">
        <!-- Fields Grid -->
        <div class="grid grid-cols-2 gap-4">
          @for (field of fields; track field.label) {
            <div class="min-w-0">
              <dt class="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                {{ field.label }}
              </dt>
              <dd class="mt-1 text-sm text-zinc-100 break-words">
                {{ formatValue(field.value) }}
              </dd>
            </div>
          }
        </div>
      </div>
    </app-bottom-sheet>
  `,
})
export class RowDetailsSheetComponent {
  protected data = inject<Record<string, unknown>>(DIALOG_DATA);
  protected fields: RowField[] = this.createFieldsList();

  private createFieldsList(): RowField[] {
    if (!this.data || typeof this.data !== 'object') {
      return [];
    }

    // Filter out internal/action fields
    const excludedKeys = ['id', 'actions', '__typename'];

    return Object.entries(this.data)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => ({
        label: this.formatLabel(key),
        value: value,
      }));
  }

  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  }

  protected formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '—';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      // Format currency-like numbers
      if (Math.abs(value) >= 100) {
        return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
      }
      return String(value);
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return String(value);
  }
}
