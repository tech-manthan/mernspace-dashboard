export interface Tenant {
  id: number;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetTenants {
  currentPage: number;
  perPage: number;
  total: number;
  data: Tenant[];
}
