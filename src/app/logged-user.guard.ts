import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LoggedUserService} from './logged-user.service';
import {defaultIfEmpty, mapTo, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserGuard implements CanActivate {

  constructor(private loggedUserService: LoggedUserService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.loggedUserService.getLoggedUser()
      .pipe(
        mapTo(true),
        defaultIfEmpty(false),
        tap(a => this.onAuthorized(a, state.url)),
      );
  }


  private onAuthorized(auth: boolean, next: string) {
    if (!auth) {
      this.router.navigate(['/login', {
        next: next,
      }]);
    }
  }
}
