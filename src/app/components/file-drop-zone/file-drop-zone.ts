import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';

const VALID_EXTENSIONS = ['otf', 'ttf', 'woff', 'woff2'];

@Component({
  selector: 'app-file-drop-zone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
  template: `
    <div
      class="drop-zone"
      [class.drag-over]="isDragOver()"
      (click)="fileInput.click()"
      role="button"
      tabindex="0"
      (keydown.enter)="fileInput.click()"
      (keydown.space)="$event.preventDefault(); fileInput.click()"
      aria-label="Upload font file. Accepts OTF, TTF, WOFF, and WOFF2 formats"
    >
      <input
        #fileInput
        type="file"
        accept=".otf,.ttf,.woff,.woff2"
        (change)="onFileSelected($event)"
        hidden
        aria-hidden="true"
      />

      <div class="drop-zone__icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <p class="drop-zone__title">
        @if (isDragOver()) {
          Drop your font here
        } @else {
          Drop font file or click to browse
        }
      </p>
      <p class="drop-zone__subtitle">Supports OTF, TTF, WOFF, WOFF2</p>

      @if (errorMessage()) {
        <p class="drop-zone__error" role="alert">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styleUrl: './file-drop-zone.scss',
})
export class FileDropZoneComponent {
  readonly fileSelected = output<File>();

  protected readonly isDragOver = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file);
    }
    input.value = '';
  }

  private processFile(file: File): void {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!VALID_EXTENSIONS.includes(ext)) {
      this.errorMessage.set(
        'Invalid file type. Please upload OTF, TTF, WOFF, or WOFF2 files only.',
      );
      return;
    }
    this.errorMessage.set(null);
    this.fileSelected.emit(file);
  }
}
