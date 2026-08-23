import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CreateVendor,  UpdateVendor, Vendor } from '../models/model';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

 
   private readonly apiUrl = `${environment.apiUrl}/Vendor`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl);
  }

  getById(id: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateVendor): Observable<Vendor> {
    return this.http.post<Vendor>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateVendor): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string):   Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
