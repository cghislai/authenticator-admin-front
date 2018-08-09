import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserAreaComponent} from './user-area/user-area.component';
import {UserInfoComponent} from './user-info/user-info.component';

const routes: Routes = [
  {
    path: '',
    component: UserAreaComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'me',
      },
      {
        path: 'me',
        component: UserInfoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAreaRoutingModule {
}
