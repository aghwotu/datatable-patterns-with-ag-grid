/**
 * Breakpoint detection utility using Angular CDK BreakpointObserver.
 * Returns a signal indicating the current screen size category.
 */
import { computed, inject, Signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Injects and returns a signal that tracks the current breakpoint.
 * - mobile: XSmall (< 600px)
 * - tablet: Small (600px - 959px)
 * - desktop: >= 960px
 */
export const injectCurrentBreakpoint = (): Signal<Breakpoint> => {
  const breakpointObserver = inject(BreakpointObserver);

  const isMobile = toSignal(
    breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  const isTablet = toSignal(
    breakpointObserver
      .observe([Breakpoints.Small])
      .pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  return computed(() => {
    if (isMobile()) return 'mobile';
    if (isTablet()) return 'tablet';
    return 'desktop';
  });
};
