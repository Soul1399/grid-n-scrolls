import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { GridLinesComponent } from './grid-lines/grid-lines.component';
import { GridLinesResolver } from './services/resolvers/grid-lines.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'angular', component: AppComponent },
  { path: 'grid-lines', component: GridLinesComponent, resolve: { data: () => inject(GridLinesResolver).resolve() } }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
