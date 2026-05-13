import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface FontFormat {
  name: string;
  full: string;
  ext: string;
  description: string;
  badge: string;
}

const FONT_FORMATS: FontFormat[] = [
  {
    name: 'TTF',
    full: 'TrueType Font',
    ext: '.ttf',
    badge: 'Desktop',
    description:
      'Developed jointly by Apple and Microsoft in the late 1980s as a competitor to Type 1 fonts. Uses quadratic Bézier curves to define glyph outlines. The most universally supported format across all operating systems, applications, and browsers.',
  },
  {
    name: 'OTF',
    full: 'OpenType Font',
    ext: '.otf',
    badge: 'Desktop',
    description:
      'Built on the TrueType standard by Adobe and Microsoft. Supports both PostScript (CFF) and TrueType outlines. Provides advanced typographic features such as ligatures, small caps, swashes, stylistic alternates, and contextual substitutions via OpenType Layout tables.',
  },
  {
    name: 'WOFF',
    full: 'Web Open Font Format',
    ext: '.woff',
    badge: 'Web',
    description:
      'Standardised by the W3C in 2012, WOFF wraps TTF/OTF outlines with zlib compression and adds a metadata block. Reduces file size by roughly 40% compared to raw TTF/OTF, making it ideal for web delivery. Supported by all modern browsers.',
  },
  {
    name: 'WOFF2',
    full: 'Web Open Font Format 2',
    ext: '.woff2',
    badge: 'Web · Recommended',
    description:
      'The W3C successor to WOFF, using the Brotli compression algorithm instead of zlib. Achieves roughly 30% better compression than WOFF, delivering the smallest possible file size for web fonts. The recommended format for web use with broad support across all modern browsers.',
  },
];

@Component({
  selector: 'app-font-formats-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="formats-card">
      <button
        class="formats-toggle"
        (click)="expanded.set(!expanded())"
        [attr.aria-expanded]="expanded()"
      >
        <span class="formats-toggle__inner">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          About supported font formats
        </span>
        <svg
          class="formats-toggle__chevron"
          [class.formats-toggle__chevron--open]="expanded()"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      @if (expanded()) {
        <div class="formats-grid">
          @for (fmt of formats; track fmt.name) {
            <div class="format-item">
              <div class="format-item__header">
                <span class="format-item__name">{{ fmt.name }}</span>
                <span class="format-item__ext">{{ fmt.ext }}</span>
                <span class="format-item__badge">{{ fmt.badge }}</span>
              </div>
              <p class="format-item__full">{{ fmt.full }}</p>
              <p class="format-item__desc">{{ fmt.description }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './font-formats-info.scss',
})
export class FontFormatsInfoComponent {
  protected readonly expanded = signal(false);
  protected readonly formats = FONT_FORMATS;
}
