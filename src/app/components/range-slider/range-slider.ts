import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="slider">
      <div class="slider__header">
        <label class="slider__label" [attr.for]="sliderId">{{ label() }}</label>
        <span class="slider__value">{{ value() }}{{ suffix() }}</span>
      </div>
      <input
        type="range"
        class="slider__input"
        [id]="sliderId"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        (input)="onInput($event)"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="value()"
        [attr.aria-label]="label() + ' ' + value() + suffix()"
      />
    </div>
  `,
  styleUrl: './range-slider.scss',
})
export class RangeSliderComponent {
  private static idCounter = 0;

  readonly label = input.required<string>();
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly value = input(0);
  readonly suffix = input('');
  readonly valueChange = output<number>();

  protected readonly sliderId = `slider-${++RangeSliderComponent.idCounter}`;
  protected readonly displayValue = computed(() => `${this.value()}${this.suffix()}`);

  protected onInput(event: Event): void {
    this.valueChange.emit(+(event.target as HTMLInputElement).value);
  }
}
