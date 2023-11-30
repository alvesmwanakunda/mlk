import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllChatComponent } from './all-chat.component';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';

const routes: Routes = [{
  path:'',
  component:AllChatComponent,
  canActivate:[AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllChatRoutingModule { }
