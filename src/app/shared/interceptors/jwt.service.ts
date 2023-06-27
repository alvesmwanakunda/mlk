import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtService implements HttpInterceptor {

  constructor(private router:Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler):
    Observable<HttpEvent<any>> {
      let headers = {
        setHeaders:{}
      };

      let user = JSON.parse(localStorage.getItem("user"));
      if(user && user.token){
        headers.setHeaders={
          token:user.token
        };
      }
      return next.handle(req.clone(headers)).pipe(

        tap(

            event => this.handleResponse(req,event),
            error => this.handleError(req, error)
        )
      );
  }

  handleResponse(req: HttpRequest<any>, event){
    console.log('Handling response for ', req.url, event);
    if(event instanceof HttpResponse){
       console.log('Request for ', req.url, ' Response Status ', event.status,' With body ', event.body);
    }
  }

  handleError(req: HttpRequest<any>, event){
    if(event instanceof HttpErrorResponse){

      if (event.status===404 || event.status===500){
          this.router.navigate(["/error"],{queryParams:{erro:event.message}});
          return false;
      }
      else if(event.status===401){
          this.router.navigate(["/login"]);
          return false;
      }
      else{
        return null;
      }
    }
  }
}
