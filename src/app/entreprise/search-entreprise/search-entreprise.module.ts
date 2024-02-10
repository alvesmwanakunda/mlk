import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchEntrepriseComponent } from './search-entreprise.component';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';



@NgModule({
  declarations: [SearchEntrepriseComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[EntreprisesService]
})
export class SearchEntrepriseModule { }
