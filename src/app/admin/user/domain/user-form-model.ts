import {WsUser} from '@charlyghislain/authenticator-admin-api';

export interface UserFormModel {
  user: WsUser;
  updatePassword: boolean;
  newPassword: string;
  newUser: boolean;
}
