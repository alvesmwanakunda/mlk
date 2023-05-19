import { Component,OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-etude',
  templateUrl: './etude.component.html',
  styleUrls: ['./etude.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-etude'}
})
export class EtudeComponent implements OnInit {

  constructor(){

  }

  ngOnInit() {
  }

}
