import { Component,OnInit } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Projets } from '../shared/interfaces/projets.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjetComponent } from './delete-projet/delete-projet.component';
import { ChatProjetComponent } from '../chat-projet/chat-projet.component';
import { ChatService } from '../shared/services/chat.service';


@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit {

  projet:Projets;
  idProjet:any;
  numberMessage:number=0;

  constructor(
    private projetService: ProjetsService,
    private router: Router,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    private chatService: ChatService,
  ) {
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
  }

  ngOnInit() {
    this.getProjet();
    this.getAllMessageNumber();
  }

  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{
        this.projet = res.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  updateProjet(idProjet){
    this.router.navigate(['update/projet',idProjet]);
  }

  openDialogDelete(idProjet){
    const dialogRef = this.dialog.open(DeleteProjetComponent,{width:'30%',data:{id:idProjet}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.router.navigate(['dashboard']);
       }
    })
  }

  getAllMessageNumber(){
    this.chatService.getReadMessageAdmin(this.idProjet).subscribe((res:any)=>{
      console.log("Number Message", res);
      this.numberMessage=res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  updateMessage(){
    this.chatService.updateReadMessageAdmin(this.idProjet).subscribe((res:any)=>{
      this.getAllMessageNumber();
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  openDialogChat(){
    if(this.numberMessage>=1){
      this.updateMessage();
    }
    const dialogRef = this.dialog.open(ChatProjetComponent,{
      data:{id:this.idProjet},
      width:'25%',
      height:'60%',
      position:{right:'5px', bottom:'0px'},
      //panelClass:"chat-popup"
      backdropClass:'chat-popup'
     }
    );
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
       }
    })
  }

}
