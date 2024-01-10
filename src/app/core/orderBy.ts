import { Pipe, PipeTransform } from '@angular/core';
import { orderBy as _orderBy } from 'lodash-es';

@Pipe({
   name: 'orderBy',
   standalone: true,
})
export class NgxOrderPipe<T> implements PipeTransform {
   transform(data: T[], orderBy: string, direction: 'asc' | 'desc' = 'asc'): T[] {
      return _orderBy(data, orderBy, direction);
   }
}