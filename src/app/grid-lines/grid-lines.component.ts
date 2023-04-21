import { inject, Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { GridFigures } from '../model/grid-figures';
import { RealizedFigures } from '../state/realized-figures';
import { GridNameFigure } from '../model/grid-name-figure';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { AppState } from '../state/app-state';
import { Store } from '@ngrx/store';
import { RealizedSelectors } from '../store/selectors/realized-selectors';
import { RealizedPageActions } from '../store/actions/realized-page.actions';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-grid-lines',
  templateUrl: './grid-lines.component.html',
  styleUrls: ['./grid-lines.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridLinesComponent implements OnInit, OnDestroy {
  readonly MainSection = 'main';
  readonly ScrollDivClass = 'middle';
  allFigures$ = new BehaviorSubject<{ [key: string]: number | null }>({});

  sections$ = this.store.select(RealizedSelectors.sections);
  grids$: { [s: string]: Observable<GridFigures> } = {};

  sbcbScroll: Subscription;

  initialData: RealizedFigures | null = null;

  constructor(private store: Store<AppState>, private activatedRoute: ActivatedRoute) {
    this.sbcbScroll = inject(ScrollDispatcher)
      .scrolled()
      .pipe(
        map(x => x as CdkScrollable),
        filter(x => x != null && x.getElementRef().nativeElement.classList.contains(this.ScrollDivClass)))
      .subscribe(s => {
        const middle = s.getElementRef().nativeElement;
        const others = Array.from(document.querySelectorAll(`.${this.ScrollDivClass}`)).filter(x => x != middle);
        others.forEach(div => div.scrollLeft = middle.scrollLeft);
      });
  }

  ngOnInit() {
    const data = this.activatedRoute.snapshot.data['data'] as { grids: GridFigures[], allFigures: { [key: string]: number | null } };
    this.allFigures$.next(cloneDeep(data.allFigures));
    this.sections$.pipe(first()).subscribe(a => a.forEach(s => this.grids$[s] = this.store.select(RealizedSelectors.getGrid(s))));
  }

  onChangedFigure(key: string, value: number | null) {
    this.store.dispatch(RealizedPageActions.figureChanged({ key, value }));
  }

  toggleExtended(section: string, name: GridNameFigure) {
    this.store.dispatch(RealizedPageActions.toggleFigures({ section, name: name.code }));
  }

  ngOnDestroy(): void {
    this.sbcbScroll.unsubscribe();
  }
}
