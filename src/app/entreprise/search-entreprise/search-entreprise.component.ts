import { Component, OnInit} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { AddEntrepriseComponent } from '../add-entreprise/add-entreprise.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-entreprise',
  templateUrl: './search-entreprise.component.html',
  styleUrls: ['./search-entreprise.component.scss']
})
export class SearchEntrepriseComponent implements OnInit {


  entreprise:any;
  listEntreprise:any[]=[];
  onLoadForm:boolean=false;
  searchForm: FormGroup;
  submitted = false;


  constructor(
    public dialogRef:MatDialogRef<AddEntrepriseComponent>,
    private entrepriseService : EntreprisesService,
    private _formBuilder:FormBuilder,
  ){}

  validation={
    input:[
      {
        type:"required",
        message:"Veuillez indiquer ce champ"
      }
    ],
  };

  ngOnInit() {
    this.searchForm = new FormGroup({
      valeur:new FormControl("",[Validators.required]),
    });
  }

  searchEntreprise(){
    this.onLoadForm = true;
    this.submitted = true;
    if(!this.searchForm.invalid){
      this.entrepriseService.searchApiFrance(this.searchForm.get('valeur').value).subscribe((res:any)=>{
        //this.dialogRef.close(res)
        //console.log("Ent", res);
        this.listEntreprise = res?.results;
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })

    }else{
      this.onLoadForm=false;
    }
  }

  selectEntreprise(index){
    this.entreprise = this.listEntreprise[index];
    if(this.entreprise){
       let playload={
        societe:this.entreprise?.nom_complet,
        siret:this.entreprise?.siege?.siret,
        siren:this.entreprise?.siege?.siren,
        rue:this.entreprise?.siege?.numero_voie+" "+this.entreprise?.siege?.type_voie+" "+this.entreprise?.siege?.libelle_voie,
        postal:this.entreprise?.siege?.code_postal,
        numero:this.entreprise?.siege?.libelle_commune
       };
       //console.log(playload);
       this.dialogRef.close(playload);
    }
  }



}
