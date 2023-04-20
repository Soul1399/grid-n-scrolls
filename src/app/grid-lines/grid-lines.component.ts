import { inject, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GridFigures } from '../model/grid-figures';
import { RealizedFigures } from '../state/realized-figures';
import { GridNameFigure } from '../model/grid-name-figure';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-grid-lines',
  templateUrl: './grid-lines.component.html',
  styleUrls: ['./grid-lines.component.scss']
})
export class GridLinesComponent implements OnInit, OnDestroy {
  readonly MainSection = 'main';
  readonly ScrollDivClass = 'middle';
  data$ = new BehaviorSubject<GridFigures[]>([]);
  allFigures$ = new BehaviorSubject<{ [key: string]: number | null }>({});

  sbcbScroll: Subscription;

  initialData: RealizedFigures | null = null;

  constructor(private activatedRoute: ActivatedRoute) {
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
    //this.setupViewModel();

    const data = this.activatedRoute.snapshot.data['data'] as { grids: GridFigures[], allFigures: { [key: string]: number | null } };
    this.allFigures$.next(data.allFigures);
    this.data$.next(data.grids);
  }

  getSortedSections() {
    const sections = this.initialData?.sections.filter(s => s !== this.MainSection) || [];
    sections.sort();
    sections.unshift(this.MainSection);
    return sections;
  }

  setupViewModel() {
    this.initialData = Object.assign(new RealizedFigures(), this.activatedRoute.snapshot.data['data']);

    if (this.data$.getValue().length > 0) return;
    if (this.initialData == null) {
      this.allFigures$.next({});
      return;
    }

    const data = this.initialData;
    const sections = this.getSortedSections();
    const years = data.years.slice();
    years.sort((a, b) => a.year < b.year ? -1 : a.year > b.year ? 1 : 0);
    const grids = sections.map(s => new GridFigures(
      s,
      'names',
      years,
      data.names.map(n => new GridNameFigure(n.code, `${s}/${n.code}`, n.name, 'name'))));

    const figures: { [key: string]: number | null } = {};
    sections.forEach(s => {
      data.names.forEach(n => {
        years.forEach(y => {
          figures[`${s}/${n.code}/${y.year}`] = data.figures.find(x => x.codeName === n.code && x.year === y.year && x.section === s)?.value ?? null;
        });
      });
    });

    this.allFigures$.next(figures);
    this.data$.next(grids);
  }

  toggleExtended(section: string, name: GridNameFigure) {
    if (this.initialData == null) return;
    const data = this.initialData;
    const grids = this.data$.getValue();
    const dataIndex = grids.findIndex(x => x.title === section);
    if (grids[dataIndex].names.some(n => n.key != `${section}/${name.code}` && n.code === name.code)) {
      grids[dataIndex].names = grids[dataIndex].names.filter(n => n.code !== name.code || n.key == `${section}/${name.code}`);
      grids[dataIndex].names.filter(n => n.code === name.code).forEach(n => n.collapsed = true);
    }
    else {
      const sections = this.getSortedSections().filter(s => s !== section);
      const updatedNames = grids[dataIndex].names.slice();
      const indexOfName = updatedNames.findIndex(n => n.code === name.code);
      updatedNames[indexOfName].collapsed = false;
      updatedNames.splice(indexOfName + 1, 0, ...sections.map(s => new GridNameFigure(name.code, `${s}/${name.code}`, s, 'section')));

      grids[dataIndex].names = updatedNames;
    }
  }

  ngOnDestroy(): void {
    this.sbcbScroll.unsubscribe();
  }
}
