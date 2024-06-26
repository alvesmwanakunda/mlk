import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeSheetComponent } from './time-sheet.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: TimeSheetComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetRoutingModule { }
