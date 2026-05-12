export interface FontGlyph {
  name: string;
  unicode: number | undefined;
  character: string;
  advanceWidth: number;
  index: number;
}

export interface FontMetadata {
  fontFamily: string;
  fontSubfamily: string;
  version: string;
  designer: string;
  description: string;
  license: string;
  unitsPerEm: number;
  ascender: number;
  descender: number;
  numberOfGlyphs: number;
}

export interface FontSettings {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
}

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  fontSize: 48,
  letterSpacing: 0,
  lineHeight: 1.4,
};

export interface LoadedFont {
  metadata: FontMetadata;
  glyphs: FontGlyph[];
  fontFaceName: string;
  fileName: string;
}

export interface GlyphSvgData {
  pathData: string;
  width: number;
  height: number;
  baselineY: number;
  advanceX: number;
  padding: number;
}
