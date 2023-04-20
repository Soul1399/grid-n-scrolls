import { Injectable } from '@angular/core';
import { FigureName } from '../../model/figure-name';
import { RealizedFigure } from '../../model/realized-figure';
import { YearOfFigures } from '../../model/year-of-figures';
import { RealizedFigures } from '../../state/realized-figures';
import { Observable, combineLatest, delay, first, map, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { RealizedPageActions } from 'src/app/store/actions/realized-page.actions';
import { RealizedSelectors } from 'src/app/store/selectors/realized-selectors';
import { AppState } from 'src/app/state/app-state';
import { GridFigures } from 'src/app/model/grid-figures';

@Injectable({
  providedIn: 'root'
})
export class GridLinesResolver {
  constructor(private store: Store<AppState>) {
  }

  resolve(): Observable<{ grids: GridFigures[], allFigures: { [key: string]: number | null } }> {
    const data = new RealizedFigures(
      [new FigureName('1', 'One'), new FigureName('2', 'Two'), new FigureName('3', 'Three')],
      [...Array(10).keys()].map(k => new YearOfFigures(2017 + k)),
      ['current', 'main', 'estimated'],
      [
        new RealizedFigure(2018, '1', 'main', 21),
        new RealizedFigure(2019, '1', 'main', 18.9),
        new RealizedFigure(2020, '1', 'main', 31.09),
        new RealizedFigure(2019, '2', 'main', 5),
        new RealizedFigure(2021, '3', 'main', 35.09),
        new RealizedFigure(2018, '2', 'main', 1.09)
      ]);
    
    this.store.dispatch(RealizedPageActions.init({ realizedData: data }));
    return this.store.select(RealizedSelectors.grids).pipe(
      first(x => x != null),
      delay(1000),
      switchMap(x => {
        this.store.dispatch(RealizedPageActions.initDictionary());
        return combineLatest([this.store.select(RealizedSelectors.allFigures), of(x)]);
      }),
      first(a => a.every(x => x != null)),
      map(([f, g]) => ({ grids: g, allFigures: f }))
    );
  }
}
