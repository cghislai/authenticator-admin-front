import {HttpResponse} from '@angular/common/http';
import {HeaderConstants} from '../domain/header-constants';
import {ListResult} from '../domain/list-result';

export class ListResultsUtils {

  static wrapResponse<T>(response: HttpResponse<T[]>): ListResult<T> {
    const totalCOUntHeaderValue = response.headers.get(HeaderConstants.LIST_RESULT_TOTAL_COUNT_HEADER);
    const totalCount: number = parseInt(totalCOUntHeaderValue, 10);
    return {
      values: response.body,
      totalCount: isNaN(totalCount) ? null : totalCount,
    };
  }
}
