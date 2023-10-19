import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, PreloadAllModules } from '@angular/router';

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
    loadChildren:()=>import('./profil/profil.module').then(m=>m.ProfilModule)
  },
  {
    path:"dashboard",
    loadChildren:()=>import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
  },
  {
    path:"entreprise/dashboard",
    loadChildren:()=>import('./dashboard-user/dashboard-user.module').then(m=>m.DashboardUserModule)
  },
  {
    path:"add/entreprise/projet",
    loadChildren:()=>import('./projet-user/projet-user.module').then(m=>m.ProjetUserModule)
  },
  {
    path:'update/entreprise/projet/:id',
    loadChildren:()=>import('./projet-user/update-user-projet/update-user-projet.module').then(m=>m.UpdateUserProjetModule)
  },
  {
    path:'entreprise/projet/:id',
    loadChildren:()=>import('./projet-user/detail-user-projet/detail-user-projet.module').then(m=>m.DetailUserProjetModule)
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
    loadChildren:()=>import('./projet/projet.module').then(m=>m.ProjetModule)
  },
  {
    path:"update/projet/:id",
    loadChildren:()=>import('./projet/update-projet/update-projet.module').then(m=>m.UpdateProjetModule)

  },
  {
    path:"metre",
    loadChildren:()=>import('./metre/metre.module').then(m=>m.MetreModule)
  },
  {
    path:"lot/:id",
    loadChildren:()=>import('./metre/lots/detail-lot/detail-lot.module').then(m=>m.DetailLotModule)
  },
  {
    path:"batiment",
    loadChildren:()=>import('./metre/batiment/rdc/rdc.module').then(m=>m.RdcModule)
  },
  {
    path:"contact",
    loadChildren:()=>import('./contact/contact.module').then(m=>m.ContactModule)
  },
  {
    path:"add/contact",
    loadChildren:()=>import('./contact/add-contact/add-contact.module').then(m=>m.AddContactModule)
  },
  {
    path:"update/contact/:id",
    loadChildren:()=>import('./contact/update-contact/update-contact.module').then(m=>m.UpdateContactModule)
  },
  {
    path:"box",
    loadChildren:()=>import('./box/box.module').then(m=>m.BoxModule)
  },
  {
     path:"box/:id",
     loadChildren: () => import("./box/detailbox/detailbox.module").then((m)=> m.DetailboxModule)
  },
  {
    path:"agenda",
    loadChildren:()=>import('./agenda/agenda.module').then(m=>m.AgendaModule)
  },
  {
    path:'entreprises',
    loadChildren:()=>import('./entreprise/entreprise.module').then(m=>m.EntrepriseModule)
  },
  {
    path:'detail/entreprise/:id',
    loadChildren:()=>import('./entreprise/detail-entreprise/detail-entreprise.module').then(m=>m.DetailEntrepriseModule)
  },
  {
    path:'add/entreprise',
    loadChildren:()=>import('./entreprise/add-entreprise/add-entreprise.module').then(m=>m.AddEntrepriseModule)
  },
  {
    path:'entreprise/:id',
    loadChildren:()=>import('./entreprise/update-entreprise/update-entreprise.module').then(m=>m.UpdateEntrepriseModule)
  },
  {
    path:'add/projet',
    loadChildren:()=>import('./projet/add-projet/add-projet.module').then(m=>m.AddProjetModule)
  },
  {
    path:'appartement',
    loadChildren:()=>import('./metre/batiment/appartement/appartement.module').then(m=>m.AppartementModule)
  },
  {
    path:'devis',
    loadChildren:()=>import('./projet/devis/devis.module').then(m=>m.DevisModule)
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
