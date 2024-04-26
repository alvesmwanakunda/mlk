import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProduitsService } from '../shared/services/produits.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent implements OnInit {

  firstFormGroup:FormGroup;
  twoFormGroup:FormGroup;
  form1:any;
  form2:any;
  categories:any=[];
  suppliers:any=[];
  manufacturers:any=[];
  seperatorKeysCodes:number[]=[ENTER, COMMA];
  filteredCategories: Observable<any[]>;
  cats:any[]=[];
  exportCategories: number[]=[];
  @ViewChild('categorieInput') categorieInput: ElementRef<HTMLInputElement>;


  champ_validation={
    champ:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
  }

  constructor(
    private _formBuilder: FormBuilder,
    private produitService: ProduitsService,
  ){
    
  }

  ngOnInit() {
    this.getAllCategories();
    this.getAllManufactures();
    this.getAllSuppliers();

    this.firstFormGroup=this._formBuilder.group({
      resume:['',Validators.required],
      description:['',Validators.required],
    });

    this.twoFormGroup=this._formBuilder.group({
      category_default:['',Validators.required],
      categories:['',Validators.required],
      produit:['',Validators.required],
      reference:['',null],
      supplier:['',null],
    });

  

    this.filteredCategories = this.twoFormGroup.get('categories').valueChanges.pipe(
      startWith(''),
      map((val)=> this._filter(val))
    )
    
  }

  getAllCategories(){
    this.produitService.getCategories().subscribe((res:any)=>{
      //console.log("Categories", res.message);
      this.categories = res.message;
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getAllManufactures(){
    this.produitService.getManufactures().subscribe((res:any)=>{
      this.manufacturers = res.message;
      //console.log("Manufactures", res.message);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getAllSuppliers(){
    this.produitService.getSuppliers().subscribe((res:any)=>{
      this.suppliers = res.message;
      //console.log("Suppliers", res.message);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }
    
  // Select categorie

  add(event: any): void {
    let selectedCategorie = this.categories.find(cat=> cat.name===event.option.value);
    if(selectedCategorie){
      this.cats.push(selectedCategorie);
      console.log("CAT",this.cats)
      this.exportCategories.push(selectedCategorie.id);
      this.categorieInput.nativeElement.value="";
      this.twoFormGroup.get('categories').setValue(null);
    }
  }
  
  remove(category: any): void {
    const index = this.cats.indexOf(category);
  
    if (index !== -1) {
      this.cats.splice(index, 1);
      const idIndex = this.exportCategories.indexOf(category.id);
      if(idIndex != -1){
        this.exportCategories.splice(idIndex, 1);
      }
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.cats.push(event.option.viewValue);
    //this.fruitInput.nativeElement.value = '';
    this.twoFormGroup.get('categories').setValue(null);
  }
  
  private _filter(value: string) {
    if(value){
      const filterValue = value.toString().toLowerCase();
      console.log("Value", filterValue);
      //console.log("Categories II", this.categories);
      return this.categories.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    return [];
    
  }

  

}
