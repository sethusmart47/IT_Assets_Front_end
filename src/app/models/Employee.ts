export interface Employee {
  id: string;
  employeeName: string;
  email: string;
  department: string;
  designation: string;
  activeAssetCount: number;
}

export interface EmployeeAssignment {
  assignmentId: string;
  assetId: string;
  assetTag: string;
  serialNumber: string;
  category: string;
  brand: string;
  model: string;
  configuration: string | null;
  status: string;
  assignedDate: string;
  returnedDate: string | null;
  conditionAtReturn: number | null;
  conditionAtReturnName: string | null;
  remarks: string | null;
}



export interface AssignAssetRequest {
  assetId: string;
  employeeId: string;
}

export interface ReturnAssetRequest {
  conditionAtReturn: number;
  remarks: string | null;
}

export interface SurrenderAssetItem {
  assignmentId: string;
  conditionAtReturn: number;
  remarks: string | null;
}

export interface SurrenderAssetsRequest {
  assets: SurrenderAssetItem[];
}

export interface AssignmentResponse {
  id: string;
  assetId: string;
  assetTag: string;
  serialNumber: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  assignedDate: string;
}

export interface ReturnResponse {
  assignmentId: string;
  assetId: string;
  assetTag: string;
  serialNumber: string;
  newStatus: string;
  conditionName: string;
  returnedDate: string;
}
