import { Component, Input, OnInit } from '@angular/core';
import { TachesService } from '../shared/services/taches.service';
import { AddTachesComponent } from './add-taches/add-taches.component';
import { UpdateTachesComponent } from './update-taches/update-taches.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.scss']
})
export class TachesComponent implements OnInit {

  task = [];
  idProjet:any;
  StatutTache: 'ALL' | 'A Faire' | 'En Cours' | 'Terminer' | 'Clôturer';
  selectedStatut = 'ALL';
  filteredTasks: any[] = [];




  constructor(
      private tacheService: TachesService,
      public dialog: MatDialog,
      public route:ActivatedRoute,

    ){
      this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
    }

    ngOnInit(){

      this.getAllTaches();
    }

    getAllTaches(){
      this.tacheService.getAllTache(this.idProjet).subscribe((data:any)=>{
        this.task = data.message;
        this.applyFilterStatus();
        console.log("Taches", data);
     },
     (error) => {
       console.log("Erreur lors de la récupération des données", error);
     }
     );
    }

    onStatutChange(statut:any) {
      this.selectedStatut = statut;
      this.applyFilterStatus();
    }

    applyFilterStatus() {
      if (this.selectedStatut === 'ALL') {
        this.filteredTasks = [...this.task]; // tout afficher
      } else {
        this.filteredTasks = this.task.filter(
          t => t?.statut === this.selectedStatut
        );
      }
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
        if (filterValue === '') {
          this.getAllTaches();
        }else{
          this.task = this.task.filter(task => {
            return (
                task.titre.toLowerCase().includes(filterValue)
            );
          });
        }
    }

    openDialog(){
        const dialogRef = this.dialog.open(AddTachesComponent,{width:'70%', data:{id:this.idProjet}});
        dialogRef.afterClosed().subscribe((result:any)=>{
           if(result){
            this.getAllTaches();
           }
        })
    }

    openDialogUpdate(idTache){
        const dialogRef = this.dialog.open(UpdateTachesComponent,{
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          panelClass: 'full-screen-dialog',
          data:{id:idTache}});
        dialogRef.afterClosed().subscribe((result:any)=>{
           if(result){
            this.getAllTaches();
           }
        })
    }

  getColor(statut: string): string {
    switch (statut) {
      case 'A Faire':
        return '#1d4ed8';
      case 'En Cours':
        return '#1d4ed8';
      case 'Terminer':
        return '#1d4ed8';
      default:
        return 'transparent';
    }
 }

 getStatusLabel(statut?: string): string {
  switch (statut) {
    case 'A Faire':
      return 'À faire';
    case 'En Cours':
      return 'En cours';
    case 'Terminer':
      return 'Terminé';
    case 'Clôturer':
      return 'Clôturé'
    default:
      return statut ?? '';
  }
}

getStatusBadgeClass(statut?: string): string {
  switch (statut) {
    case 'A Faire':
      return 'badge--pending';
    case 'En Cours':
      return 'badge--in-progress';
    case 'Terminer':
      return 'badge--completed';
    case 'Clôturer':
      return 'badge--overdue';
    default:
      return 'badge--default';
  }
}


}
