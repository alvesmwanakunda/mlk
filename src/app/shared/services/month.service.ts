import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonthService {

  private monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  constructor() { }

  getMonthName(monthNumber: number): string {
    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error('Le nombre doit être entre 1 et 12');
    }
    return this.monthNames[monthNumber - 1];
  }
}
