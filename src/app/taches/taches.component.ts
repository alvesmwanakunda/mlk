import { Component, Input, OnInit } from '@angular/core';
import { TachesService } from '../shared/services/taches.service';
import { AddTachesComponent } from './add-taches/add-taches.component';
import { UpdateTachesComponent } from './update-taches/update-taches.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.scss']
})
export class TachesComponent implements OnInit {

  task = [];
  idProjet:any;

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
        console.log("Taches", data);
     },
     (error) => {
       console.log("Erreur lors de la récupération des données", error);
     }
     );
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
        const dialogRef = this.dialog.open(AddTachesComponent,{width:'60%', data:{id:this.idProjet}});
        dialogRef.afterClosed().subscribe((result:any)=>{
           if(result){
            this.getAllTaches();
           }
        })
    }

    openDialogUpdate(idTache){
        const dialogRef = this.dialog.open(UpdateTachesComponent,{
          width: '95vw',
          height: '95vh',
          maxWidth: '95vw',
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
        return '#E8E9ED';
      case 'En Cours':
        return '#E99D00';
      case 'Terminer':
        return '#27A844';
      default:
        return 'transparent';
    }
}


}
