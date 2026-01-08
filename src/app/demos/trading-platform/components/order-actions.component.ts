import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { EllipsisMenuComponent } from '@shared/menus/ellipsis-menu/ellipsis-menu.component';
import { EllipsisActionItem } from '@shared/menus/menu.types';
import { TradingOrder } from '../services/trading-api.service';

@Component({
  selector: 'app-order-actions',
  imports: [EllipsisMenuComponent],
  template: `
    <app-ellipsis-menu [actions]="menuActions" [context]="order" />
  `,
})
export class OrderActionsComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams<TradingOrder>;
  order: TradingOrder | null = null;
  menuActions: EllipsisActionItem<TradingOrder>[] = [];

  agInit(params: ICellRendererParams<TradingOrder>): void {
    this.params = params;
    this.order = params.data || null;
    this.buildMenuActions();
  }

  refresh(params: ICellRendererParams<TradingOrder>): boolean {
    this.params = params;
    this.order = params.data || null;
    this.buildMenuActions();
    return true;
  }

  private buildMenuActions(): void {
    this.menuActions = [
      {
        label: 'View Details',
        action: (ctx) => {
          if (!ctx) return;
          console.log('View details for order:', ctx.id);
          alert(`Order Details\n\nID: ${ctx.id}\nSymbol: ${ctx.symbol}\nSide: ${ctx.side}\nQuantity: ${ctx.quantity}\nFilled: ${ctx.filledQty}\nStatus: ${ctx.status}\nP&L: ${ctx.pnl > 0 ? '+' : ''}${ctx.pnl}%`);
        },
      },
      {
        label: 'Modify Order',
        action: (ctx) => {
          if (!ctx) return;
          console.log('Modify order:', ctx.id);
          alert(`Modify Order ${ctx.id}\n\nThis would open a modification dialog in a real application.`);
        },
        hidden: (ctx) => ctx?.status === 'Filled' || ctx?.status === 'Cancelled',
      },
      {
        label: 'Cancel Order',
        action: (ctx) => {
          if (!ctx) return;
          console.log('Cancel order:', ctx.id);
          alert(`Cancel Order ${ctx.id}\n\nThis would cancel the pending order in a real application.`);
        },
        hidden: (ctx) => ctx?.status !== 'Pending' && ctx?.status !== 'Partial',
      },
      {
        label: 'Close Position',
        action: (ctx) => {
          if (!ctx) return;
          console.log('Close position for:', ctx.symbol);
          alert(`Close Position\n\nThis would close the ${ctx.symbol} position in a real application.`);
        },
        hidden: (ctx) => ctx?.status !== 'Filled' && ctx?.status !== 'Partial',
      },
    ];
  }
}
