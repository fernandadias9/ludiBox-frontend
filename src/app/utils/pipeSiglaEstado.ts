import { Pipe, PipeTransform } from '@angular/core';
import { BRAZILIAN_STATES } from './getSiglaEstado';

@Pipe({
  name: 'stateAbbr',
  pure: true
})
export class StateAbbrPipe implements PipeTransform {
  transform(fullStateName: string | undefined | null): string {
    if (!fullStateName) return '';
    return BRAZILIAN_STATES[fullStateName] || fullStateName;
  }
}