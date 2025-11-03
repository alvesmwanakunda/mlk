import { AfterViewInit, Component,OnInit } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Projets } from '../shared/interfaces/projets.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjetComponent } from './delete-projet/delete-projet.component';
import { ChatProjetComponent } from '../chat-projet/chat-projet.component';
import { ChatService } from '../shared/services/chat.service';
import { ContactsService } from '../shared/services/contacts.service';
import { EntreprisesService } from '../shared/services/entreprises.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit, AfterViewInit {

  projet:Projets;
  idProjet:any;
  numberMessage:number=0;
  contact:any;
  entreprise:any;
  image:any;
  activeTab: string = 'nav-file'

  constructor(
    private projetService: ProjetsService,
    private router: Router,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    private chatService: ChatService,
    private contactService: ContactsService,
    private entrepriseService: EntreprisesService
  ) {
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     });
     const navigation = this.router.getCurrentNavigation();
     if(navigation?.extras.state?.['activeTab']){
      this.activeTab = navigation.extras.state['activeTab'];
     }
  }

  ngOnInit() {
    this.getProjet();
    this.getAllMessageNumber();
  }


  ngAfterViewInit() {
     if(this.activeTab !== 'nav-file'){
      this.activateTab(this.activeTab)
     }
  }

  activateTab(tabId:string){
    setTimeout(() => {
      const tabElement = document.querySelector(`#${tabId}-tab`) as HTMLElement;
      if (tabElement) {
        const tab = new bootstrap.Tab(tabElement);
        tab.show();
      }
    }, 100);
  }




  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{
        this.projet = res.message;

        if(res.message?.entreprise){
          this.getEntreprise(res.message?.entreprise);
        }

        if(this.projet?.contact){
          this.getResponsable(this.projet?.contact)
        }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getEntreprise(id){
    this.entrepriseService.getEntreprise(id).subscribe((res:any)=>{
        this.entreprise=res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getResponsable(id){
    this.contactService.getContact(id).subscribe((res:any)=>{
       this.contact = res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  /*getImageProjet(image){
    this.projetService.openFile(image).subscribe((res:any)=>{
      this.image = res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }*/

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
