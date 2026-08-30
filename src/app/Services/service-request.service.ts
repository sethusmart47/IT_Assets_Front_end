import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VendorDto } from '../models/purchase';
import {  CreateServiceRequestDto, ResolveServiceRequestDto, ServiceRequestDto, ServiceRequestListDto } from '../models/AssetService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  private readonly baseUrl = `${environment.apiUrl}/ServiceRequest`;


  constructor(private http: HttpClient) {}

  // ─── Service Requests ──────────────────────────────────────────────────────────

  getAll(): Observable<ServiceRequestListDto[]> {
    return this.http.get<ServiceRequestListDto[]>(this.baseUrl);
  }

  getById(id: string): Observable<ServiceRequestDto> {
    return this.http.get<ServiceRequestDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateServiceRequestDto): Observable<ServiceRequestDto> {
    return this.http.post<ServiceRequestDto>(this.baseUrl, dto);
  }

  resolve(id: string, dto: ResolveServiceRequestDto): Observable<ServiceRequestDto> {
    return this.http.put<ServiceRequestDto>(`${this.baseUrl}/${id}/resolve`, dto);
  }


}
