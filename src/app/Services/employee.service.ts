import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/Employee';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { devOnlyGuardedExpression } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
private readonly baseUrl = `${environment.apiUrl}/Employee`;
 
   constructor(private http: HttpClient) {}
 
   // ─── Employee ──────────────────────────────────────────────────────────────────
 
   getAllEmployees(): Observable<Employee[]> {
     return this.http.get<Employee[]>(`${this.baseUrl}`);
   }
    getEmployeeById(id:string): Observable<Employee> {
      debugger
     return this.http.get<Employee>(`${this.baseUrl}/${id}`);
   }
}
