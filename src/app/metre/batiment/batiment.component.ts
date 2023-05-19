import { Component,OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batiment',
  templateUrl: './batiment.component.html',
  styleUrls: ['./batiment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-batiment'}
})
export class BatimentComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(){
  }

  getBatiment(){
    this.router.navigate(['/batiment']);
  }

}
