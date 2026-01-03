import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Clinic = {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  current_balance: number;
  total_cases: number;
  total_paid: number;
  last_payment_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Case = {
  id: string;
  case_id: string;
  clinic_id: string;
  item: string;
  quantity: number;
  amount: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED';
  description: string | null;
  notes: string | null;
  case_date: string;
  ready_date: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  clinic_id: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  payment_method: string | null;
  reference_number: string | null;
  notes: string | null;
  payment_date: string;
  created_at: string;
  created_by: string | null;
};