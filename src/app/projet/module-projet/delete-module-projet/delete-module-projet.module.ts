import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteModuleProjetComponent } from './delete-module-projet.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DeleteModuleProjetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[DeleteModuleProjetComponent]
})
export class DeleteModuleProjetModule { }
