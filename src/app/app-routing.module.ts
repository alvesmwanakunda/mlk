import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, PreloadAllModules, CanActivate } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    redirectTo:"/login",
    pathMatch:"full"
  },
  {
    path:"login",
    loadChildren:()=>import('./login/login.module').then(m=>m.LoginModule),
    data:{preload:true}
  },
  {
    path:"reset",
    loadChildren:()=>import('./login/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
  },
  {
    path:"reset-password",
    loadChildren:()=>import('./login/password/password.module').then(m=>m.PasswordModule),
  },
  {
   path:"signup",
   loadChildren:()=>import('./signup/signup.module').then(m=>m.SignupModule),
  },
  {
    path:"mlka",
    loadChildren:()=>import('./home/home.module').then(m=>m.HomeModule)
  },
  {
    path:"profil",
    loadChildren:()=>import('./profil/profil.module').then(m=>m.ProfilModule),
  },
  {
    path:"profil/password",
    loadChildren:()=>import('./profil/update-password/update-password.module').then(m=>m.UpdatePasswordModule)
  },
  {
    path:"dashboard",
    loadChildren:()=>import('./dashboard/dashboard.module').then(m=>m.DashboardModule),
  },
  {
    path:"entreprise/dashboard",
    loadChildren:()=>import('./dashboard-user/dashboard-user.module').then(m=>m.DashboardUserModule),
  },
  {
    path:"add/entreprise/projet/:id",
    loadChildren:()=>import('./projet-user/projet-user.module').then(m=>m.ProjetUserModule),
  },
  {
    path:'update/entreprise/projet/:id',
    loadChildren:()=>import('./projet-user/update-user-projet/update-user-projet.module').then(m=>m.UpdateUserProjetModule),
  },
  {
    path:'entreprise/projet/:id',
    loadChildren:()=>import('./projet-user/detail-user-projet/detail-user-projet.module').then(m=>m.DetailUserProjetModule),
  },
  /*{
     path:"box/projet/:id",
     loadChildren:()=>import('./projet/box-projet/box-projet.module').then(m=>m.BoxProjetModule)
  },*/
  /*{
    path:"box/projet/detail/:id/:idProjet",
    loadChildren: () => import("./projet/box-projet/detail-folder/detail-folder.module").then((m)=> m.DetailFolderModule)
  },*/
  {
    path:"projet/:id",
    loadChildren:()=>import('./projet/projet.module').then(m=>m.ProjetModule),
  },
  {
    path:"update/projet/:id",
    loadChildren:()=>import('./projet/update-projet/update-projet.module').then(m=>m.UpdateProjetModule),

  },
  {
    path:"metre",
    loadChildren:()=>import('./metre/metre.module').then(m=>m.MetreModule),
  },
  {
    path:"lot/:id",
    loadChildren:()=>import('./metre/lots/detail-lot/detail-lot.module').then(m=>m.DetailLotModule),
  },
  {
    path:"batiment",
    loadChildren:()=>import('./metre/batiment/rdc/rdc.module').then(m=>m.RdcModule),
  },
  {
    path:"contact",
    loadChildren:()=>import('./contact/contact.module').then(m=>m.ContactModule),
  },
  {
    path:"add/contact",
    loadChildren:()=>import('./contact/add-contact/add-contact.module').then(m=>m.AddContactModule),
  },
  {
    path:"update/contact/:id",
    loadChildren:()=>import('./contact/update-contact/update-contact.module').then(m=>m.UpdateContactModule),
  },
  {
    path:"box",
    loadChildren:()=>import('./box/box.module').then(m=>m.BoxModule),
  },
  {
     path:"box/:id",
     loadChildren: () => import("./box/detailbox/detailbox.module").then((m)=> m.DetailboxModule),
  },
  {
    path:"agenda",
    loadChildren:()=>import('./agenda/agenda.module').then(m=>m.AgendaModule),
  },
  {
    path:'entreprises',
    loadChildren:()=>import('./entreprise/entreprise.module').then(m=>m.EntrepriseModule),
  },
  {
    path:'detail/entreprise/:id',
    loadChildren:()=>import('./entreprise/detail-entreprise/detail-entreprise.module').then(m=>m.DetailEntrepriseModule),
  },
  {
    path:'add/entreprise',
    loadChildren:()=>import('./entreprise/add-entreprise/add-entreprise.module').then(m=>m.AddEntrepriseModule),
  },
  {
    path:'entreprise/:id',
    loadChildren:()=>import('./entreprise/update-entreprise/update-entreprise.module').then(m=>m.UpdateEntrepriseModule),
  },
  {
    path:'add/projet',
    loadChildren:()=>import('./projet/add-projet/add-projet.module').then(m=>m.AddProjetModule),
  },
  {
    path:'appartement',
    loadChildren:()=>import('./metre/batiment/appartement/appartement.module').then(m=>m.AppartementModule),
  },

  {
    path:'modulaires',
    loadChildren:()=>import('./modulaires/modulaires.module').then(m=>m.ModulairesModule),
  },
  {
    path:'modulaire',
    loadChildren:()=>import('./modulaires/add-module/add-module.module').then(m=>m.AddModuleModule),
  },
  {
    path:'modulaires/:id',
    loadChildren:()=>import('./modulaires/update-module/update-module.module').then(m=>m.UpdateModuleModule),
  },
  {
    path:'plan3d',
    loadChildren:()=>import('./plan3d/plan3d.module').then(m=>m.Plan3dModule)
  },
  {
    path:'devis',
    loadChildren:()=>import('./devis/devis.module').then(m=>m.DevisModule),
  },
  {
    path:'new/devis',
    loadChildren:()=>import('./devis/add-devis/add-devis.module').then(m=>m.AddDevisModule)
  },
  {
    path:'devis/:id',
    loadChildren:()=>import('./devis/update-devis/update-devis.module').then(m=>m.UpdateDevisModule)
  },
  {
    path:'devis/:id/:type',
    loadChildren:()=>import('./devis/devis-pdf/devis-pdf.module').then(m=>m.DevisPdfModule)
  },
  {
    path:'facture',
    loadChildren:()=>import('./factures/factures.module').then(m=>m.FacturesModule),
  },
  {
    path:'facture/:id',
    loadChildren:()=>import('./factures/detail-facture/detail-facture.module').then(m=>m.DetailFactureModule),
  },
  {
    path:'discussions',
    loadChildren:()=>import('./chat/chat.module').then(m=>m.ChatModule),
  },
  {
    path:'all/discussions',
    loadChildren:()=>import('./chat/all-chat/all-chat.module').then(m=>m.AllChatModule)
  },
  {
    path:'read/discussion/:id/:numero',
    loadChildren:()=>import('./chat/read-chat/read-chat.module').then(m=>m.ReadChatModule)
  },
  {
    path:'conditions',
    loadChildren:()=>import('./conditions/conditions.module').then(m=>m.ConditionsModule)
  },
  {
    path:'modules/:id',
    loadChildren:()=>import('./qrcode-module/qrcode-module.module').then(m=>m.QrcodeModuleModule)
  },
  {
    path:'produit',
    loadChildren:()=>import('./produits/produits.module').then(m=>m.ProduitsModule)
  },
  {
    path:'produits',
    loadChildren:()=>import('./produits/list-produits/list-produits.module').then(m=>m.ListProduitsModule)
  },
  {
    path:'produit/:id',
    loadChildren:()=>import('./produits/detail-produit/detail-produit.module').then(m=>m.DetailProduitModule)
  },
  {
    path:'conges',
    loadChildren:()=>import('./conges/conges.module').then(m=>m.CongesModule)
  },
  {
    path:'conge',
    loadChildren:()=>import('./conges/add-conges/add-conges.module').then(m=>m.AddCongesModule)
  },
  {
    path:'conge/:id',
    loadChildren:()=>import('./conges/update-conges/update-conges.module').then(m=>m.UpdateCongesModule)
  },
  {
    path:'users',
    loadChildren:()=>import('./users/users.module').then(m=>m.UsersModule)
  },
  {
    path:'users/nouveau',
    loadChildren:()=>import('./users/add-users/add-users.module').then(m=>m.AddUsersModule)
  },
  {
    path:'users/detail/:id',
    loadChildren:()=>import('./users/update-users/update-users.module').then(m=>m.UpdateUsersModule)
  },
  {
    path:'transporteurs',
    loadChildren:()=>import('./transporteurs/transporteurs.module').then(m=>m.TransporteursModule)
  },
  {
     path:'transporteurs/nouveau',
     loadChildren:()=>import('./transporteurs/add-transporteur/add-transporteur.module').then(m=>m.AddTransporteurModule)
  },
  {
    path:'timesheet',
    loadChildren:()=>import('./time-sheet/time-sheet.module').then(m=>m.TimeSheetModule)
  },
  {
    path:'timesheet/:id',
    loadChildren:()=>import('./time-sheet/detail-timesheet/detail-timesheet.module').then(m=>m.DetailTimesheetModule)
  },
  {
    path:'timesheet/:id/apercu/:month/:year',
    loadChildren:()=>import('./time-sheet/apercu-timesheet/apercu-timesheet.module').then(m=>m.ApercuTimesheetModule)
  },
  {
    path:'timesheet/:id/:month/:year',
    loadChildren:()=>import('./time-sheet/update-timesheet/update-timesheet.module').then(m=>m.UpdateTimesheetModule)
  },
  {
    path:'agent/timesheet',
    loadChildren:()=>import('./time-sheet/agent-timesheet/agent-timesheet.module').then(m=>m.AgentTimesheetModule)
  },
  {
    path:'agent/timesheet/:month/:year',
    loadChildren:()=>import('./time-sheet/agent-detail-timesheet/agent-detail-timesheet.module').then(m=>m.AgentDetailTimesheetModule)
  },
  {
    path:'prestations',
    loadChildren:()=>import('./prestation/prestation.module').then(m=>m.PrestationModule)
  },
  {
    path:'prestations/produit/:id',
    loadChildren:()=>import('./prestation/produit-prestation/produit-prestation.module').then(m=>m.ProduitPrestationModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private routee:Router){
    this.routee.errorHandler =(error:any)=>{
      console.log("Erreurs avec la route.", error);
    }
  }
 }
