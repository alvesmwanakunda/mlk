import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulairesComponent } from './modulaires.component';
import { ModulairesRoutingModule } from './modulaires-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { DeleteModuleModule } from './delete-module/delete-module.module';


@NgModule({
  declarations: [ModulairesComponent],
  imports: [
    CommonModule,
    ModulairesRoutingModule,
    SharedModule,
    NavbarModule,
    DeleteModuleModule
  ]
})
export class ModulairesModule { }
