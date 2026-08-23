import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePurchaseDto, NextPurchaseNumberDto, PurchaseDetailDto, PurchaseListDto, UpdatePurchaseDto } from '../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private readonly baseUrl = `${environment.apiUrl}/Purchase`;

  constructor(private http: HttpClient) {}

  getAll(status?: number): Observable<PurchaseListDto[]> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }
    return this.http.get<PurchaseListDto[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<PurchaseDetailDto> {
    return this.http.get<PurchaseDetailDto>(`${this.baseUrl}/${id}`);
  }

  getNextNumber(): Observable<NextPurchaseNumberDto> {
    return this.http.get<NextPurchaseNumberDto>(`${this.baseUrl}/next-number`);
  }

  create(dto: CreatePurchaseDto): Observable<PurchaseDetailDto> {
    debugger
    return this.http.post<PurchaseDetailDto>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdatePurchaseDto): Observable<PurchaseDetailDto> {
    return this.http.put<PurchaseDetailDto>(`${this.baseUrl}/${id}`, dto);
  }

  complete(id: string): Observable<string> {
    return this.http.put(`${this.baseUrl}/${id}/complete`, null, { responseType: 'text' });
  }

  delete(id: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
