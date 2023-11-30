import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { io } from 'socket.io-client';
import { Observable, tap, mergeMap, from, BehaviorSubject } from 'rxjs';
import { Chat } from '../interfaces/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  countMClient:BehaviorSubject<{}>=new BehaviorSubject('');


  //Devs
  //private socket = io(environment.BASE_API_URL);

  //Prod
  private socket = io(environment.BASE_URL,{
    path:'/api/socket.io'
  })

  constructor(private readonly httpClient: HttpClient) { }

  getMessage() {
    let observable = new Observable<Chat>(observer => {
      this.socket.on('new_message', data => {
        console.log("getMessage", data);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  countMessageAdmin():Observable<string>{
    return new Observable<string>((observer)=>{
      this.httpClient.get(`${environment.BASE_API_URL}/messages/pending/admin`).subscribe((data:any)=>{
        observer.next(data);
      });
      this.socket.on('new_message',(data)=>{
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      };
    })

  }

  countMessageClient():Observable<string>{
    return new Observable<string>((observer)=>{
      this.httpClient.get(`${environment.BASE_API_URL}/messages/pending/client`).subscribe((data:any)=>{
        observer.next(data);
      });
      this.socket.on('response_message',(data)=>{
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      };
    })
  }

  sendMessage(body: any): Observable<any>{
    return this.httpClient.post(`${environment.BASE_API_URL}/messages/send`, body).pipe(
      // Utilisez tap pour émettre un événement Socket.IO après le succès de la requête
      mergeMap((data) => {
        this.socket.emit('new_message', body.message);
        return from([data]);
      })
    );
    ;
  }

  responseMessage(body: any,idClient): Observable<any>{
    return this.httpClient.post(`${environment.BASE_API_URL}/messages/received/${idClient}`, body).pipe(
      // Utilisez tap pour émettre un événement Socket.IO après le succès de la requête
      mergeMap((data) => {
        this.socket.emit('response_message', body.message);
        return from([data]);
      })
    );
    ;
  }

  listMessageClient(){
    return this.httpClient.get(`${environment.BASE_API_URL}/messages/client`)
  }

  listMessageAdminByClient(idClient){
    return this.httpClient.get(`${environment.BASE_API_URL}/messages/client/${idClient}`)
  }

  listMessageClientAdmin(){
    return this.httpClient.get(`${environment.BASE_API_URL}/messages/client/admin`)
  }

  updateCountClient(){
    return this.httpClient.get(`${environment.BASE_API_URL}/messages/update`)
  }

  updateCountAdmin(idSender){
    return this.httpClient.get(`${environment.BASE_API_URL}/messages/update/admin/${idSender}`);
  }
}
