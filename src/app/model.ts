// ─────────────────────────────────────────────────────────────────────────────
// 📂 src/app/shared/models/category.model.ts
// ─────────────────────────────────────────────────────────────────────────────
export interface AssetCategory {
  id: string;
  categoryName: string;
  isActive: boolean;
}

export interface CreateAssetCategory {
  categoryName: string;
}

export interface UpdateAssetCategory {
  categoryName: string;
  isActive: boolean;
}


// ─────────────────────────────────────────────────────────────────────────────
// 📂 src/app/shared/models/brand.model.ts
// ─────────────────────────────────────────────────────────────────────────────
export interface AssetBrand {
  id: string;
  brandName: string;
  assetCategoryId: string;
  categoryName: string;
  isActive: boolean;
}

export interface CreateAssetBrand {
  brandName: string;
  assetCategoryId: string;
}

export interface UpdateAssetBrand {
  brandName: string;
  assetCategoryId: string;
  isActive: boolean;
}


// ─────────────────────────────────────────────────────────────────────────────
// 📂 src/app/shared/models/model.model.ts
// ─────────────────────────────────────────────────────────────────────────────
export interface AssetModel {
  id: string;
  modelName: string;
  assetCategoryId: string;
  categoryName: string;
  assetBrandId: string;
  brandName: string;
  isActive: boolean;
}

export interface CreateAssetModel {
  modelName: string;
  assetCategoryId: string;
  assetBrandId: string;
}

export interface UpdateAssetModel {
  modelName: string;
  assetCategoryId: string;
  assetBrandId: string;
  isActive: boolean;
}


// ─────────────────────────────────────────────────────────────────────────────
// 📂 src/app/shared/models/datagrid.model.ts
// ─────────────────────────────────────────────────────────────────────────────
export interface DatagridColumn {
  field: string;
  header: string;
  type: 'text' | 'badge' | 'actions';
  badgeActiveText?: string;
  badgeInactiveText?: string;
}
export interface Vendor {
  id: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber: string | null;
  address: string | null;
  isActive: boolean;
}

export interface CreateVendor {
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber?: string | null;
  address?: string | null;
}

export interface UpdateVendor {
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber?: string | null;
  address?: string | null;
  isActive: boolean;
}
