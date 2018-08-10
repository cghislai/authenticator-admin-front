import {ApplicationColumn} from './application-column';

export namespace ApplicationColumns {

  export interface Column {
    type: ApplicationColumn;
    field: string;
    header: string;
  }

  export const ID: Column = {
    type: ApplicationColumn.ID,
    field: 'id',
    header: 'Id',
  };

  export const NAME: Column = {
    type: ApplicationColumn.NAME,
    field: 'name',
    header: 'Name',
  };

  export const ENDPOINT_URL: Column = {
    type: ApplicationColumn.ENDPOINT_URL,
    field: 'endpointUrl',
    header: 'URL',
  };

  export const ACTIVE: Column = {
    type: ApplicationColumn.ACTIVE,
    field: 'active',
    header: 'Active',
  };

  export const CREATION_DATE_TIME: Column = {
    type: ApplicationColumn.CREATION_DATE_TIME,
    field: 'creationDateTime',
    header: 'Created',
  };

  export const CAN_RESET_USER_PASSWORD: Column = {
    type: ApplicationColumn.CAN_RESET_USER_PASSWORD,
    field: 'canResetUserPassword',
    header: 'Can reset user passwords',
  };

  export const CAN_VERIFY_USER_EMAIL: Column = {
    type: ApplicationColumn.CAN_VERIFY_USER_EMAIL,
    field: 'canVerifyUserEmail',
    header: 'Can verify user email',
  };

  export const ADDED_USERS_ARE_ACTIVE: Column = {
    type: ApplicationColumn.ADDED_USERS_ARE_ACTIVE,
    field: 'addedUsersAreActive',
    header: 'Added users are active',
  };

  export const USERS_ARE_ADDED_ON_TOKEN_REQUEST: Column = {
    type: ApplicationColumn.USERS_ARE_ADDED_ON_TOKEN_REQUEST,
    field: 'existingUsersAreAddedOnTokenRequest',
    header: 'Users are added on token request',
  };

}
