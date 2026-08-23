export type DirectoryType = 'abtc' | 'health_center' | 'hospital' | 'barangay_outpost';

export interface DirectoryEntry {
  id: number;
  name: string;
  type: DirectoryType;
  address: string;
  contact_number: string | null;
  operating_hours: string | null;
  services_offered: string | null;
  requirements: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
}