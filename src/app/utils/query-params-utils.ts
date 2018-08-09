export class QueryParamsUtils {

  static toQueryParams(...values: any[]) {
    return values
      .map(val => QueryParamsUtils.filterOutNulls(val))
      .reduce((cur, next) => Object.assign({}, cur, next), {});
  }

  private static filterOutNulls(val: any) {
    const filteredValue = {};
    Object.keys(val)
      .filter(key => typeof key === 'string')
      .filter(key => val[key] != null)
      .forEach(key => filteredValue[key] = val[key]);
    return filteredValue;
  }
}
