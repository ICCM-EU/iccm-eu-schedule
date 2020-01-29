import { Pipe, PipeTransform } from '@angular/core';
import { TextManager } from './textManager';

@Pipe({name: 'cropText'})
export class CropTextPipe implements PipeTransform {
  transform(what: string, where: number): string {
    return TextManager.cropDescriptionAfter(what, where);
  }
}
