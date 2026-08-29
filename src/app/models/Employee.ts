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

export interface AssetDetail {
  id: string;
  assetTag: string;
  serialNumber: string;
  purchaseId: string;
  category: string;
  brand: string;
  model: string;
  configuration: string | null;
  status: number;
  statusName: string;
  condition: number;
  conditionName: string;
  ownershipType: number;
  ownershipTypeName: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyMonths: number;
  isWarrantyActive: boolean;
  warrantyDaysRemaining: number;
  lastServiceDate: string | null;
  remarks: string | null;
  currentEmployeeId: string | null;
  assignedDate: string | null;
  purchaseNumber: string;
  vendorName: string;
  purchaseDate: string;
  lifecycleHistories: AssetLifecycleHistory[];
  createdDate: string;
  createdBy: string | null;
}

export interface AssetLifecycleHistory {
  id: string;
  assetId: string;
  action: string;
  oldStatus: string | null;
  newStatus: string;
  employeeName: string | null;
  employeeEmail: string | null;
  remarks: string | null;
  performedBy: string;
  performedDate: string;
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
