import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoggedUserService} from '../logged-user.service';
import {TokenService} from '../token.service';
import {AuthenticatorInfoService} from '../authenticator-info.service';

@Component({
  selector: 'auth-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {

  authenticatorName: Observable<string>;
  loggedUserName: Observable<string>;
  loggedUserIsAdmin: Observable<boolean>;
  loggedUserIsNotNull: Observable<boolean>;

  constructor(private authenticatorInfoService: AuthenticatorInfoService,
              private tokenService: TokenService,
              private loggedUserService: LoggedUserService,
  ) {
  }

  ngOnInit() {
    this.authenticatorName = this.authenticatorInfoService.fetchProviderInfo()
      .pipe(map(info => info.name));
    this.loggedUserName = this.loggedUserService.getLoggedUserObservable()
      .pipe(
        map(user => user == null ? null : user.name),
      );
    this.loggedUserIsAdmin = this.loggedUserService.getLoggedUserObservable()
      .pipe(
        map(user => user == null ? false : user.admin),
      );
    this.loggedUserIsNotNull = this.loggedUserService.getLoggedUserObservable()
      .pipe(
        map(user => user != null),
      );
  }

  onLogout() {
    this.tokenService.clearToken();
  }
}
