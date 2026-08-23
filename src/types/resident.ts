export interface Resident {
  id: number;
  full_name: string;
  phone_number: string;
  purok_zone: string | null;
  sms_opt_in: boolean;
  created_at: string;
}

export interface ResidentRegistration {
  full_name: string;
  phone_number: string;
  purok_zone?: string;
}