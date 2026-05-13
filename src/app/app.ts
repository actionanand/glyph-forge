import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontService } from './services/font.service';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher';
import { selectCurrentTheme } from './store/theme/theme.selectors';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ThemeSwitcherComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly fontService = inject(FontService);

  private readonly store = inject(Store);
  private readonly doc = inject(DOCUMENT);
  private readonly currentTheme = toSignal(this.store.select(selectCurrentTheme));

  constructor() {
    // Apply theme to <html> reactively (covers initial load + changes)
    effect(() => {
      const theme = this.currentTheme();
      if (theme) {
        this.doc.documentElement.setAttribute('data-theme', theme);
      }
    });
  }
}
