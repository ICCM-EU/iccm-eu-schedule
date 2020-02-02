import { Pipe, PipeTransform } from '@angular/core';
import { TextManager } from './textManager';

@Pipe({name: 'cropText'})
export class CropTextPipe implements PipeTransform {
  transform(what: string, where: number, when?: ' '): string {
    return TextManager.cropTextAfter(what, where, when);
  }
}
