export class YearOfFigures {
  constructor(public year: number, public name: string | null = null) {}

  get label(): string {
    return this.year + (this.name ?? '');
  }
}
