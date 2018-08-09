import {Component, OnInit} from '@angular/core';
import {TokenService} from '../token.service';
import {WsUser} from '@charlyghislain/core-web-api';
import {Router} from '@angular/router';
import {LoggedUserService} from '../logged-user.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  name: string;
  password: string;

  constructor(private tokenService: TokenService,
              private loggedUserService: LoggedUserService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.tokenService.login(this.name, this.password)
      .subscribe(() => this.onLoginSuccess(),
        error => this.onLoginError(error));
  }

  private onLoginSuccess() {
    this.loggedUserService.waitNextLoggedUser()
      .subscribe(user => this.onUserLogged(user));
  }

  private onLoginError(error: any) {
  }

  private onUserLogged(user: WsUser) {
    if (user.passwordExpired) {
      // TODO
    }
    if (user.admin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/me']);
    }
  }
}
