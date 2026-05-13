import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { THEMES } from '../../store/theme/theme.model';
import { setTheme } from '../../store/theme/theme.actions';
import { selectCurrentTheme } from '../../store/theme/theme.selectors';

@Component({
  selector: 'app-theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-switcher" role="group" aria-label="Choose color theme">
      @for (theme of themes; track theme.name) {
        <button
          class="swatch"
          [style.background]="theme.accent"
          [class.swatch--active]="currentTheme() === theme.name"
          (click)="selectTheme(theme.name)"
          [attr.aria-label]="
            theme.label + ' theme' + (currentTheme() === theme.name ? ', currently selected' : '')
          "
          [attr.aria-pressed]="currentTheme() === theme.name"
          [title]="theme.label"
        >
          @if (currentTheme() === theme.name) {
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        </button>
      }
    </div>
  `,
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcherComponent {
  private readonly store = inject(Store);

  protected readonly themes = THEMES;
  protected readonly currentTheme = toSignal(this.store.select(selectCurrentTheme), {
    initialValue: 'purple' as const,
  });

  protected selectTheme(name: (typeof THEMES)[number]['name']): void {
    this.store.dispatch(setTheme({ theme: name }));
  }
}
