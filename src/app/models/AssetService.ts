export interface CreateServiceRequestDto {
  assetId: string;
  issueType: string;
  reportedDate: string;
  priority: string;
  vendorName: string | null;
  issueDescription: string | null;
}

export interface ResolveServiceRequestDto {
  resolutionNotes: string | null;
}

// ─── List DTO ────────────────────────────────────────────────────────────────────

export interface ServiceRequestListDto {
  id: string;
  assetTag: string;
  serialNumber: string;
  category: string;
  brand: string;
  model: string;
  issueType: string;
  reportedDate: string;
  priority: string;
  vendorName: string | null;
  status: string;
  resolvedDate: string | null;
}

// ─── Detail DTO ──────────────────────────────────────────────────────────────────

export interface ServiceRequestDto {
  id: string;
  assetId: string;
  assetTag: string;
  serialNumber: string;
  category: string;
  brand: string;
  model: string;
  configuration: string | null;
  issueType: string;
  reportedDate: string;
  priority: string;
  vendorName: string | null;
  issueDescription: string | null;
  status: string;
  resolvedDate: string | null;
  resolutionNotes: string | null;
  createdDate: string;
}

// ─── Asset Search (reuse from existing) ──────────────────────────────────────────

// export interface AssetSearchResult {
//   id: string;
//   assetTag: string;
//   serialNumber: string;
//   category: string;
//   brand: string;
//   model: string;
//   configuration: string | null;
//   status: number;
//   statusName: string;
//   condition: number;
//   conditionName: string;
//   warrantyStartDate: string;
//   warrantyEndDate: string;
//   warrantyMonths: number;
//   isWarrantyActive: boolean;
//   warrantyDaysRemaining: number;
//   currentEmployeeId: string | null;
//   purchaseNumber: string;
//   vendorName: string;
//   purchaseDate: string;
// }


export const ISSUE_TYPES: string[] = [
  'Hardware Fault',
  'Software Issue',
  'Screen/Display Issue',
  'Battery Issue',
  'Connectivity Issue',
  'Physical Damage',
  'Other'
];

export const PRIORITIES: string[] = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

