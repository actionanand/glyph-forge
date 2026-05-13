import { Injectable, signal, computed } from '@angular/core';
import { parse, Font } from 'opentype.js';
import { FontGlyph, FontMetadata, LoadedFont, GlyphSvgData } from '../models/font.model';

const VALID_EXTENSIONS = ['otf', 'ttf', 'woff', 'woff2'];

@Injectable({ providedIn: 'root' })
export class FontService {
  readonly loadedFont = signal<LoadedFont | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isLoaded = computed(() => this.loadedFont() !== null);

  private fontCounter = 0;
  private currentFontFace: FontFace | null = null;
  private opentypeFont: Font | null = null;

  async loadFont(file: File): Promise<void> {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!VALID_EXTENSIONS.includes(ext)) {
      this.error.set('Invalid file type. Please upload OTF, TTF, WOFF, or WOFF2 files.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const buffer = await file.arrayBuffer();
      const font = parse(buffer);

      this.removeFontFace();

      const fontFaceName = `glyph-forge-font-${++this.fontCounter}`;
      const fontFace = new FontFace(fontFaceName, buffer);
      await fontFace.load();
      document.fonts.add(fontFace);
      this.currentFontFace = fontFace;
      this.opentypeFont = font;

      const metadata = this.extractMetadata(font);
      const glyphs = this.extractGlyphs(font);

      this.loadedFont.set({ metadata, glyphs, fontFaceName, fileName: file.name });
    } catch {
      this.error.set('Failed to parse font file. The file may be corrupted or invalid.');
    } finally {
      this.isLoading.set(false);
    }
  }

  removeFont(): void {
    this.removeFontFace();
    this.opentypeFont = null;
    this.loadedFont.set(null);
    this.error.set(null);
  }

  getGlyphSvgData(glyphIndex: number, fontSize = 200): GlyphSvgData | null {
    if (!this.loadedFont() || !this.opentypeFont) return null;

    const font = this.opentypeFont;
    const glyph = font.glyphs.get(glyphIndex);
    const scale = fontSize / font.unitsPerEm;
    const padding = 30;

    const advanceWidth = glyph.advanceWidth || font.unitsPerEm * 0.5;
    const width = advanceWidth * scale + padding * 2;
    const height = (font.ascender - font.descender) * scale + padding * 2;
    const baselineY = font.ascender * scale + padding;
    const advanceX = padding + advanceWidth * scale;

    const path = glyph.getPath(padding, baselineY, fontSize);
    const pathData = path.toPathData(2);

    return { pathData, width, height, baselineY, advanceX, padding };
  }

  private removeFontFace(): void {
    if (this.currentFontFace) {
      document.fonts.delete(this.currentFontFace);
      this.currentFontFace = null;
    }
  }

  private extractMetadata(font: Font): FontMetadata {
    const names = font.names;
    return {
      fontFamily: names.fontFamily?.['en'] || 'Unknown',
      fontSubfamily: names.fontSubfamily?.['en'] || 'Unknown',
      version: names.version?.['en'] || 'Unknown',
      designer: names.designer?.['en'] || 'Unknown',
      description: names.description?.['en'] || '',
      license: names.license?.['en'] || '',
      unitsPerEm: font.unitsPerEm,
      ascender: font.ascender,
      descender: font.descender,
      numberOfGlyphs: font.glyphs.length,
    };
  }

  private extractGlyphs(font: Font): FontGlyph[] {
    const glyphs: FontGlyph[] = [];
    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      glyphs.push({
        name: glyph.name || `glyph-${i}`,
        unicode: glyph.unicode,
        character: glyph.unicode ? String.fromCodePoint(glyph.unicode) : '',
        advanceWidth: glyph.advanceWidth ?? 0,
        index: i,
      });
    }
    return glyphs;
  }
}
