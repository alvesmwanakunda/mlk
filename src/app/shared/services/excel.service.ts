import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs} from 'file-saver';
import * as ExcelJS from 'exceljs';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }


  


  generateExcelTimeSheet(data: any[], month: number, year: number): void {
    const workbook = new ExcelJS.Workbook();
  
    data.forEach((userGroup) => {
      // Remplacer "/" par un tiret "-" ou un espace
      const safeSheetTitle = `Time sheet ${month}-${year} - ${userGroup.user.nom} ${userGroup.user.prenom}`.replace(/[/\\?*:[\]]/g, '');
      const sheet = workbook.addWorksheet(safeSheetTitle);
  
      // Ajouter le titre
      sheet.addRow([`Time sheet ${month}/${year} pour ${userGroup.user.nom} ${userGroup.user.prenom}`]);
  
      // Appliquer le formatage au titre
      sheet.getCell('A1').font = { bold: true };
  
      // Ajouter les en-têtes de colonnes
      const header = ["Date", "Tâche", "Projet", "Déplacement", "Présence", "Motif", "Type déplacement", "Heures"];
      sheet.addRow(header).font = { bold: true };

      // initialiser les compteurs pour les totaux
      let totalWorkingDays=0;
      let totalSaturdays=0;
      let totalSundays=0;
      let totalTravelYes = 0;
      let totalTravelNo = 0;
      let nbrHeureDeplacement=0;
      let nbrHeureNonDeplacement=0;
  
      // Ajouter les données et appliquer les couleurs selon les motifs
      userGroup.timesheets.forEach((ts) => {
        const row = [
          ts?.dayOfWeek + " " + new Date(ts?.createdAt).toLocaleDateString(),
          ts?.tache,
          ts?.projet,
          ts?.deplacement,
          ts?.presence,
          ts?.motifs,
          ts?.types_deplacement,
          ts?.heure
        ];
        const newRow = sheet.addRow(row);
  
        // Appliquer la couleur en fonction du "Motif"
        if (ts?.motifs) {
          let fillColor = null;
          switch (ts.motifs.toLowerCase()) {
            case 'non justifié':
              fillColor = 'FFC0CB'; // rose clair
              break;
            case 'rcr':
              fillColor = 'FFFF00'; // jaune
              break;
            case 'cp':
              fillColor = 'ADD8E6'; // bleu clair
              break;
            case 'ecole':
              fillColor = '00FFFF'; // cyan
              break;
            case 'arret maladie':
              fillColor = 'FF69B4'; // rose plus foncé
              break;
            case 'enfant malade':
              fillColor = 'FFD700'; // doré
              break;
            case 'déplacement':
              fillColor = 'FF4500'; // rouge
              break;
            case 'congé de naissance':
              fillColor = '90EE90'; // vert clair
              break;
            case 'congé d\'accueil':
              fillColor = 'ac8def'; // violet moyen
              break;
            case 'congé paternité':
              fillColor = '6bb4ef'; // bleu acier 
              break;
            default:
              fillColor = null;
          }
          if (fillColor) {
            newRow.eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: fillColor }
              };
            });
          }
        }
        if(ts?.dayOfWeek){
          if(["Lundi","Mardi","Mercredi","Jeudi","Vendredi"].includes(ts.dayOfWeek)){
            totalWorkingDays++;
            console.log("Jour de travail", totalWorkingDays);
          }else if (ts.dayOfWeek === "Samedi" &&  ts?.presence!='Absent') {
            totalSaturdays++;
            console.log("Samedi", totalSaturdays);
          } else if (ts.dayOfWeek === "Dimanche" &&  ts?.presence!='Absent') {
              totalSundays++;
              console.log("Dimanche", totalSundays);
          }
        }
        if (ts?.deplacement === "Oui" &&  ts?.presence!='Absent') {
          totalTravelYes++;
          console.log("D", totalTravelYes);
        } else if (ts?.deplacement === "Non" &&  ts?.presence!='Absent') {
            totalTravelNo++;
            console.log("DN", totalTravelNo);
        }
        // Calculer la somme des heures en déplacement et sans déplacement
        if (ts?.deplacement === "Oui" &&  ts?.presence!='Absent') {
          nbrHeureDeplacement += ts?.heure || 0;
        } else if (ts?.deplacement === "Non" &&  ts?.presence!='Absent') {
          nbrHeureNonDeplacement += ts?.heure || 0;
        }
      });

      sheet.addRow([]); // Ligne vide avant les totaux
      sheet.addRow([
            'Total', 
            'Jour semaine',
            totalWorkingDays,
      ]);
      sheet.addRow([
        '', 
        'Samedi',
        totalSaturdays,
      ]);

      sheet.addRow([
        '', 
        'Dimanche',
        totalSundays,
      ]);
      //sheet.addRow([]); // Ligne vide avant les totaux
      sheet.addRow([
        '', 
        'En déplacement',
        totalTravelYes,
      ]);

      sheet.addRow([
        '', 
        'Pas en déplacement',
        totalTravelNo,
      ]);
      sheet.addRow([
        '', 
        'Nombre d\'heure en déplacement',
        nbrHeureDeplacement,
      ]);

      sheet.addRow([
        '', 
        'Nombre d\'heure pas en déplacement',
        nbrHeureNonDeplacement,
      ]);

  
      // Ajuster la largeur des colonnes pour améliorer la lisibilité
      sheet.columns.forEach((column) => {
        let maxColumnWidth = 10; // Largeur minimum par défaut
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxColumnWidth = Math.max(maxColumnWidth, cellValue.length);
        });
        column.width = maxColumnWidth + 2; // Ajouter une marge pour être plus lisible
      });
      //console.log(userGroup.timesheets);
    });
  
    // Générer le fichier Excel et l'enregistrer
   
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), `Timesheets_${month}_${year}.xlsx`);
    });
  }
  

  generateExcelTimeSheets(data: any[], month: number, year: number): void {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    data.forEach((userGroup) => {
      const sheetTitle = `Time sheet ${month}/${year} pour ${userGroup.user.nom} ${userGroup.user.prenom}`;
      const titleRow = [[sheetTitle]]; // Créer une ligne pour le titre

      const sheetData = userGroup.timesheets.map((ts) => ({
        "Date":ts?.dayOfWeek +" "+new Date(ts?.createdAt).toLocaleDateString(),
        "Tâche": ts?.tache,
        "Projet": ts?.projet,
        "Déplacement": ts?.deplacement,
        "Présence": ts?.presence,
        "Motif": ts?.motifs,
        "Type déplacement": ts?.types_deplacement,
        "Heures": ts?.heure,
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
