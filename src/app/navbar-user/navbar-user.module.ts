import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUserComponent } from './navbar-user.component';
import { RouterModule } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [NavbarUserComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbCollapse,
    SharedModule
  ],
  exports:[NavbarUserComponent]
})
export class NavbarUserModule { }
