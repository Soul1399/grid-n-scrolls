import { createReducer, on } from "@ngrx/store";
import { RealizedPageActions } from "src/app/store/actions/realized-page.actions";
import { defaultRealizedState } from "src/app/state/realized-state";
import * as RealizedSelectors from "../selectors/realized-selectors";
import { RealizedFigures } from "src/app/state/realized-figures";
import { cloneDeep } from "lodash";

export const realizedReducer = createReducer(
    defaultRealizedState,
    on(RealizedPageActions.init, (state, { realizedData }) => {
        const realized = realizedData as RealizedFigures;
        return { ...state, rawData: realized };
    }),
    on(RealizedPageActions.initDictionary, state => {
        if (Object.keys(state.allFigures).length == 0) {
            return { ...state, allFigures: RealizedSelectors.buildFiguresDictionary(state) };
        }
        return state;
    }),
    on(RealizedPageActions.toggleFigures, (state, { section, name }) => {
        if (!state.displayConfig.extendedMode) return state;
        const visibilityNames = cloneDeep(state.displayConfig.visibleOtherSections);
        if (visibilityNames[section]) {
            visibilityNames[section] = visibilityNames[section].includes(name)
                ? visibilityNames[section].filter(x => x !== name)
                : visibilityNames[section].concat([name]);
        }
        else {
            visibilityNames[section] = [name];
        }
        return { ...state,
            displayConfig: { ...state.displayConfig,
                visibleOtherSections: { ...state.displayConfig.visibleOtherSections,
                    [section]: visibilityNames[section] } } };
    }),
    on(RealizedPageActions.figureChanged, (state, { key, value }) => {
        const values = state.stackOfchanges.slice();
        values.push([{ [key]: value }]);
        if (values.length > state.stackSize) values.shift();
        return { ...state, stackOfchanges: values };
    })
);