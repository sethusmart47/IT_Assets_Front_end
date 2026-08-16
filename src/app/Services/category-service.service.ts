import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AssetCategory, CreateAssetCategory, UpdateAssetCategory } from '../model';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = `${environment.apiUrl}/Category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AssetCategory[]> {
    return this.http.get<AssetCategory[]>(this.apiUrl);
  }

  getById(id: string): Observable<AssetCategory> {
    return this.http.get<AssetCategory>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateAssetCategory): Observable<AssetCategory> {
    return this.http.post<AssetCategory>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateAssetCategory): Observable<AssetCategory> {
    return this.http.put<AssetCategory>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
