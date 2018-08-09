import {ComponentColumn} from './component-column';

export namespace ComponentColumns {

  export interface Column {
    type: ComponentColumn;
    field: string;
    header: string;
  }

  export const ID: Column = {
    type: ComponentColumn.ID,
    field: 'id',
    header: 'Id',
  };

  export const NAME: Column = {
    type: ComponentColumn.NAME,
    field: 'name',
    header: 'Name',
  };

  export const ENDPOINT_URL: Column = {
    type: ComponentColumn.ENDPOINT_URL,
    field: 'endpointUrl',
    header: 'URL',
  };

  export const ACTIVE: Column = {
    type: ComponentColumn.ACTIVE,
    field: 'active',
    header: 'Active',
  };

}
