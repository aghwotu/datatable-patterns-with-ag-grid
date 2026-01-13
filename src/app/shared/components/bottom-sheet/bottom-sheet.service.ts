import { Injectable, Injector, inject, Type } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DIALOG_DATA } from '@angular/cdk/dialog';

export interface BottomSheetConfig<T = unknown> {
  data?: T;
  hasBackdrop?: boolean;
  panelClass?: string | string[];
}

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private currentOverlayRef: OverlayRef | null = null;

  open<T>(component: Type<unknown>, config: BottomSheetConfig<T> = {}): OverlayRef {
    // Close any existing sheet first
    if (this.currentOverlayRef) {
      this.currentOverlayRef.dispose();
    }

    this.currentOverlayRef = this.createOverlay(config);

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: this.currentOverlayRef },
        { provide: DIALOG_DATA, useValue: config.data },
      ],
    });

    const portal = new ComponentPortal(component, null, injector);
    this.currentOverlayRef.attach(portal);

    return this.currentOverlayRef;
  }

  close(): void {
    if (this.currentOverlayRef) {
      this.currentOverlayRef.dispose();
      this.currentOverlayRef = null;
    }
  }

  private createOverlay(config: BottomSheetConfig): OverlayRef {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this.overlay.position().global().bottom('0').centerHorizontally(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: config.hasBackdrop ?? false, // We handle backdrop in the component
      panelClass: [
        'bottom-sheet-panel',
        ...(Array.isArray(config.panelClass) ? config.panelClass : [config.panelClass || '']),
      ].filter(Boolean),
    });

    return this.overlay.create(overlayConfig);
  }
}
