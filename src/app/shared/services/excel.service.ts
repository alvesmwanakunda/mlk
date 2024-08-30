import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }



  generateExcelTimeSheet(data: any[], month: number, year: number): void {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    data.forEach((userGroup) => {
      const sheetTitle = `Time sheet ${month}/${year} pour ${userGroup.user.nom} ${userGroup.user.prenom}`;
      const titleRow = [[sheetTitle]]; // Créer une ligne pour le titre

      const sheetData = userGroup.timesheets.map((ts) => ({
        "Date": new Date(ts.createdAt).toLocaleDateString(),
        "Tâche": ts.tache,
        "Heures": ts.heure,
        "Déplacement": ts.deplacement,
        "Projet": ts.projet,
      }));

      // Créer une feuille temporaire pour insérer le titre
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(titleRow);

      // Appliquer le formatage en gras au titre
      worksheet['A1'].s = {
        font: { bold: true },
      };

      // Ajouter une ligne vide après le titre pour ne pas écraser les données
      XLSX.utils.sheet_add_json(worksheet, sheetData, { origin: 'A3', skipHeader: false });

      // Appliquer le formatage en gras aux en-têtes de colonnes
      const headers = Object.keys(sheetData[0]);
      headers.forEach((header, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c: index }); // Ligne 3 pour les en-têtes (r=2, car index 0)
        worksheet[cellAddress].s = {
          font: { bold: true },
        };
      });

      // Ajuster la taille des colonnes pour que le titre soit bien visible
      const max_width = sheetTitle.length + 5; // Ajuster selon les besoins
      worksheet['!cols'] = [{ wch: max_width }];

      // Ajouter la feuille de calcul au workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, `${userGroup.user.prenom} ${userGroup.user.nom}`);
    });

    // Générer le fichier Excel et le télécharger
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true, // Important pour activer les styles
    });

    this.saveAsExcelFileTimeSheet(excelBuffer, 'Timesheets');
  }

  private saveAsExcelFileTimeSheet(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }


  /*generateExcelTimeSheet(data: any[], month, year): void {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    data.forEach((userGroup) => {
      const sheetTitle = `Time sheet ${month}/${year} pour ${userGroup.user.nom} ${userGroup.user.prenom}`;
      const titleRow = [[sheetTitle]]; // Créer une ligne pour le titre

      const sheetData = userGroup.timesheets.map((ts) => ({
        "Date": new Date(ts.createdAt).toLocaleDateString(),
        "Tâche": ts.tache,
        "Heures": ts.heure,
        "Déplacement": ts.deplacement,
        "Projet": ts.projet,
      }));

      // Créer une feuille temporaire pour insérer le titre
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(titleRow);

      // Ajouter une ligne vide après le titre pour ne pas écraser les données
      XLSX.utils.sheet_add_json(worksheet, sheetData, { origin: 'A3', skipHeader: false });

      // Ajuster la taille des colonnes pour que le titre soit bien visible
      const max_width = sheetTitle.length + 5; // Ajuster selon les besoins
      worksheet['!cols'] = [{ wch: max_width }];

      // Ajouter la feuille de calcul au workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, `${userGroup.user.prenom} ${userGroup.user.nom}`);
    });

    // Générer le fichier Excel et le télécharger
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFileTimeSheet(excelBuffer, 'Timesheets');
  }

  private saveAsExcelFileTimeSheet(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }*/
}
