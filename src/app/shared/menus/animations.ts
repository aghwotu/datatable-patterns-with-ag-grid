import { trigger, transition, style, animate } from '@angular/animations';

export const menuPanelAnimation = trigger('menuPanelAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0.95)',
    }),
    animate(
      '100ms ease-out',
      style({
        opacity: 1,
        transform: 'scale(1)',
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '75ms cubic-bezier(0.23, 1, 0.32, 1)',
      style({
        opacity: 0,
        transform: 'scale(0.95)',
      })
    ),
  ]),
]);
