import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
  ElementRef,
  afterNextRender,
} from '@angular/core';
import { FontGlyph } from '../../models/font.model';
import { FontService } from '../../services/font.service';

@Component({
  selector: 'app-glyph-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-label]': '"Glyph detail for " + glyph().name',
    '(click)': 'onBackdropClick($event)',
    '(keydown.escape)': 'close.emit()',
    tabindex: '-1',
  },
  template: `
    <div class="detail-panel" (click)="$event.stopPropagation()">
      <div class="detail-header">
        <h4>{{ glyph().name }}</h4>
        <button class="detail-close" (click)="close.emit()" aria-label="Close glyph detail">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      @let svg = svgData();
      @if (svg) {
        <div class="detail-svg-container">
          <svg
            [attr.viewBox]="'0 0 ' + svg.width + ' ' + svg.height"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0"
              [attr.y1]="svg.padding"
              [attr.x2]="svg.width"
              [attr.y2]="svg.padding"
              class="metric-line"
            />
            <line
              x1="0"
              [attr.y1]="svg.baselineY"
              [attr.x2]="svg.width"
              [attr.y2]="svg.baselineY"
              class="baseline-line"
            />
            <line
              x1="0"
              [attr.y1]="svg.height - svg.padding"
              [attr.x2]="svg.width"
              [attr.y2]="svg.height - svg.padding"
              class="metric-line"
            />
            <line
              [attr.x1]="svg.padding"
              y1="0"
              [attr.x2]="svg.padding"
              [attr.y2]="svg.height"
              class="advance-line"
            />
            <line
              [attr.x1]="svg.advanceX"
              y1="0"
              [attr.x2]="svg.advanceX"
              [attr.y2]="svg.height"
              class="advance-line"
            />
            <path [attr.d]="svg.pathData" class="glyph-path" />
          </svg>
        </div>
      }

      <div class="detail-info">
        <div class="detail-info__item">
          <span class="detail-info__label">Character</span>
          <span class="detail-info__value detail-info__value--large">{{
            glyph().character || '—'
          }}</span>
        </div>
        <div class="detail-info__item">
          <span class="detail-info__label">Unicode</span>
          <span class="detail-info__value">{{ unicodeHex() }}</span>
        </div>
        <div class="detail-info__item">
          <span class="detail-info__label">Glyph Index</span>
          <span class="detail-info__value">{{ glyph().index }}</span>
        </div>
        <div class="detail-info__item">
          <span class="detail-info__label">Advance Width</span>
          <span class="detail-info__value">{{ glyph().advanceWidth }}</span>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn-copy" (click)="copyCharacter()" [disabled]="!glyph().character">
          @if (copied()) {
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied!
          } @else {
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Character
          }
        </button>
      </div>
    </div>
  `,
  styleUrl: './glyph-detail.scss',
})
export class GlyphDetailComponent {
  readonly glyph = input.required<FontGlyph>();
  readonly close = output<void>();

  private readonly fontService = inject(FontService);
  private readonly el = inject(ElementRef);

  protected readonly copied = signal(false);

  readonly svgData = computed(() => {
    const g = this.glyph();
    return this.fontService.getGlyphSvgData(g.index);
  });

  readonly unicodeHex = computed(() => {
    const unicode = this.glyph().unicode;
    if (unicode === undefined) return 'N/A';
    return 'U+' + unicode.toString(16).toUpperCase().padStart(4, '0');
  });

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.focus();
    });
  }

  protected copyCharacter(): void {
    const char = this.glyph().character;
    if (char) {
      navigator.clipboard.writeText(char);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.el.nativeElement) {
      this.close.emit();
    }
  }
}
