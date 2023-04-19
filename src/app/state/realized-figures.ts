import { FigureName } from '../model/figure-name';
import { RealizedFigure } from '../model/realized-figure';
import { YearOfFigures } from '../model/year-of-figures';

export class RealizedFigures {
  constructor(
    public names: FigureName[] = [],
    public years: YearOfFigures[] = [],
    public sections: string[] = [],
    public figures: RealizedFigure[] = []) {
  }
}
