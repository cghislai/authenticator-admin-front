import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LoggedUserGuard} from './logged-user.guard';
import {LoggedAdminGuard} from './logged-admin.guard';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user',
    loadChildren: './user/user-area.module#UserAreaModule',
    canActivate: [LoggedUserGuard],
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [LoggedAdminGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
