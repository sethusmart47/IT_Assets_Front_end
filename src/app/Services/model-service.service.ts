import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { AssetModel, CreateAssetModel, UpdateAssetModel } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class ModelService{

  constructor(private http: HttpClient) { }
  private readonly apiUrl = `${environment.apiUrl}/Model`;

  getAll():Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(`${this.apiUrl}`);
  }
  getbyId(id: string):Observable<AssetModel>{
    return this.http.get<AssetModel>(`${this.apiUrl}/${id}`);

  }
  create(dto:CreateAssetModel):Observable<AssetModel>{
    return this.http.post<AssetModel>(`${this.apiUrl}`,dto);
}
update(id:string,dto:UpdateAssetModel):Observable<AssetModel>{
  return this.http.put<AssetModel>(`${this.apiUrl}/${id}`,dto); 
}
delete(id:string):Observable<any>{
  return this.http.delete(`${this.apiUrl}/${id}`);  }
}

