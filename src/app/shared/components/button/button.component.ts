import { Component, computed, Directive, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'default' | 'danger' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md';
export type ButtonRadius = 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full';
export type ButtonWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

interface ButtonClasses {
  base: string;
  variants: Record<
    ButtonVariant,
    {
      base: string;
      loading: string;
      disabled: string;
    }
  >;
  size: Record<ButtonSize, string>;
  radius: Record<ButtonRadius, string>;
  weight: Record<ButtonWeight, string>;
  animate: string;
}

const buttonClasses: ButtonClasses = {
  base: 'flex justify-center leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  variants: {
    default: {
      base: 'bg-cyan-600 text-white hover:bg-cyan-500 hover:transition-colors focus-visible:outline-cyan-600',
      loading:
        'data-[loading=true]:bg-cyan-400 data-[loading=true]:text-white data-[loading=true]:cursor-progress',
      disabled: 'data-[disabled=true]:bg-cyan-400 data-[disabled=true]:text-white',
    },
    danger: {
      base: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
      loading:
        'data-[loading=true]:bg-red-400 data-[loading=true]:text-white data-[loading=true]:cursor-progress',
      disabled: 'data-[disabled=true]:bg-red-300 data-[disabled=true]:text-white',
    },
    outline: {
      base: 'bg-zinc-800 text-zinc-100 ring-1 ring-inset ring-zinc-600 hover:bg-zinc-700',
      loading:
        'data-[loading=true]:bg-zinc-700 data-[loading=true]:text-zinc-400 data-[loading=true]:cursor-progress',
      disabled: 'data-[disabled=true]:bg-zinc-800 data-[disabled=true]:text-zinc-500',
    },
  },
  size: {
    xs: 'px-3 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2 text-base',
  },
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
  weight: {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
  },
  animate: 'motion-safe:active:scale-95',
};

@Directive({
  standalone: true,
})
export class ButtonConfigDirective {
  loading = input<boolean>(false);
  loadingText = input<string, string>('Loading...', {
    transform: (value: string) => `${value}...`,
  });
  disabled = input<boolean>(false);
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('md');
  radius = input<ButtonRadius>('lg');
  weight = input<ButtonWeight>('semibold');
  animate = input<boolean>(true);
}

@Component({
  selector: 'button[app-button]',
  imports: [CommonModule],
  hostDirectives: [
    {
      directive: ButtonConfigDirective,
      inputs: ['loading', 'disabled', 'loadingText', 'variant', 'size', 'radius'],
    },
  ],
  template: `
    @if (!loading()) {
      <ng-container>
        <ng-content></ng-content>
      </ng-container>
    } @else {
      <ng-container>
        <div class="flex items-center justify-center">
          <svg
            aria-hidden="true"
            role="status"
            class="mr-3 inline h-4 w-4 motion-safe:animate-[spin_0.5s_linear_infinite] {{
              loadingIconClass()
            }}"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            ></path>
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            ></path>
          </svg>
          {{ loadingText() }}
        </div>
      </ng-container>
    }
  `,
  host: {
    '[class]': 'buttonClasses()',
    '[attr.data-loading]': 'loading()',
    '[attr.data-disabled]': 'disabled()',
    '[disabled]': 'isDisabled()',
    '[attr.aria-disabled]': 'isDisabled()',
  },
})
export class ButtonComponent extends ButtonConfigDirective {
  protected isDisabled = computed(() => this.loading() || this.disabled());

  protected buttonClasses = computed(() =>
    [
      buttonClasses.base,
      buttonClasses.variants[this.variant()].base,
      buttonClasses.size[this.size()],
      buttonClasses.radius[this.radius()],
      buttonClasses.weight[this.weight()],
      buttonClasses.variants[this.variant()].disabled,
      buttonClasses.variants[this.variant()].loading,
      !this.isDisabled() && this.animate() && buttonClasses.animate,
    ].join(' ')
  );

  loadingIconClass = computed(() => (this.variant() === 'outline' ? 'text-zinc-400' : 'text-white'));
}
