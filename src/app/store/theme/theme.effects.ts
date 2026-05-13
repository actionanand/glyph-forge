import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { setTheme } from './theme.actions';

const STORAGE_KEY = 'glyph-forge-theme';

@Injectable()
export class ThemeEffects {
  private readonly actions$ = inject(Actions);
  private readonly document = inject(DOCUMENT);

  readonly persistTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setTheme),
        tap(({ theme }) => {
          try {
            localStorage.setItem(STORAGE_KEY, theme);
          } catch {
            // no-op
          }
          this.document.documentElement.setAttribute('data-theme', theme);
        }),
      ),
    { dispatch: false },
  );
}
