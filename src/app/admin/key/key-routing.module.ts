import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KeyListComponent} from './key-list/key-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: KeyListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeyRoutingModule {
}
