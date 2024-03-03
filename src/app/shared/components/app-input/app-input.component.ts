import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { OnChange } from '../../on-change';
import { isArray, isString } from 'lodash';
import { LabelMode } from 'src/app/model/label-mode';

@Component({
  selector: '[app-input]',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss'],
})
export class AppInputComponent implements AfterViewInit {
  @Input()
  inputId: string | null = null;

  @Input()
  @OnChange<LabelMode>(function (this: AppInputComponent, mode, changes) {
    this.setupLabelMode(mode);
  })
  labelMode: LabelMode = 'none';

  @ViewChild('input') textInput: ElementRef<HTMLInputElement> | null = null;

  constructor(private element: ElementRef<HTMLElement>) {}

  get siblingLabel(): HTMLLabelElement | null {
    const node: any =
      this.textInput?.nativeElement.previousSibling ?? this.textInput?.nativeElement.nextSibling;
    if (node?.tagName?.toLowerCase() == 'label') return node;
    return null;
  }

  ngAfterViewInit(): void {
    this.setupLabelMode();
  }

  setupLabelMode(m?: LabelMode) {
    const mode = m ?? this.labelMode;
    const classes = [];
    if (this.siblingLabel == null) return;
    if (mode == null) {
      this.element.nativeElement.style.display = '';
    } else {
      let newClass = '';
      const previousFlex = Array.from(this.element.nativeElement.classList).find(c => c.startsWith('flex-'))
      switch (mode) {
        case 'horizontal-top':
          newClass = 'flex-rtl';
          break;
        case 'horizontal-middle':
          newClass = 'flex-rtl-mdl';
          break;
        case 'horizontal-bottom':
          newClass = 'flex-rtl-btm';
          break;
        case 'above-middle':
          newClass = 'flex-ttb-ctr';
          break;
        case 'below-middle':
          newClass = 'flex-ttb-ctr-btm';
          break;
        case 'none':
          this.siblingLabel.hidden = true;
          return;
      }
      if (previousFlex) this.element.nativeElement.classList.replace(previousFlex, newClass);
      else this.element.nativeElement.classList.add(newClass);
    }
    this.siblingLabel.hidden = false;
  }
}
