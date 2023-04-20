import { createSelector } from "@ngrx/store";
import { FigureName } from "src/app/model/figure-name";
import { GridFigures } from "src/app/model/grid-figures";
import { GridNameFigure } from "src/app/model/grid-name-figure";
import { RealizedFigure } from "src/app/model/realized-figure";
import { YearOfFigures } from "src/app/model/year-of-figures";
import { AppState } from "src/app/state/app-state";
import { RealizedState } from "src/app/state/realized-state";

const MAIN_SECTION: string = 'main';

const selectRealized = (state: AppState) => state.realized;

const selectSortedSections = createSelector(selectRealized, state => sortSections(state));

const selectSortedYears = createSelector(selectRealized, state => sortYears(state));

const selectAllRealized = createSelector(selectRealized, state => {
    if (Object.keys(state.allFigures).length == 0) {
        return buildFiguresDictionary(state);
    }
    return state.allFigures;
});

const selectGrids = createSelector(selectRealized, selectSortedSections, selectSortedYears, (rz, sections, years) => {
    return buildGrids(sections, years, rz.rawData.names);
});

const selectGrid = (section: string) => createSelector(
    selectRealized, selectSortedSections, selectSortedYears, (rz, sections, years) => {
        return buildGrids(sections.filter(s => s === section), years, rz.rawData.names);
    });

export function buildGrids(sections: string[], years: YearOfFigures[], names: FigureName[]) {
    const grids = sections.map(s => new GridFigures(
        s,
        'names',
        years,
        names.map(n => new GridNameFigure(n.code, `${s}/${n.code}`, n.name, 'name'))));
    
    return grids;
}

export function buildFiguresDictionary(state: RealizedState) {
    const figuresDic: { [key: string]: number | null } = {};
    const years = sortYears(state);
    sortSections(state).forEach(s => {
        state.rawData.names.forEach(n => {
            years.forEach(y => {
                figuresDic[`${s}/${n.code}/${y.year}`] = state.rawData.figures.find(x => x.codeName === n.code && x.year === y.year && x.section === s)?.value ?? null;
            });
        });
    });
    return figuresDic;
}

function sortSections(state: RealizedState) {
    const sections = state.rawData.sections.filter(s => s !== MAIN_SECTION) || [];
    sections.sort();
    sections.unshift(MAIN_SECTION);
    return sections;
}

function sortYears(state: RealizedState) {
    const years = state.rawData.years.slice();
    years.sort((a, b) => a.year < b.year ? -1 : a.year > b.year ? 1 : 0);
    return years;
}

export const RealizedSelectors = {
    allFigures: selectAllRealized,
    grids: selectGrids,
    getGrid: selectGrid
};
