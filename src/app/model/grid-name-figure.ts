export class GridNameFigure {
  constructor(public code: string, public key: string, public label: string, public type: 'name' | 'section' = 'name', public collapsed: boolean = true) {}
}
