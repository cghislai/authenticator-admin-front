import {KeyColumn} from './key-column';

export namespace KeyColumns {

  export interface Column {
    type: KeyColumn;
    field: string;
    header: string;
  }

  export const ID: Column = {
    type: KeyColumn.ID,
    field: 'id',
    header: 'Id',
  };

  export const NAME: Column = {
    type: KeyColumn.NAME,
    field: 'name',
    header: 'Name',
  };

  export const ACTIVE: Column = {
    type: KeyColumn.ACTIVE,
    field: 'active',
    header: 'Active',
  };

  export const FOR_APPLICATION_SECRETS: Column = {
    type: KeyColumn.FOR_APPLICATION_SECRETS,
    field: 'forApplicationSecrets ',
    header: 'Application secrets',
  };

  export const CREATION_DATE_TIME: Column = {
    type: KeyColumn.CREATION_DATE_TIME,
    field: 'creationDateTime ',
    header: 'Created',
  };

  export const COMPONENT_ID: Column = {
    type: KeyColumn.COMPONENT_ID,
    field: 'componentId ',
    header: 'Component',
  };


}
