// export type Beat_data = {
//   id: number;
//   beat_name: string;
//   beat_description: string;
//   shifts: any;
// };

export type Beat_data = Partial<{
  id: string;
  site_id: string;
  beat_name: string;
  site_name?: string;
  site_type_standing: number;
  site_type_concierge: number;
  site_type_patrol: number;
  coverage_name: string | null;
  coverage_id: string | null;
  service_id: string | null;
  service_name: string | null;
  service_code: string | null;
  shifts: Shift[];
  beat_description?: string;
}>;

export type Shift = {
  id: number;
  site_id: string;
  location_id: string;
  user_id: string | null;
  service_id: string;
  beat_id: string | null;
  check_in: string;
  check_out: string;
  shift_day: string;
  shift_type: string;
  shift_date: any;
  shift_start_time: any;
  shift_end_time: any;
  shift_break_time: number;
  shift_total_hours: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  values: any;
};
