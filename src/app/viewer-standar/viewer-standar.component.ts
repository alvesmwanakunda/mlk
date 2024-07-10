import { Component, OnInit, Inject } from '@angular/core';
import { BoxService } from 'src/app/shared/services/box.service';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { BoxComponent } from '../box/box.component';

@Component({
  selector: 'app-viewer-standar',
  templateUrl: './viewer-standar.component.html',
  styleUrls: ['./viewer-standar.component.scss']
})
export class ViewerStandarComponent implements OnInit {

  file:any;
  src:any;
  isPdf=false;
  isImage=false;
  isOffice=false;
  url:any;
  //pdf
  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;
  zoom_to:number=0.8;
  //page-width:any;
  width = 475;
  height = 673;
  percent=60;
  fit:boolean=false;

  constructor(
    private boxService:BoxService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<BoxComponent>,

  ){
    const navbarMenus = document.querySelectorAll('.navbar');
    navbarMenus.forEach(element => element.classList.add('hide-navbar'));
  }

  ngOnInit(){
    this.openFile(this.data.chemin,this.data.extension)
  }

  openFile(chemin, extension){
    if ( extension == "pdf" ){
       this.isPdf=true;
        this.src=chemin;
       //this.src="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"
    }else if(extension === "xlsx" || extension === "docx" || extension === "pptx"){
       this.isOffice=true;
       this.src=this.getSafeUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(chemin)}`);
    }else{
      this.isImage=true;
      this.src=this.getSafeUrl(chemin);
    }
  }

  getSafeUrl(url){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeDialog(){
    const navbarMenus = document.querySelectorAll('.navbar');
    navbarMenus.forEach(element => element.classList.remove('hide-navbar'));
    this.dialogRef.close();
  }

  download(): void {
    this.boxService.downloadFile(this.data.chemin);
  }

  print(){

    this.boxService.downloadPDF(this.data.chemin).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
    /*let w = window.open(this.file.chemin);
    console.log("window", w);
    w.print();
    w.close();*/
  }

  // pdf
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  zoom_in() {

    if (this.zoom_to < 1){
      this.zoom_to = this.zoom_to + 0.1;
      this.width= +this.width +  226;
      this.height= +this.height +  154;
      this.percent=+this.percent + 20;
    }
  }

  zoom_out() {

    if (this.zoom_to > 0,8){
        this.zoom_to = this.zoom_to - 0.1;
        this.width= +this.width -  226;
        this.height= +this.height -  154;
        this.percent=+this.percent - 20;
    }
  }

  get_fit() {
     this.fit=true;
  }


}
