import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RootComponent } from './root/root.component';
import { GridLinesComponent } from './grid-lines/grid-lines.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { realizedReducer } from './store/reducers/realized-reducer';
// import { reducers, metaReducers } from './store/reducers/generated';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RootComponent,
    GridLinesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ScrollingModule,
    StoreModule.forRoot({ realized: realizedReducer } /*reducers, { metaReducers }*/)
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
