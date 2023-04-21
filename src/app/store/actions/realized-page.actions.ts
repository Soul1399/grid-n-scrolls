import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const RealizedPageActions = createActionGroup({
  source: 'Realized Page',
  events: {
    'Init': props<{ realizedData: any }>(),
    'Init Dictionary': emptyProps(),
    // defining an event without payload using the `emptyProps` function
    //'Opened': emptyProps(),
    'Toggle Figures': props<{ section: string, name: string }>(),
    
    'Figure Changed': props<{ key: string; value: number | null }>(),
    
    // defining an event with payload using the props factory
    //'Query Changed': (query: string) => ({ query }),
  }
});