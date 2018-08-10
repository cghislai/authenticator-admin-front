import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment-es6';

@Pipe({name: 'moment'})
export class MomentPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const momentValue = moment(value, [
      'YYYY-MM-DDTHH:mm:ss.SSSZZ'
    ]);
    if (momentValue.isValid()) {
      return this.formatMoment(momentValue, args);
    } else {
      return value;
    }
  }

  private formatMoment(momentValue: moment.Moment, args: any[]) {
    if (args.length === 0) {
      return momentValue.format('L LTS');
    } else {
      return momentValue.format(args[0]);
    }
  }

}
