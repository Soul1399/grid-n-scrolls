import { RealizedDisplayConfig } from "./realized-display-config";
import { RealizedFigures } from "./realized-figures";

export interface RealizedState {
    rawData: RealizedFigures;
    allFigures: { [key: string]: number | null };
    displayConfig: RealizedDisplayConfig;
    stackOfchanges: { [key: string]: number | null };
}

export const defaultRealizedState: RealizedState = {
    rawData: new RealizedFigures(),
    allFigures: {},
    displayConfig: new RealizedDisplayConfig(),
    stackOfchanges: {}
};