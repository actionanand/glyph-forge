import { createAction, props } from '@ngrx/store';
import { ThemeName } from './theme.model';

export const setTheme = createAction('[Theme] Set Theme', props<{ theme: ThemeName }>());
