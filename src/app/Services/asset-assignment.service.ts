import { Injectable } from '@angular/core';
import { AssignAssetRequest, AssignmentResponse, Employee, EmployeeAssignment, ReturnAssetRequest, ReturnResponse, SurrenderAssetsRequest } from '../models/Employee';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AssetAssignmentService {

  private readonly baseUrl = `${environment.apiUrl}/AssetAssignment`;

  constructor(private http: HttpClient) {}

  // ─── Employee ──────────────────────────────────────────────────────────────────

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`);
  }

  // ─── Assignments ───────────────────────────────────────────────────────────────

  getAssignmentsByEmployee(employeeId: string): Observable<EmployeeAssignment[]> {
    return this.http.get<EmployeeAssignment[]>(
      `${this.baseUrl}/employees/${employeeId}/assignments`
    );
  }

  // ─── Assign ────────────────────────────────────────────────────────────────────

  assignAsset(request: AssignAssetRequest): Observable<AssignmentResponse> {
    return this.http.post<AssignmentResponse>(`${this.baseUrl}/assign`, request);
  }

  // ─── Return ────────────────────────────────────────────────────────────────────

  returnAsset(assignmentId: string, request: ReturnAssetRequest): Observable<ReturnResponse> {
    return this.http.post<ReturnResponse>(`${this.baseUrl}/${assignmentId}/return`, request);
  }

  // ─── Surrender ─────────────────────────────────────────────────────────────────

  surrenderAssets(employeeId: string, request: SurrenderAssetsRequest): Observable<ReturnResponse[]> {
    return this.http.post<ReturnResponse[]>(`${this.baseUrl}/surrender/${employeeId}`, request);
  }
}
