import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';

const routes: Routes = [{
  path:'',
  component:ChatComponent,
  canActivate:[AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
