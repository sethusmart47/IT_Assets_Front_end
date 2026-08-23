export enum OwnershipType {
  Company = 1,
  Employee = 2,
  Leased = 3,
  Rental = 4
}

export enum PurchaseStatus {
  Draft = 1,
  Completed = 2
}

export enum WarrantyPeriod {
  ThreeMonths = '3 Months',
  SixMonths = '6 Months',
  TwelveMonths = '12 Months',
  EighteenMonths = '18 Months',
  TwentyFourMonths = '24 Months',
  ThirtySixMonths = '36 Months',
  FortyEightMonths = '48 Months',
  SixtyMonths = '60 Months'
}

export const OWNERSHIP_TYPES = [
  { value: OwnershipType.Company, label: 'Company' },
  { value: OwnershipType.Employee, label: 'Employee' },
  { value: OwnershipType.Leased, label: 'Leased' },
  { value: OwnershipType.Rental, label: 'Rental' }
];

export const WARRANTY_PERIODS = [
  { value: '3 Months', label: '3 Months' },
  { value: '6 Months', label: '6 Months' },
  { value: '12 Months', label: '12 Months' },
  { value: '18 Months', label: '18 Months' },
  { value: '24 Months', label: '24 Months' },
  { value: '36 Months', label: '36 Months' },
  { value: '48 Months', label: '48 Months' },
  { value: '60 Months', label: '60 Months' }
];

export const PURCHASE_STATUSES = [
  { value: PurchaseStatus.Draft, label: 'Draft' },
  { value: PurchaseStatus.Completed, label: 'Completed' }
];