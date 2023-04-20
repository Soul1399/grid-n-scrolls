import { createReducer, on } from "@ngrx/store";
import { RealizedPageActions } from "src/app/store/actions/realized-page.actions";
import { defaultRealizedState } from "src/app/state/realized-state";
import * as RealizedSelectors from "../selectors/realized-selectors";
import { RealizedFigures } from "src/app/state/realized-figures";

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
    on(RealizedPageActions.toggleFigures, state => state),
);