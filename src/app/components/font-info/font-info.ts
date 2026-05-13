import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FontMetadata } from '../../models/font.model';

@Component({
  selector: 'app-font-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="font-info" role="region" aria-label="Font information">
      <div class="font-info__item font-info__item--primary">
        <span class="font-info__label">Family</span>
        <span class="font-info__value">{{ metadata().fontFamily }}</span>
      </div>
      <div class="font-info__item">
        <span class="font-info__label">Style</span>
        <span class="font-info__value">{{ metadata().fontSubfamily }}</span>
      </div>
      <div class="font-info__item">
        <span class="font-info__label">Glyphs</span>
        <span class="font-info__value">{{ metadata().numberOfGlyphs }}</span>
      </div>
      <div class="font-info__item">
        <span class="font-info__label">Units/Em</span>
        <span class="font-info__value">{{ metadata().unitsPerEm }}</span>
      </div>
      <div class="font-info__item">
        <span class="font-info__label">Ascender</span>
        <span class="font-info__value">{{ metadata().ascender }}</span>
      </div>
      <div class="font-info__item">
        <span class="font-info__label">Descender</span>
        <span class="font-info__value">{{ metadata().descender }}</span>
      </div>
      @if (metadata().designer !== 'Unknown') {
        <div class="font-info__item">
          <span class="font-info__label">Designer</span>
          <span class="font-info__value">{{ metadata().designer }}</span>
        </div>
      }
      @if (metadata().version !== 'Unknown') {
        <div class="font-info__item">
          <span class="font-info__label">Version</span>
          <span class="font-info__value">{{ metadata().version }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './font-info.scss',
})
export class FontInfoComponent {
  readonly metadata = input.required<FontMetadata>();
  readonly fileName = input.required<string>();
}
