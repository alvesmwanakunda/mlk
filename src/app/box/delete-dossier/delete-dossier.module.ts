import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BoxService } from '../../shared/services/box.service';
import { SharedModule } from '../../shared/shared.module';
import { DeleteDossierComponent } from './delete-dossier.component';



@NgModule({
  declarations: [DeleteDossierComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[BoxService]
})
export class DeleteDossierModule { }
