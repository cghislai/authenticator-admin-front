import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from '../token.service';
import {WsUser} from '@charlyghislain/core-web-api';
import {ActivatedRoute, Router} from '@angular/router';
import {LoggedUserService} from '../logged-user.service';
import {Subscription} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';
import {RouteConstants} from '../utils/routes-constants';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  name: string;
  password: string;

  subscription: Subscription;

  constructor(private tokenService: TokenService,
              private loggedUserService: LoggedUserService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.loggedUserService.getLoggedUserObservable()
      .pipe(filter(user => user != null))
      .subscribe(user => this.onUserLogged(user));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.tokenService.login(this.name, this.password);
  }

  private onUserLogged(user: WsUser) {
    if (user.passwordExpired) {
      // TODO
    }
    this.route.params.pipe(
      take(1),
      map(params => params[RouteConstants.LOGIN_REDIRECT_PARAM]),
    ).subscribe(next => this.redirectUser(user, next));
  }

  private redirectUser(user: WsUser, next: string) {
    if (next != null) {
      this.router.navigateByUrl(next);
    } else if (user.admin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/user']);
    }
  }
}
