import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { toNumber } from 'lodash';

@Component({
  selector: 'app-decimal-input',
  templateUrl: './decimal-input.component.html',
  styleUrls: ['./decimal-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecimalInputComponent {
  @Input()
  decimalValue: number | null = null;
  @Output()
  decimalValueChange = new EventEmitter<number | null>();
  @Input()
  allowEdit = true;

  @ViewChild('input') elementRef: ElementRef<HTMLInputElement> | null = null;

  get displayedValue() {
    return this.decimalValue?.toFixed(3) || null;
  }

  onFocus(e: Event) {
    if (this.elementRef?.nativeElement !== e.target) return;
    this.elementRef.nativeElement.value = this.decimalValue?.toString() || '';
  }

  onBlur(e: Event) {
    if (this.elementRef?.nativeElement !== e.target) return;
    this.elementRef.nativeElement.value = this.displayedValue || '';
  }

  preventNaN(event: InputEvent) {
    const val = event.data || '';
    if (!this.allowEdit || /[^\d\.\-]/g.test(val)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onChange(e: Event) {
    if (!this.allowEdit) return;
    const value = toNumber((e.target as HTMLInputElement)?.value);
    this.decimalValueChange.emit(isNaN(value) ? null : value);
  }
}
