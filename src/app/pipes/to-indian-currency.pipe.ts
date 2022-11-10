import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toIndianCurrency'
})
export class ToIndianCurrencyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return '₹' + value.toLocaleString('en-IN');
  }

}
