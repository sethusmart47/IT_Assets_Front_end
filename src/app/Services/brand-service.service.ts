import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AssetBrand, CreateAssetBrand, UpdateAssetBrand } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
 constructor(private http: HttpClient) {}
 private readonly apiUrl = `${environment.apiUrl}/Brand`;
  getAll(): Observable<AssetBrand[]> {
    return this.http.get<AssetBrand[]>(this.apiUrl);
  }

  getById(id: string): Observable<AssetBrand> {
    return this.http.get<AssetBrand>(`${this.apiUrl}/${id}`);
  }

  getByCategoryId(categoryId: string): Observable<AssetBrand[]> {
    return this.http.get<AssetBrand[]>(`${this.apiUrl}/by-category/${categoryId}`);
  }

  create(dto: CreateAssetBrand): Observable<AssetBrand> {
    return this.http.post<AssetBrand>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateAssetBrand): Observable<AssetBrand> {
    return this.http.put<AssetBrand>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
