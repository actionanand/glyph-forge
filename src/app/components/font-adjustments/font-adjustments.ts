import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { FontSettings } from '../../models/font.model';
import { RangeSliderComponent } from '../range-slider/range-slider';

@Component({
  selector: 'app-font-adjustments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RangeSliderComponent],
  template: `
    <div class="adjustments">
      <h3 class="adjustments__title">Adjustments</h3>
      <app-range-slider
        label="Font Size"
        [min]="8"
        [max]="200"
        [step]="1"
        [value]="settings().fontSize"
        suffix="px"
        (valueChange)="updateSetting('fontSize', $event)"
      />
      <app-range-slider
        label="Letter Spacing"
        [min]="-10"
        [max]="30"
        [step]="0.5"
        [value]="settings().letterSpacing"
        suffix="px"
        (valueChange)="updateSetting('letterSpacing', $event)"
      />
      <app-range-slider
        label="Line Height"
        [min]="0.8"
        [max]="3"
        [step]="0.1"
        [value]="settings().lineHeight"
        suffix=""
        (valueChange)="updateSetting('lineHeight', $event)"
      />
    </div>
  `,
  styleUrl: './font-adjustments.scss',
})
export class FontAdjustmentsComponent {
  readonly settings = model.required<FontSettings>();

  protected updateSetting(key: keyof FontSettings, value: number): void {
    this.settings.update((s) => ({ ...s, [key]: value }));
  }
}
