import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminAreaComponent} from './admin-area/admin-area.component';

const routes: Routes = [
  {
    path: '',
    component: AdminAreaComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'component',
      },
      {
        path: 'component',
        loadChildren: './component/component.module#ComponentModule',
      },
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
      },
      {
        path: 'key',
        loadChildren: './key/key.module#KeyModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
