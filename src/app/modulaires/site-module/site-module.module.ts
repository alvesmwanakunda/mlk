import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModuleComponent } from './site-module.component';
import { SharedModule } from '../../shared/shared.module';
import { DeleteModuleModule } from '../delete-module/delete-module.module';



@NgModule({
  declarations: [SiteModuleComponent],
  imports: [
    CommonModule,
    SharedModule,
    DeleteModuleModule

  ],
  exports:[SiteModuleComponent]
})
export class SiteModuleModule { }
