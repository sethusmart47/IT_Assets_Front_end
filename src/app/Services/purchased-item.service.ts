import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePurchasedItemDto, PurchasedItemDto, UpdatePurchasedItemDto } from '../models/purchase';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class PurchasedItemService {

 private readonly baseUrl = `${environment.apiUrl}/PurchasedItem`;

  constructor(private http: HttpClient) {}

  getAll(purchaseId: string): Observable<PurchasedItemDto[]> {
    return this.http.get<PurchasedItemDto[]>(`${this.baseUrl}/${purchaseId}/items`);
  }

  getById(purchaseId: string, itemId: string): Observable<PurchasedItemDto> {
    return this.http.get<PurchasedItemDto>(`${this.baseUrl}/${purchaseId}/items/${itemId}`);
  }

  create(purchaseId: string, dto: CreatePurchasedItemDto): Observable<PurchasedItemDto> {
   debugger
    return this.http.post<PurchasedItemDto>(`${this.baseUrl}/${purchaseId}`, dto);
  }

  update(purchaseId: string, itemId: string, dto: UpdatePurchasedItemDto): Observable<PurchasedItemDto> {
    return this.http.put<PurchasedItemDto>(`${this.baseUrl}/${purchaseId}/items/${itemId}`, dto);
  }

  delete(purchaseId: string, itemId: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${purchaseId}/items/${itemId}`, { responseType: 'text' });
  }
}
