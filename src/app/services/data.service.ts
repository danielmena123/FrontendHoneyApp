import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  get<T>(url: string, httpParams?: any): Observable<HttpResponse<T>>{
    const httpHeaders: HttpHeaders = this.getHeaders();

    return this.http.get<T>(url, {
      headers: httpHeaders,
      params: httpParams,
      observe: 'response'
    });
  }

  Post<T>(url: string, data: any): Observable<HttpResponse<T>>{
    const httpHeaders: HttpHeaders = this.getHeaders();

    return this.http.post<T>(url, data, {
      headers: httpHeaders,
      observe: 'response'
    })
  }

  Put<T>(url: string, data: any): Observable<HttpResponse<T>>{
    const httpHeaders: HttpHeaders = this.getHeaders();

    return this.http.put<T>(url, data, {
      headers: httpHeaders,
      observe: 'response'
    })
  }

  delete<T>(url: string, params?: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();

    return this.http.delete<T>(url, {
      headers: httpHeaders,      
      observe: 'response'
    })
  }

  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = this.securityService.GetToken();
    
    if (token) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
      httpHeaders = httpHeaders.append('Content-Type', 'application/json');
      httpHeaders = httpHeaders.append('Access-Control-Allow-Origin', '*');
      httpHeaders = httpHeaders.append('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    }

    return httpHeaders;
  }

}
