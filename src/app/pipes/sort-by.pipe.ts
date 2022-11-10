import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: any, sortBy: string, ...args: string[]): any {
    return value?.sort((a, b) => {
      let x =  a[`${sortBy}`].toLowerCase()
      let y = b[`${sortBy}`].toLowerCase()

      return x<y ? -1 : 1
    })
  }

}
