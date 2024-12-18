import { Component, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-fiche-technique',
  templateUrl: './fiche-technique.component.html',
  styleUrls: ['./fiche-technique.component.scss']
})
export class FicheTechniqueComponent implements OnInit {

  ficheFormIsolation : FormGroup;
  ficheFormMenuiserieExterieur : FormGroup;
  ficheFormMenuiserieInterieur : FormGroup;
  ficheFormElectricite : FormGroup;
  ficheFormPlomberie : FormGroup;


  isFiche:boolean=false;
  fiche:any;
  description:any;
  idModule:any;
  message:any;
  isLinear = false;
  isVitree:boolean=false;
  isEquipement:boolean=false
 


  constructor(
    private projetsService: ProjetsService,
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private route: ActivatedRoute
  ){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
  }


  ngOnInit(){
    this.getFicheTechnique();
     this.ficheFormIsolation=this._formBuilder.group({
      isolation_toiture_type:['',],
      isolation_toiture_epaisseur:['',],
      isolation_toiture_isolation:['',],
      isolation_sol_plancher:['',],
      isolation_sol_type:['',],
      isolation_sol_epaisseur:['',],
      isolation_sol_isolation:['',],
      isolation_sol_surface:['',],
      isolation_panneaux_epaisseur:['',],
      isolation_panneaux_type:['',],
      isolation_panneaux_couleur_faceInterieure:['',],
      isolation_panneaux_couleur_faceExterieure:['',],
      isolation_panneaux_revetement_interieur:['',],
      isolation_panneaux_revetement_exterieur:['',],
      isolation_panneaux_revetement_dimension_longueur:['',],
      isolation_panneaux_revetement_dimension_largeur:['',],
      isolation_panneaux_revetement_dimension_quantite:['',],
    });
    this.ficheFormMenuiserieExterieur=this._formBuilder.group({
      menuiserie_fenetre_longueur:['',],
      menuiserie_fenetre_largeur:['',],
      menuiserie_fenetre_epaisseur:['',],
      menuiserie_fenetre_type:['',],
      menuiserie_fenetre_matiere:['',],
      menuiserie_fenetre_couleur:['',],
      menuiserie_fenetre_typeVitrage:['',],
      menuiserie_fenetre_quantite:['',],
      menuiserie_porte_largeur:['',],
      menuiserie_porte_hauteur:['',],
      menuiserie_porte_epaisseur:['',],
      menuiserie_porte_ouvrant:['',],
      menuiserie_porte_matiere:['',],
      menuiserie_porte_couleur:['',],
      menuiserie_porte_isVitree:['',],
      menuiserie_porte_quantite:['',],
      menuiserie_porte_vitree_couleur:['',],
      menuiserie_porte_vitree_touteVitrage:['',],
      menuiserie_porte_vitree_semi_typeVitrage:['',],
      menuiserie_porte_vitree_semi_longueur:['',],
      menuiserie_porte_vitree_semi_largeur:['',],
      menuiserie_porte_vitree_semi_epaisseur:['',],
      menuiserie_porte_vitree_ocutus_typeVitrage:['',],
      menuiserie_porte_vitree_ocutus_longueur:['',],
      menuiserie_porte_vitree_ocutus_largeur:['',],
      menuiserie_porte_vitree_ocutus_epaisseur:['',],
    });
    this.ficheFormMenuiserieInterieur=this._formBuilder.group({
      menuiserieI_revetement_type:['',],
      menuiserieI_plafond_type:['',],
      menuiserieI_couleur:['',],
      menuiserieI_surface:['',],
    });
    this.ficheFormElectricite=this._formBuilder.group({
      electricite_quantitePC:['',],
      electricite_quantiteSortieCable:['',],
      electricite_quantitePriseRJ45:['',],
      electricite_quantiteInterrupteur:['',],
      electricite_quantiteDetecteurMouvement:['',],
      electricite_typeEclairage:['',],
      electricite_quantiteEclairage:['',],
      electricite_quantiteBAES:['',],
      electricite_convecteur_typeMarque:['',],
      electricite_convecteur_puissance:['',],
      electricite_convecteur_quantite:['',],
      electricite_climatissation_referenceType:['',],
      electricite_climatissation_quantite:['',],
    });
    this.ficheFormPlomberie=this._formBuilder.group({
      plomberie_toilette:['',],
      plomberie_toilettePMR:['',],
      plomberie_wcTurc:['',],
      plomberie_lavabo:['',],
      plomberie_lavaboPMR:['',],
      plomberie_laveMain:['',],
      plomberie_auge:['',],
      plomberie_urinoir:['',],
      plomberie_douche:['',],
      plomberie_ballonEauChaude_referenceType:['',],
      plomberie_ballonEauChaude_quantite:['',],
      plomberie_extracteur_referenceType:['',],
      plomberie_extracteur_quantite:['',],
    })

  }

  
  addFiche(){
      let payload={
        isolation: {
          toiture: {
              typeToiture: this.ficheFormIsolation.get('isolation_toiture_type').value,
              epaisseurIsolation:this.ficheFormIsolation.get('isolation_toiture_epaisseur').value ,
              typeIsolation:this.ficheFormIsolation.get('isolation_toiture_isolation').value
          },
          sol: {
              epaisseurPlancher:this.ficheFormIsolation.get('isolation_sol_plancher').value ,
              typePlancher:this.ficheFormIsolation.get('isolation_sol_type').value ,
              epaisseurIsolation:this.ficheFormIsolation.get('isolation_sol_epaisseur').value,
              typeIsolation:this.ficheFormIsolation.get('isolation_sol_isolation').value,
              surface:this.ficheFormIsolation.get('isolation_sol_surface').value
          },
          panneaux: {
              epaisseurIsolation:this.ficheFormIsolation.get('isolation_panneaux_epaisseur').value,
              typeIsolation:this.ficheFormIsolation.get('isolation_panneaux_type').value,
              couleur:{
                  faceInterieure:this.ficheFormIsolation.get('isolation_panneaux_couleur_faceInterieure').value ,
                  faceExterieure:this.ficheFormIsolation.get('isolation_panneaux_couleur_faceExterieure').value ,
              },
              revetementPanneau: {
                  interieur:this.ficheFormIsolation.get('isolation_panneaux_revetement_interieur').value ,
                  exterieur:this.ficheFormIsolation.get('isolation_panneaux_revetement_exterieur').value ,
                  dimension:{
                      longueur:this.ficheFormIsolation.get('isolation_panneaux_revetement_dimension_longueur').value ,
                      largeur:this.ficheFormIsolation.get('isolation_panneaux_revetement_dimension_largeur').value ,
                  },
                  quantite:this.ficheFormIsolation.get('isolation_panneaux_revetement_dimension_quantite').value
              },
          }
        },
        menuiserieExterieur: {
            fenetre: {
                longueur: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_longueur').value,
                largeur: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_largeur').value,
                epaisseur: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_epaisseur').value,
                type: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_type').value,
                matiere: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_matiere').value,
                couleur: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_couleur').value,
                typeVitrage: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_typeVitrage').value,
                quantite: this.ficheFormMenuiserieExterieur.get('menuiserie_fenetre_quantite').value
            },
            porte: {
                largeur: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_largeur').value,
                hauteur: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_hauteur').value,
                epaisseur: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_epaisseur').value,
                ouvrant: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_ouvrant').value,
                matiere: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_matiere').value,
                couleur: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_couleur').value,
                isVitree: this.isVitree,
                vitree:{
                    couleur: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_couleur').value,
                    touteVitree: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_touteVitrage').value,
                    semiVitree:{
                        typeVitrage:this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_semi_typeVitrage').value,
                        longueur:this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_semi_longueur').value,
                        largeur:this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_semi_largeur').value,
                        epaisseur: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_semi_epaisseur').value,
                    },
                    ocutus:{
                        typeVitrage:this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_ocutus_typeVitrage').value,
                        longueur:this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_ocutus_longueur').value,
                        largeur:this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_ocutus_largeur').value,
                        epaisseur: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_vitree_ocutus_epaisseur').value,
                    }  
                },
                quantite: this.ficheFormMenuiserieExterieur.get('menuiserie_porte_quantite').value
            }
        },
        menuiserieInterieur:{
            revetementSol: {
                typeSol: this.ficheFormMenuiserieInterieur.get('menuiserieI_revetement_type').value,
            },
            plafond: {
                typePlafond: this.ficheFormMenuiserieInterieur.get('menuiserieI_plafond_type').value,
            },
            couleur: this.ficheFormMenuiserieInterieur.get('menuiserieI_couleur').value,
            surface: this.ficheFormMenuiserieInterieur.get('menuiserieI_surface').value
        },
        electricite: {
            quantitePC:this.ficheFormElectricite.get('electricite_quantitePC').value,
            quantiteSortieCable: this.ficheFormElectricite.get('electricite_quantiteSortieCable').value,
            quantitePriseRJ45: this.ficheFormElectricite.get('electricite_quantitePriseRJ45').value,
            quantiteInterrupteur: this.ficheFormElectricite.get('electricite_quantiteInterrupteur').value,
            quantiteDetecteurMouvement: this.ficheFormElectricite.get('electricite_quantiteDetecteurMouvement').value,
            typeEclairage: this.ficheFormElectricite.get('electricite_typeEclairage').value,
            quantiteEclairage: this.ficheFormElectricite.get('electricite_quantiteEclairage').value,
            quantiteBAES: this.ficheFormElectricite.get('electricite_quantiteBAES').value,
            convecteur: {
                typeMarque: this.ficheFormElectricite.get('electricite_convecteur_typeMarque').value,
                puissance: this.ficheFormElectricite.get('electricite_convecteur_puissance').value,
                quantite: this.ficheFormElectricite.get('electricite_convecteur_quantite').value
            },
            climatisation: {
                referenceType: this.ficheFormElectricite.get('electricite_climatissation_referenceType').value,
                quantite: this.ficheFormElectricite.get('electricite_climatissation_quantite').value
            }
        },
        plomberie: {
            toilette: this.ficheFormPlomberie.get('plomberie_toilette').value,
            toilettePMR: this.ficheFormPlomberie.get('plomberie_toilettePMR').value,
            wcTurc: this.ficheFormPlomberie.get('plomberie_wcTurc').value,
            lavabo: this.ficheFormPlomberie.get('plomberie_lavabo').value,
            lavaboPMR: this.ficheFormPlomberie.get('plomberie_lavaboPMR').value,
            laveMain: this.ficheFormPlomberie.get('plomberie_laveMain').value,
            auge: this.ficheFormPlomberie.get('plomberie_auge').value,
            urinoir: this.ficheFormPlomberie.get('plomberie_urinoir').value,
            douche: this.ficheFormPlomberie.get('plomberie_douche').value,
            ballonEauChaude:{
                referenceType: this.ficheFormPlomberie.get('plomberie_ballonEauChaude_referenceType').value,
                quantite: this.ficheFormPlomberie.get('plomberie_ballonEauChaude_quantite').value
            },
            extracteur:{
                referenceType: this.ficheFormPlomberie.get('plomberie_extracteur_referenceType').value,
                quantite: this.ficheFormPlomberie.get('plomberie_extracteur_quantite').value
            }
        }
      };
      console.log("payload", payload);
       this.projetsService.createFicheTechnique(payload,this.idModule).subscribe((res:any)=>{
           this.fiche = res?.message;
           this.message='La fiche a été ajoutée avec succès';
           this.isEquipement=true;
            this.openSnackBar(this.message);
       },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    
  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  isCheckVitree(event){
    console.log("Event", event?.checked);
    if(event?.checked){
      this.isVitree = true
      console.log("ici")
    }else{
      this.isVitree = false
    }
  }

  getFicheTechnique(){
    this.projetsService.getFicheTechnique(this.idModule).subscribe((res:any)=>{
      if(res?.message){
        this.isEquipement=true
      }else{
        this.isEquipement=false
      }
       
    },(error)=>{
        console.log(error);
    })
  }

}
