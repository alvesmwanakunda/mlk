import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private breadcrumbs: { id: string; name: string; current: boolean }[] = [];
  private breadcrumbss=[]



  constructor() {
    // Restaure les données du fil d'Ariane depuis le localStorage lors de l'initialisation
    const storedBreadcrumbs = localStorage.getItem('breadcrumbs');
    if (storedBreadcrumbs) {
      this.breadcrumbss = JSON.parse(storedBreadcrumbs);
      this.breadcrumbs = [...this.breadcrumbss];
      console.log("session", this.breadcrumbss);
      console.log("sessions", this.breadcrumbs);
    }
  }

  getBreadcrumbs(): { id: string; name: string; current: boolean }[] {
    return this.breadcrumbs;
  }

  setBreadcrumbs(breadcrumbs: { id: string; name: string; current: boolean }[]): void {
    this.breadcrumbs = breadcrumbs;
  }


  addBreadcrumb(folder: { id: string; name: string; current: boolean }): void {
    // Réinitialisez le "current" de tous les autres éléments à false

        this.breadcrumbs.forEach(item => (item.current = false));

        // Vérifiez si l'élément existe déjà dans la liste
        const existingFolderIndex = this.breadcrumbs.findIndex(item => item.id === folder.id);

        if (existingFolderIndex === -1) {
          // L'élément n'existe pas encore dans la liste, ajoutez-le
          this.breadcrumbs.push(folder);
        } else {
          // L'élément existe déjà, mettez à jour les autres propriétés si nécessaire
          this.breadcrumbs[existingFolderIndex].name = folder.name;
          this.breadcrumbs[existingFolderIndex].current = folder.current;
        }
        // Sauvegardez les données du fil d'Ariane dans le localStorage
        localStorage.setItem('breadcrumbs', JSON.stringify(this.breadcrumbs));
        console.log("Dossier current", this.breadcrumbs);

  }


  removeFoldersAfterCurrent(): string | null {
    const currentIndex = this.breadcrumbs.findIndex(folder => folder.current);

    if (currentIndex !== -1) {
      // Mettez à jour le statut current du dossier courant à true
      this.breadcrumbs[currentIndex].current = true;
      // Retirez les dossiers après le dossier courant
      this.breadcrumbs.splice(currentIndex + 1);
      console.log("Folder", this.breadcrumbs);
      // Sauvegardez les données du fil d'Ariane dans le localStorage après la mise à jour
      localStorage.setItem('breadcrumbs', JSON.stringify(this.breadcrumbs));
      // Renvoyez l'ID du dossier courant
      return this.breadcrumbs[currentIndex].id;
    }
    return null; // Retournez null si aucun dossier courant n'est trouvé
  }

  removeItemsAfterIndex(index:number){
    this.breadcrumbs = this.breadcrumbs.splice(0, index +1);
    localStorage.setItem('breadcrumbs', JSON.stringify(this.breadcrumbs));
    console.log("list after", this.breadcrumbs);
    return this.breadcrumbs;
  }

  removeAll():void{
    this.breadcrumbs=[];
    this.breadcrumbss=[];
    localStorage.removeItem('breadcrumbs');
    console.log("Dossier current", this.breadcrumbs);
  }
}
