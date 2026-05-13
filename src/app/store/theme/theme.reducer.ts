import { createReducer, on } from '@ngrx/store';
import { ThemeName, THEME_NAMES } from './theme.model';
import { setTheme } from './theme.actions';

const STORAGE_KEY = 'glyph-forge-theme';

function getInitialTheme(): ThemeName {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEME_NAMES.includes(saved as ThemeName)) {
      return saved as ThemeName;
    }
  } catch {
    // no-op: localStorage unavailable (SSR, etc.)
  }
  return 'purple';
}

export interface ThemeState {
  current: ThemeName;
}

const initialState: ThemeState = {
  current: getInitialTheme(),
};

export const themeReducer = createReducer(
  initialState,
  on(setTheme, (state, { theme }) => ({ ...state, current: theme })),
);
