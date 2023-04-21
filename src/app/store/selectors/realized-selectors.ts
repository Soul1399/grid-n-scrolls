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

const selectRawData = createSelector(selectRealized, realized => realized.rawData);

const selectDisplayConfig = createSelector(selectRealized, realized => realized.displayConfig);

const selectSortedSections = createSelector(selectRawData, rawData => sortSections(rawData.sections));

const selectSortedYears = createSelector(selectRawData, rawData => sortYears(rawData.years));

const selectNames =  createSelector(selectRawData, rawData => rawData.names);

const selectExtendedMode = createSelector(selectDisplayConfig, conf => conf.extendedMode);

const selectAllRealized = createSelector(selectRealized, state => {
    if (Object.keys(state.allFigures).length == 0) {
        return buildFiguresDictionary(state);
    }
    return state.allFigures;
});

const selectGrids = createSelector(selectRealized, realized => {
    return buildGrids(realized);
});

const selectVisibilityOfOtherSections = createSelector(selectDisplayConfig, conf => {
    return conf.visibleOtherSections;
});

const selectGrid = (section: string) => createSelector(
    selectSortedSections,
    selectSortedYears,
    selectNames,
    selectExtendedMode,
    selectVisibilityOfOtherSections, (sections, years, names, isExtended, visibility) => {
        const grid = buildGrid(section, years, names);
        if (isExtended) {
            const otherSections = sections.filter(s => s !== section).reverse();
            for (let x = grid.names.length - 1; x > -1; x--) {
                if (visibility[section] &&
                    visibility[section].includes(grid.names[x].code)) {
                    grid.names[x].collapsed = false;
                    otherSections.forEach(s => grid.names.splice(x+1, 0, new GridNameFigure(
                        grid.names[x].code,
                        `${s}/${grid.names[x].code}`,
                        s,
                        'section')));
                }
                else {
                    grid.names[x].collapsed = true;
                }
            }
        }
        return grid;
    });

function buildGrids(state: RealizedState) {
    const years = sortYears(state.rawData.years);
    const grids = sortSections(state.rawData.sections).map(s => buildGrid(s, years, state.rawData.names));
    
    return grids;
}

function buildGrid(section: string, years: YearOfFigures[], names: FigureName[]) {
    return new GridFigures(
        section,
        'names',
        years,
        names.map(n => new GridNameFigure(n.code, `${section}/${n.code}`, n.name, 'name')));
}

export function buildFiguresDictionary(state: RealizedState) {
    const figuresDic: { [key: string]: number | null } = {};
    const years = sortYears(state.rawData.years);
    sortSections(state.rawData.sections).forEach(s => {
        state.rawData.names.forEach(n => {
            years.forEach(y => {
                figuresDic[`${s}/${n.code}/${y.year}`] = state.rawData.figures.find(x => x.codeName === n.code && x.year === y.year && x.section === s)?.value ?? null;
            });
        });
    });
    return figuresDic;
}

function sortSections(rawSections: string[]) {
    const sections = rawSections.filter(s => s !== MAIN_SECTION) || [];
    sections.sort();
    sections.unshift(MAIN_SECTION);
    return sections;
}

function sortYears(rawYears: YearOfFigures[]) {
    const years = rawYears.slice();
    years.sort((a, b) => a.year < b.year ? -1 : a.year > b.year ? 1 : 0);
    return years;
}

export const RealizedSelectors = {
    sections: selectSortedSections,
    allFigures: selectAllRealized,
    grids: selectGrids,
    getGrid: selectGrid
};
