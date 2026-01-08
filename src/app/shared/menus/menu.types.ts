/**
 * Event that is returned on any of the `onCheck`, `onUncheck` and `action`
 */
export interface CheckboxChangeEvent<T = void> {
  item: CheckboxItem<T>;
  checked: boolean;
  previousState: boolean;
  allItems: CheckboxItem<T>[];
}

/**
 * Event that provides the full state information
 */
export interface CheckboxGroupChangeEvent<T = void> {
  items: CheckboxItem<T>[];
  changed: CheckboxChangeEvent<T>;
}

/**
 * For the CheckboxMenuComponent
 */
export interface CheckboxItem<T = void> {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  hidden?: T extends void
    ? () => boolean // No context provided
    : (context: T) => boolean; // Context required
  disabled?: T extends void
    ? () => boolean // No context provided
    : (context: T) => boolean; // Context required
  onCheck?: (event: CheckboxChangeEvent<T>) => void;
  onUncheck?: (event: CheckboxChangeEvent<T>) => void;
  action?: (event: CheckboxChangeEvent<T>) => void;
}

/**
 * Used by EllipsisMenuComponent
 */
export interface EllipsisActionItem<T = unknown> {
  label: string;
  action: (context?: T | null) => void;
  hidden?: (context?: T | null) => boolean;
  disabled?: (context?: T | null) => boolean;
}

export const ORIENTATIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;

export type OrientationType = (typeof ORIENTATIONS)[keyof typeof ORIENTATIONS];

/**
 * Used by menu components for font sizing
 */
export type MenuFontSize = 'text-xs' | 'text-sm' | 'text-base' | 'text-lg';
