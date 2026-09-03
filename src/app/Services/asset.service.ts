import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  AssetDetail, AssetDto, AssetListDto, AvailablePurchaseDto, AvailablePurchaseItemDto, BulkCreateAssetDto, CreateAssetDto, RegistrationSummaryDto, UpdateAssetDto, ValidateSerialNumbersDto, ValidationResultDto } from '../models/Asset';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

 private readonly apiUrl = `${environment.apiUrl}/asset`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { status?: string; category?: string; brand?: string; search?: string }): Observable<AssetListDto[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.brand) params = params.set('brand', filters.brand);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<AssetListDto[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<AssetDetail> {
    
    return this.http.get<AssetDetail>(`${this.apiUrl}/${id}`);
  }

  register(dto: CreateAssetDto): Observable<AssetDto> {
    return this.http.post<AssetDto>(`${this.apiUrl}/register`, dto);
  }

  bulkRegister(dto: BulkCreateAssetDto): Observable<AssetDto[]> {
    return this.http.post<AssetDto[]>(`${this.apiUrl}/bulk-register`, dto);
  }

  update(id: string, dto: UpdateAssetDto): Observable<AssetDto> {
    return this.http.put<AssetDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  validateSerials(dto: ValidateSerialNumbersDto): Observable<ValidationResultDto> {
    return this.http.post<ValidationResultDto>(`${this.apiUrl}/validate-serials`, dto);
  }

  getAvailablePurchases(): Observable<AvailablePurchaseDto[]> {
    return this.http.get<AvailablePurchaseDto[]>(`${this.apiUrl}/available-purchases`);
  }

  getAvailableItems(purchaseId: string): Observable<AvailablePurchaseItemDto[]> {
    return this.http.get<AvailablePurchaseItemDto[]>(`${this.apiUrl}/available-items/${purchaseId}`);
  }

  getRegistrationSummary(purchaseId: string): Observable<RegistrationSummaryDto> {
    return this.http.get<RegistrationSummaryDto>(`${this.apiUrl}/registration-summary/${purchaseId}`);
  }
}
