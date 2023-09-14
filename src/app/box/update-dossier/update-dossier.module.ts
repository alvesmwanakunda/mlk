import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BoxService } from '../../shared/services/box.service';
import { SharedModule } from '../../shared/shared.module';
import { UpdateDossierComponent } from './update-dossier.component';



@NgModule({
  declarations: [UpdateDossierComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[BoxService]
})
export class UpdateDossierModule { }
