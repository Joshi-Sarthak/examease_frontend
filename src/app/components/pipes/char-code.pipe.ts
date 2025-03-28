import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'charCode' })
export class CharCodePipe implements PipeTransform {
  transform(value: number): string {
    return String.fromCharCode(65 + value); // Convert 0 -> A, 1 -> B, etc.
  }
}
