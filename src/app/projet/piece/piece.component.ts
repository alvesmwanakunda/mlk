import { Component,OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-piece'}
})
export class PieceComponent implements OnInit {

  constructor(){

  }
  ngOnInit(){
  }

}
