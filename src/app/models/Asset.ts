export interface AssetListDto {
  id: string;
  assetTag: string;
  serialNumber: string;
  category: string;
  brand: string;
  model: string;
  configuration: string | null;
  status: number;
  statusName: string;
  condition: number;
  conditionName: string;
  warrantyEndDate: string;
  isWarrantyActive: boolean;
  currentEmployeeId: string | null;
  createdDate: string;
}

export interface AssetDetailDto {
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
  lifecycleHistories: AssetLifecycleHistoryDto[];
  createdDate: string;
  createdBy: string | null;
}

export interface AssetLifecycleHistoryDto {
  id: string;
  assetId: string;
  action: string;
  oldStatus: number | null;
  oldStatusName: string | null;
  newStatus: number;
  newStatusName: string;
  remarks: string | null;
  performedBy: string;
  performedDate: string;
  employeeId: string | null;
  referenceId: string | null;
  referenceType: string | null;
}

export interface AssetDto {
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
  lastServiceDate: string | null;
  remarks: string | null;
  currentEmployeeId: string | null;
  assignedDate: string | null;
  purchaseNumber: string;
  vendorName: string;
  purchaseDate: string;
  createdDate: string;
}

export interface AvailablePurchaseDto {
  id: string;
  purchaseNumber: string;
  vendorName: string;
  purchaseDate: string;
  totalItems: number;
  totalQty: number;
  registeredQty: number;
  remainingQty: number;
}

export interface AvailablePurchaseItemDto {
  purchaseItemId: string;
  category: string;
  brand: string;
  model: string;
  configuration: string | null;
  unitPrice: number;
  warrantyMonths: number;
  purchasedQty: number;
  registeredQty: number;
  remainingQty: number;
}

export interface RegistrationSummaryDto {
  purchaseId: string;
  purchaseNumber: string;
  totalPurchasedQty: number;
  registeredQty: number;
  remainingQty: number;
}

export interface ValidationResultDto {
  validSerials: string[];
  errors: ValidationError[];
  isValid: boolean;
}

export interface ValidationError {
  index: number;
  serialNumber: string;
  error: string;
}

export interface CreateAssetDto {
  purchaseId: string;
  serialNumber: string;
  category: string;
  brand: string;
  model: string;
  configuration: string | null;
  condition: number;
  ownershipType: number;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyMonths: number;
  remarks: string | null;
}

export interface BulkCreateAssetDto {
  purchaseId: string;
  category: string;
  brand: string;
  model: string;
  configuration: string | null;
  condition: number;
  ownershipType: number;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyMonths: number;
  remarks: string | null;
  serialNumbers: string[];
}

export interface UpdateAssetDto {
  condition: number;
  remarks: string | null;
}

export interface ValidateSerialNumbersDto {
  purchaseId: string;
  serialNumbers: string[];
}

export interface SerialEntry {
  index: number;
  serialNumber: string;
  status: 'pending' | 'valid' | 'error' | 'duplicate' | 'empty';
  errorMessage?: string;
}

export const ASSET_STATUS_OPTIONS = [
  { value: 1, label: 'Available' },
  { value: 2, label: 'Assigned' },
  { value: 3, label: 'In Service' },
  { value: 4, label: 'Retired' },
  { value: 5, label: 'Lost' },
  { value: 6, label: 'Disposed' }
];

export const ASSET_CONDITION_OPTIONS = [
  { value: 1, label: 'New' },
  { value: 2, label: 'Good' },
  { value: 3, label: 'Fair' },
  { value: 4, label: 'Poor' },
  { value: 5, label: 'Damaged' }
];

export const OWNERSHIP_TYPE_OPTIONS = [
  { value: 1, label: 'Company Owned' },
  { value: 2, label: 'Leased' },
  { value: 3, label: 'BYOD' }
];