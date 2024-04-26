import { Component, OnInit, ViewChild } from '@angular/core';
import { ProduitsService } from 'src/app/shared/services/produits.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';


@Component({
  selector: 'app-list-produits',
  templateUrl: './list-produits.component.html',
  styleUrls: ['./list-produits.component.scss']
})
export class ListProduitsComponent implements OnInit {

  displayedColumns:string[]=['name','price','action'];
  dataSource =new MatTableDataSource<Produits>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  produits:any=[];

  constructor(
    private produitService: ProduitsService,
    private matPaginatorIntl:MatPaginatorIntl,
    private route: Router
  ){}

  

  ngOnInit() {
    this.getAllProduits();
    this.matPaginatorIntl.itemsPerPageLabel="Produits par page";
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator;
  }

  getAllProduits(){
    this.produitService.getProduits().subscribe((res:any)=>{
       //console.log("Produits", res.message);
       this.produits = res.message.products;
       this.dataSource.data = this.produits.map((data)=>({
        id:data.id,
        name:data.name,
        price:data.price,
       })) as Produits[]
      //console.log("Produits", this.dataSource.data);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getProduit(id){
    this.route.navigate(['produit',id])
  }
}

export interface Produits{
  id:string,
  namae:string,
  price:string
}
