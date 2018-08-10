import {Component, Input, OnInit} from '@angular/core';
import {LoggedUserService} from '../../logged-user.service';
import {WsUser} from '@charlyghislain/authenticator-admin-api';

@Component({
  selector: 'auth-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss'],
})
export class UserInfoFormComponent implements OnInit {

  @Input()
  set user(value: WsUser) {
    this.value = Object.assign({}, value);
  }

  value: WsUser;
  newPassword: string;
  newPasswordConfirm: string;

  constructor(private loggedUserService: LoggedUserService) {
  }

  ngOnInit() {
  }

  updateName(event: any) {
    this.loggedUserService.updateUserName(this.value.name);
  }

  updateEmail(event: any) {
    this.loggedUserService.updateUserMail(this.value.email);
  }

  updatePassword() {
    if (this.newPassword !== this.newPasswordConfirm) {
      return;
    }
    this.loggedUserService.updateUserPassword(this.newPassword);
  }
}
