import { Injectable } from '@angular/core';
import { FigureName } from '../../model/figure-name';
import { RealizedFigure } from '../../model/realized-figure';
import { YearOfFigures } from '../../model/year-of-figures';
import { RealizedFigures } from '../../state/realized-figures';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridLinesResolver implements Resolve<RealizedFigures> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RealizedFigures> {
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

    return of(data);
  }
}
