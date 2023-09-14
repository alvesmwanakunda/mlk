import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataAsAgo'
})
export class DataAsAgoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    console.log('Argu', args);
    if (!value) {
      return 'Il y a longtemps';
    }
    let time = (Date.now() - Date.parse(value)) / 1000;
    if (time < 10) {
      return 'Maintenant';
    } else if (time < 60) {
      return 'Il y a un moment';
    }
    const divider = [60, 60, 24, 30, 12];
    const string = [' second', ' minute', ' heure', ' jour', ' moi', ' an'];
    let i;
    for (i = 0; Math.floor(time / divider[i]) > 0; i++) {
      time /= divider[i];
    }
    const plural = Math.floor(time) > 1 ? 's' : '';
    return 'Il y a ' + Math.floor(time) + string[i] + plural;
  }

}
