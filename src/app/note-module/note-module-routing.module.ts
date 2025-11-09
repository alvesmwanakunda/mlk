import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteModuleComponent } from './note-module.component';

const routes: Routes = [{
  path:'',
  component:NoteModuleComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteModuleRoutingModule { }
