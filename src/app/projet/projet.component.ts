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
import { DomSanitizer } from '@angular/platform-browser';
import { BoxService } from '../shared/services/box.service';

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

  //pdf
  // zoom_to: number = 1.2;
  // percent = 120;
  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;
  zoom_to:number=1;
  percent=100;
  fit:boolean=true;
  chemin:any;

  constructor(
    private projetService: ProjetsService,
    private router: Router,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    private chatService: ChatService,
    private contactService: ContactsService,
    private entrepriseService: EntreprisesService,
    private sanitizer: DomSanitizer,
    private boxService:BoxService,

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
    this.getPlan(this.idProjet);
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
          this.getEntreprise(res.message?.entreprise?._id);
        }

        if(this.projet?.contact){
          this.getResponsable(this.projet?.contact)
        }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getPlan(idProjet){
     this.projetService.getPlanProjet(idProjet).subscribe((res:any)=>{
        console.log("Plan=================>", res);
        this.chemin=res?.message?.chemin;
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

  getSafeUrl(url){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

  // pdf
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  zoom_in() {
    if (this.zoom_to < 2){
      this.zoom_to = +(this.zoom_to + 0.1).toFixed(1);
      this.percent = Math.round(this.zoom_to * 100);
    }
  }

  zoom_out() {
    if (this.zoom_to > 0.5){
      this.zoom_to = +(this.zoom_to - 0.1).toFixed(1);
      this.percent = Math.round(this.zoom_to * 100);
    }
  }

  get_fit() {
     this.fit=true;
     this.zoom_to=1;
     this.percent=100;
  }

    download(): void {
    this.boxService.downloadFile(this.chemin);
  }

  print(){

    this.boxService.downloadPDF(this.chemin).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
    /*let w = window.open(this.file.chemin);
    console.log("window", w);
    w.print();
    w.close();*/
  }

}
