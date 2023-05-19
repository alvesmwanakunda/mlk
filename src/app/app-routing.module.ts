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
    path:"dashboard",
    loadChildren:()=>import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
  },
  {
    path:"projet",
    loadChildren:()=>import('./projet/projet.module').then(m=>m.ProjetModule)
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
    path:"box",
    loadChildren:()=>import('./box/box.module').then(m=>m.BoxModule)
  },
  {
    path:'entreprises',
    loadChildren:()=>import('./entreprise/entreprise.module').then(m=>m.EntrepriseModule)
  },
  {
    path:'detail/entreprise',
    loadChildren:()=>import('./entreprise/detail-entreprise/detail-entreprise.module').then(m=>m.DetailEntrepriseModule)
  },
  {
    path:'add/entreprise',
    loadChildren:()=>import('./entreprise/add-entreprise/add-entreprise.module').then(m=>m.AddEntrepriseModule)
  },
  {
    path:'add/projet',
    loadChildren:()=>import('./projet/add-projet/add-projet.module').then(m=>m.AddProjetModule)
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
