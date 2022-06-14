import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, Login,  } from '../models/access';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  postLogin(usuario: Login): Observable<IResponse>{
    return this.http.post<IResponse>(`${this.apiURL}/Access`, usuario, {
      headers: new HttpHeaders({"Content-Type": "application/json"})
    });
  }
}
