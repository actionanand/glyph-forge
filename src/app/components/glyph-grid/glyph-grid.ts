import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { FontGlyph } from '../../models/font.model';

@Component({
  selector: 'app-glyph-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="glyph-section">
      <div class="glyph-header">
        <h3>
          Glyphs
          <span class="glyph-count">{{ filteredGlyphs().length }}</span>
        </h3>
        <input
          type="search"
          class="glyph-search"
          placeholder="Search glyphs..."
          [value]="searchQuery()"
          (input)="onSearch($event)"
          aria-label="Search glyphs by character, name, or unicode"
        />
      </div>
      <div class="glyph-grid" role="grid" aria-label="Font glyphs">
        @for (glyph of filteredGlyphs(); track glyph.index) {
          <button
            class="glyph-cell"
            (click)="glyphSelected.emit(glyph)"
            [attr.aria-label]="
              glyph.name + (glyph.character ? ', character ' + glyph.character : '')
            "
            [title]="glyph.name"
          >
            <span class="glyph-cell__char" [style.font-family]="fontFamily()">{{
              glyph.character || '□'
            }}</span>
            <span class="glyph-cell__label">{{
              glyph.unicode !== undefined ? formatUnicode(glyph.unicode) : glyph.name
            }}</span>
          </button>
        }
      </div>
      @if (filteredGlyphs().length === 0) {
        <p class="glyph-empty">No glyphs found matching your search.</p>
      }
    </section>
  `,
  styleUrl: './glyph-grid.scss',
})
export class GlyphGridComponent {
  readonly glyphs = input.required<FontGlyph[]>();
  readonly fontFamily = input.required<string>();
  readonly glyphSelected = output<FontGlyph>();

  protected readonly searchQuery = signal('');

  protected readonly filteredGlyphs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allGlyphs = this.glyphs();

    if (!query) {
      return allGlyphs.filter((g) => g.unicode !== undefined);
    }

    return allGlyphs.filter((g) => {
      if (g.character && g.character.toLowerCase().includes(query)) return true;
      if (g.name.toLowerCase().includes(query)) return true;
      if (g.unicode !== undefined) {
        const hex = g.unicode.toString(16).toUpperCase().padStart(4, '0');
        if (hex.includes(query.toUpperCase().replace('U+', ''))) return true;
      }
      return false;
    });
  });

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected formatUnicode(unicode: number): string {
    return 'U+' + unicode.toString(16).toUpperCase().padStart(4, '0');
  }
}
