import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FontService } from '../../services/font.service';
import { FontGlyph, FontSettings, DEFAULT_FONT_SETTINGS } from '../../models/font.model';
import { FileDropZoneComponent } from '../../components/file-drop-zone/file-drop-zone';
import { FontInfoComponent } from '../../components/font-info/font-info';
import { TypePreviewComponent } from '../../components/type-preview/type-preview';
import { FontAdjustmentsComponent } from '../../components/font-adjustments/font-adjustments';
import { GlyphGridComponent } from '../../components/glyph-grid/glyph-grid';
import { GlyphDetailComponent } from '../../components/glyph-detail/glyph-detail';
import { FontFormatsInfoComponent } from '../../components/font-formats-info/font-formats-info';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FileDropZoneComponent,
    FontInfoComponent,
    TypePreviewComponent,
    FontAdjustmentsComponent,
    GlyphGridComponent,
    GlyphDetailComponent,
    FontFormatsInfoComponent,
  ],
  template: `
    @if (fontService.isLoaded()) {
      <div class="viewer">
        <app-font-info
          [metadata]="fontService.loadedFont()!.metadata"
          [fileName]="fontService.loadedFont()!.fileName"
        />

        <section class="viewer__preview-section">
          <app-type-preview
            [fontFamily]="fontService.loadedFont()!.fontFaceName"
            [settings]="settings()"
          />
          <app-font-adjustments [(settings)]="settings" />
        </section>

        <app-glyph-grid
          [glyphs]="fontService.loadedFont()!.glyphs"
          [fontFamily]="fontService.loadedFont()!.fontFaceName"
          (glyphSelected)="selectedGlyph.set($event)"
        />
      </div>

      @if (selectedGlyph()) {
        <app-glyph-detail [glyph]="selectedGlyph()!" (close)="selectedGlyph.set(null)" />
      }
    } @else {
      <section class="upload-section">
        <div class="upload-hero">
          <h2>Explore Your Fonts</h2>
          <p>Upload a font file to preview glyphs, test typography, and inspect details</p>
        </div>
        <app-file-drop-zone (fileSelected)="onFileSelected($event)" />
        <app-font-formats-info />
        @if (fontService.isLoading()) {
          <div class="loading-spinner" role="status" aria-label="Loading font">
            <span class="spinner"></span>
            <p class="loading-text">Parsing font file...</p>
          </div>
        }
        @if (fontService.error()) {
          <p class="error-message" role="alert">{{ fontService.error() }}</p>
        }
      </section>
    }
  `,
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly fontService = inject(FontService);
  protected readonly settings = signal<FontSettings>(DEFAULT_FONT_SETTINGS);
  protected readonly selectedGlyph = signal<FontGlyph | null>(null);

  protected async onFileSelected(file: File): Promise<void> {
    await this.fontService.loadFont(file);
  }
}
