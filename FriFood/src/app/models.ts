export interface Offer {
  id: number;
  partner_id: string;
  title: string;
  description?: string;
  price_original: number;
  price_discounted: number;
  expiry_date: string; // ISO date
  status?: string;
  tenant_id?: string;
}

export interface OfferUpdate {
  title?: string;
  description?: string;
  price_original?: number;
  price_discounted?: number;
  expiry_date?: string; // ISO date
  status?: string;
  tenant_id?: string;
}

export interface Partner {
  id: string;
  name: string;
  address?: string;
  city?: string;
  active: boolean;
  tenant_id?: string;
  latitude?: number;
  longitude?: number;
}

export interface PartnerCreate {
  name: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  active?: boolean;
  tenant_id?: string;
}

export interface PartnerUpdate {
  name?: string;
  address?: string;
  city?: string;
  active?: boolean;
  tenant_id?: string;
  latitude?: number;
  longitude?: number;
}

export interface PartnerNearbyParams {
  lat: number;
  lng: number;
  radius_km?: number;
}

export interface User {
  id: string; // Keycloak user ID (UUID)

  username: string;
  email: string;

  name?: string;
  surname?: string;
  address?: string;

  longitude?: number;
  latitude?: number;

  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime

  partner_id?: string; // FK to Partner (nullable)
  cart?: number[]; // Array of Offer IDs
}

export interface UserUpdate {
  email?: string;
  name?: string;
  surname?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  partner_id?: string;
  cart?: number[];
}
