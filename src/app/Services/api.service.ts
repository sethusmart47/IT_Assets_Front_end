import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
//private baseUrl = 'https://localhost:7205/api';
  constructor( private http:HttpClient) { }

 private baseUrl = `${environment.apiUrl}/employee`;
  private accessoryUrl = `${environment.apiUrl}/accessory`;

 

  addEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, employee);
  }

  getEmployeeByEmpCode(empCode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${empCode}`);
  }

  addAccessory(empCode: string, accessory: any): Observable<any> {
    return this.http.post(`${this.accessoryUrl}/${empCode}`, accessory);
  }

  updateAccessory(empCode: string, id: number, accessory: any): Observable<any> {
    return this.http.put(`${this.accessoryUrl}/${empCode}/${id}`, accessory);
  }

  deleteAccessory(empCode: string, id: number): Observable<any> {
    return this.http.delete(`${this.accessoryUrl}/${empCode}/${id}`);
  }
}
