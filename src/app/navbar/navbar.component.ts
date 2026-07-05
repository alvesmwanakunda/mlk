import { Component, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { ChatService } from '../shared/services/chat.service';
import { Router } from '@angular/router';
import { NotificationTask, NotificationTaskService } from '../shared/services/notification-task.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTachesComponent } from '../taches/update-taches/update-taches.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-navbar'}
})
export class NavbarComponent implements OnInit {


  toggleNavbar = true;
  user:any;
  company:any;
  number=0;
  isMobileMenuOpen = false;
  notifications$ = this.notificationService.notifications$;

  constructor(
    private authService:AuthService,
    private entrepriseService:EntreprisesService,
    private chatService: ChatService,
    private router: Router,
    private notificationService: NotificationTaskService,
    private dialog: MatDialog
    ){
    this.user = JSON.parse(localStorage.getItem('user'));
    /*this.chatService.countMClient.subscribe((res:any)=>{
      console.log("resultat",res);
      if(res){
        this.updateCountMessage();
      }
    })*/

    //this.chatService.getMessage();
  }

  ngOnInit(){
    if(this.user?.user.role=="admin"){
        this.getNumberAdmin();
    }else{
        this.getNumberClient();
    }
    this.getEntrepriseId();
    this.notificationService.loadNotifications();
    const currentUserId = this.user?.user?._id;
    if (currentUserId) {
      this.notificationService.connectSocket(currentUserId);
    }

  }

  markAsRead(notification: NotificationTask): void {
    this.notificationService.read(notification);
    this.openTaskDialog(notification);
  }

  openTaskDialog(notification: NotificationTask): void {
    const taskId = this.getNotificationTaskId(notification);

    if (!taskId) {
      return;
    }

    const dialogRef = this.dialog.open(UpdateTachesComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-dialog',
      data: {
        id: taskId,
        plan: notification?.tache?.plan || null
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.notificationService.loadNotifications();
      }
    });
  }

  trackByNotification(index: number, notification: NotificationTask): string {
    return notification?._id || String(index);
  }

  getTaskTitle(notification: NotificationTask): string {
    return notification?.tache?.titre || 'Nouvelle tâche';
  }

  private getNotificationTaskId(notification: NotificationTask): string | null {
    const task = notification?.tache;

    if (!task) {
      return null;
    }

    return typeof task === 'string' ? task : task?._id || null;
  }

  getOwnerInitials(notification: NotificationTask): string {
    const owner = notification?.proprieteTache;
    if (!owner || typeof owner === 'string') {
      return 'NT';
    }

    const prenom = owner.prenom ? owner.prenom.substring(0, 1) : '';
    const nom = owner.nom ? owner.nom.substring(0, 1) : '';

    return `${prenom}${nom}`.toUpperCase() || 'NT';
  }

  updateCountMessage(){
    this.chatService.updateCountClient().subscribe((res:any)=>{
      console.log("List message", res);
      this.number =0;
    },(error)=>{
      console.log("Erreur de connexion", error);
    })
  }

  getNumberAdmin(){
    this.chatService.countMessageAdmin().subscribe((res:any)=>{
      console.log("number admin", res);
      if(res?.createdAt){
        this.number = this.number+1;
      }else{
        this.number = res.message;
      }
    },(error)=>{
      console.log("Une erreur", error)
    })
  }

  getNumberClient(){
    this.chatService.countMessageClient().subscribe((res:any)=>{
      console.log("number client", res);
       this.number = res.message;
    },(error)=>{
      console.log("Une erreur", error)
    })
  }

  getEntrepriseId(){
    if(this.user?.user?.entreprise){
      this.entrepriseService.getEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
        this.company = res.message
     },(error)=>{
         console.log("Une erreur", error);
     })
    }
  }

  getChatClient(){
   //this.chatService.countMClient.next({numero:'1'});
   this.updateCountMessage();
   this.router.navigate(['discussions']);
  }

  logout(){
    this.authService.logout();
  }

  goToSettings(){

  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 992 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

}
