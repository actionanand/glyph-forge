import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { FontSettings } from '../../models/font.model';

@Component({
  selector: 'app-type-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preview-container">
      <textarea
        class="preview-input"
        [value]="text()"
        (input)="onTextInput($event)"
        placeholder="Type something to preview..."
        rows="2"
        aria-label="Preview text input"
      ></textarea>
      <div
        class="preview-output"
        [style.font-family]="fontFamily()"
        [style.font-size.px]="settings().fontSize"
        [style.letter-spacing.px]="settings().letterSpacing"
        [style.line-height]="settings().lineHeight"
      >
        {{ text() }}
      </div>
    </div>
  `,
  styleUrl: './type-preview.scss',
})
export class TypePreviewComponent {
  readonly fontFamily = input.required<string>();
  readonly settings = input.required<FontSettings>();

  protected readonly text = signal('The quick brown fox jumps over the lazy dog');

  protected onTextInput(event: Event): void {
    this.text.set((event.target as HTMLTextAreaElement).value);
  }
}
