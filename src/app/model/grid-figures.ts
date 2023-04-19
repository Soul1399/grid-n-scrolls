import { YearOfFigures } from '../model/year-of-figures';
import { GridNameFigure } from '../model/grid-name-figure';

export class GridFigures {
  constructor(
    public title: string,
    public subtitle: string,
    public years: YearOfFigures[],
    public names: GridNameFigure[]) {
  }

  get gridTemplate(): string {
    return `repeat(${this.years.length}, minmax(10ch, 20ch))`;
  }
}
