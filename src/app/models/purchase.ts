export interface PurchaseListDto {
  id: string;
  purchaseNumber: string;
  vendorId: number;
  vendorName: string;
  purchaseDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  expectedDeliveryDate: string;
  ownershipType: number;
  ownershipTypeName: string;
  totalAmount: number;
  remarks: string | null;
  status: number;
  statusName: string;
  itemCount: number;
  totalUnits: number;
  attachmentCount: number;
}

export interface PurchaseDetailDto {
  id: string;
  purchaseNumber: string;
  vendorId: number;
  vendorName: string;
  purchaseDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  expectedDeliveryDate: string;
  ownershipType: number;
  ownershipTypeName: string;
  totalAmount: number;
  remarks: string | null;
  status: number;
  statusName: string;
  items: PurchasedItemDto[];
  attachments: PurchaseAttachmentDto[];
}

export interface CreatePurchaseDto {
  vendorId: number;
  purchaseDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  expectedDeliveryDate: string;
  ownershipType: number;
  remarks?: string;
}

export interface UpdatePurchaseDto {
  vendorId: number;
  purchaseDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  expectedDeliveryDate: string;
  ownershipType: number;
  remarks?: string;
}

export interface PurchasedItemDto {
  id: string;
  purchaseId: string;
  category: string;
  brand: string;
  model: string;
  configuration: string;
  quantity: number;
  unitPrice: number;
  warrantyPeriod: string;
  subTotal: number;
}

export interface CreatePurchasedItemDto {
  category: string;
  brand: string;
  model: string;
  configuration: string;
  quantity: number;
  unitPrice: number;
  warrantyPeriod: string;
}

export interface UpdatePurchasedItemDto {
  category: string;
  brand: string;
  model: string;
  configuration: string;
  quantity: number;
  unitPrice: number;
  warrantyPeriod: string;
}

export interface PurchaseAttachmentDto {
  id: string;
  purchaseId: string;
  fileName: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  fileSizeDisplay: string;
  createdDate: string;
}

export interface NextPurchaseNumberDto {
  purchaseNumber: string;
}

export interface VendorDto {
  id: number;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
  isActive: boolean;
}