import {UserColumn} from './user-column';

export namespace UserColumns {

  export interface Column {
    type: UserColumn;
    field: string;
    header: string;
  }

  export const ID: Column = {
    type: UserColumn.ID,
    field: 'id',
    header: 'Id',
  };

  export const NAME: Column = {
    type: UserColumn.NAME,
    field: 'name',
    header: 'Name',
  };

  export const EMAIL: Column = {
    type: UserColumn.EMAIL,
    field: 'email',
    header: 'Email',
  };

  export const ACTIVE: Column = {
    type: UserColumn.ACTIVE,
    field: 'active',
    header: 'Active',
  };

  export const ADMIN: Column = {
    type: UserColumn.ADMIN,
    field: 'admin ',
    header: 'Admin',
  };


  export const EMAIL_VERIFIED: Column = {
    type: UserColumn.EMAIL_VERIFIED,
    field: 'emailVerified ',
    header: 'Email verified',
  };


  export const PASSWORD_EXPIRED: Column = {
    type: UserColumn.PASSWORD_EXPIRED,
    field: 'passwordExpired ',
    header: 'Password expired',
  };


}
