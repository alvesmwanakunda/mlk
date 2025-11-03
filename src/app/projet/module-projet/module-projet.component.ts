import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { Modules } from 'src/app/shared/interfaces/modules.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSort } from '@angular/material/sort';
import { StockProjetComponent } from 'src/app/stock-projet/stock-projet.component';
import { MatDialog } from '@angular/material/dialog';
import { AddStockProjetComponent } from 'src/app/stock-projet/add-stock-projet/add-stock-projet.component';
import { DeleteModuleProjetComponent } from './delete-module-projet/delete-module-projet.component';
import * as html2pdf from 'html2pdf.js';
import { forkJoin } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';





@Component({
  selector: 'app-module-projet',
  templateUrl: './module-projet.component.html',
  styleUrls: ['./module-projet.component.scss']
})
export class ModuleProjetComponent implements OnInit, AfterViewInit {

  idProjet:any
  displayedColumns:string[]=['numero','nom','type','hauteur','largeur','longueur','action'];
  dataSource =new MatTableDataSource<Modules>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  input:any;
  modules:any[]=[];
  modulesWithQrcode: any[] = [];
  loading: boolean = false;
  email = "contact@mlka.fr";



  constructor(
     private projetService: ProjetsService,
     private matPaginatorIntl:MatPaginatorIntl,
     private router: Router,
     public route:ActivatedRoute,
     private sanitizer: DomSanitizer,
     public dialog: MatDialog
  ){
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
  }

  ngOnInit(): void {
    this.getAllModules();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort;
    this.matPaginatorIntl.itemsPerPageLabel="Modules par page";
  }

  getAllModules(){
    this.projetService.getAllModuleByProjet(this.idProjet).subscribe((data:any)=>{
       this.modules = data?.message;
       const moduleIds = this.modules.map(m => m._id || m.module?._id);
       this.getAllQrcode(moduleIds);
       this.dataSource.data = data.message.map((data)=>({
        idP:data?._id,
        id:data?.module?._id,
        nom:data?.module?.nom,
        position:data?.module?.position,
        hauteur:data?.module?.hauteur,
        largeur:data?.module?.largeur,
        longueur:data?.module?.longueur,
        numero:data?.module?.numero_serie,
        type:data?.module?.module_type,
        categorie:data?.module?.categorie,
        photo:this.getSafeUrl(data?.module?.photo) || null,
       })).reverse() as Modules[];
       console.log("sort",this.sort);
       console.log("pagination",this.paginator);
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );

  }

  getModule(id){
    this.router.navigate(['modulaires', id],{
      state:{
        fromProject: this.idProjet,
        returnToTab: 'nav-stock'
      }
    });
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.input = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
}

getSafeUrl(url){
  return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

openDialog(){
  const dialogRef = this.dialog.open(StockProjetComponent,{width:'70%',data:{id:this.idProjet}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllModules();
     }
  })
}

openDialogProjet(){
  const dialogRef = this.dialog.open(AddStockProjetComponent,{width:'70%',data:{id:this.idProjet}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      this.getAllModules();
     }
  })
}

openDialogDelete(idP){
  const dialogRef = this.dialog.open(DeleteModuleProjetComponent,{width:'40%',data:{id:idP}});
  const instance = dialogRef.componentInstance;
  instance.close.subscribe(()=> dialogRef.close());
  instance.confirm.subscribe(()=>{
      dialogRef.close();
      this.getAllModules();
  })
}

getAllQrcode(modules){
  // Appeler la route batch avec le tableau d'IDs
    this.projetService.getModulesWithQrcode(modules).subscribe(
      (res: any) => {
        if (res.success) {
          // Créer un map des QR codes pour un accès rapide
          const qrcodeMap: any = {};
          res.message.forEach((item: any) => {
            qrcodeMap[item.moduleId] = item.qrcode;
          });

          // Combiner les modules avec leurs QR codes
          this.modulesWithQrcode = this.modules.map(module => {
            const moduleId = module._id || module.module?._id;
            return {
              ...module,
              qrcode: qrcodeMap[moduleId]
            };
          });
          console.log("modules", this.modulesWithQrcode);

          // Générer le PDF après un court délai
        } else {
          console.error("Erreur dans la réponse:", res.message);
          this.loading = false;
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des QR codes", error);
        alert("Erreur lors de la génération des QR codes");
        this.loading = false;
      }
    );
}

// Télécharger toutes les plaques
  // module-projet.component.ts
/*async downloadAllPlaques() {
  if (this.modules.length === 0) {
    alert("Aucun module à télécharger");
    return;
  }

  this.loading = true;

  try {
    // Extraire les IDs des modules
    setTimeout(() => {
            this.generatePDF();
          }, 500);
  } catch (error) {
    console.error("Erreur", error);
    this.loading = false;
  }
}

generatePDF() {
  const element = document.getElementById("pdf-plaques-container");

  if (!element) {
    console.error("Élément PDF non trouvé");
    this.loading = false;
    return;
  }

  // Utiliser les paramètres optimisés pour une qualité identique à votre plaque unique
  html2pdf().set({
    margin: [0, 0, 0, 0],
    filename: `plaques_projet_${this.idProjet}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // Scale optimal pour la qualité
      useCORS: true,
      logging: false,
      width: 16 * 37.8, // 16cm en pixels
      height: 8 * 37.8, // 8cm en pixels
      windowWidth: 16 * 37.8
    },
    jsPDF: {
      unit: 'cm',
      format: [16, 8],
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['css'],
      after: '.plaque-item'
    }
  })
  .from(element)
  .save()
  .then(() => {
    this.loading = false;
  })
  .catch((error: any) => {
    console.error("Erreur lors de la génération du PDF", error);
    this.loading = false;
  });
}*/

async printAll() {
    const pdf = new jsPDF({ unit: 'cm', format: [16, 8], orientation: 'landscape' });
    this.loading = true;

    for (let i = 0; i < this.modulesWithQrcode.length; i++) {
      const module = this.modulesWithQrcode[i];

      // Attendre que le DOM se mette à jour (si nécessaire)
      await new Promise((resolve) => setTimeout(resolve, 200));

      const element = document.getElementById(`pdf-card-${i}`);
      if (!element) continue;

      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        logging: false,
        width: 604.8,
        height: 302.4
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, 16, 8);
    }

    pdf.save('plaquettes_mlka.pdf');
    this.loading = false;
  }
}
