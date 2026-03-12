import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    router-outlet {
      flex: 1;
      min-height: 0;
      display: block;
    }
  `,
})
export class App {}
