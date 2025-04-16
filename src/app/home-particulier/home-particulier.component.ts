import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-particulier',
  templateUrl: './home-particulier.component.html',
  styleUrls: ['./home-particulier.component.scss']
})
export class HomeParticulierComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    localStorage.removeItem("newParticulier")
  }

}
