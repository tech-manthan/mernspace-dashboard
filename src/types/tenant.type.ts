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

export interface CreateTenantData {
  name: string;
  address: string;
}

export interface UpdateTenantData {
  name?: string;
  address?: string;
}

export interface TenantsQueryParams {
  perPage: number;
  currentPage: number;
  q: string;
}
