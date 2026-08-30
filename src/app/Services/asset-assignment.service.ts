import { Injectable } from '@angular/core';
import { AssignAssetRequest, AssignmentResponse, Employee, EmployeeAssignment, ReturnAssetRequest, ReturnResponse, SurrenderAssetsRequest } from '../models/Employee';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment';
import { AssetDetail } from '../models/Asset';

@Injectable({
  providedIn: 'root'
})
export class AssetAssignmentService {

  private readonly baseUrl = `${environment.apiUrl}/AssetAssignment`;
  private readonly assetUrl = `${environment.apiUrl}/asset`;

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

  // ─── Asset Search ──────────────────────────────────────────────────────────────

  searchAvailableAsset(serialNumber?: string, assetTag?: string): Observable<AssetDetail> {
    let params = new HttpParams();
    if (serialNumber) params = params.set('serialNumber', serialNumber);
    if (assetTag) params = params.set('assetTag', assetTag);
    return this.http.get<AssetDetail>(`${this.assetUrl}/available/search`, { params });
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
