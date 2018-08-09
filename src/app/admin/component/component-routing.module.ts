import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComponentListComponent} from './component-list/component-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: ComponentListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentRoutingModule {
}
