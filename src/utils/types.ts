import { MenuProps } from "antd";
import { Dayjs } from "dayjs";
import { EditorState } from "draft-js";

export type MenuItem = Required<MenuProps>["items"][number];
export type Field = {
  accept?: string;
  button?: any;
  placeholder?: any;
  name?: any;
  label?: any;
  id?: string;
  type?: string;
  validations?: any;
  options: any;
  key?: any;
  category?: any;
  is_multiple?: any;
  is_edit?: boolean;
  is_searchable?: boolean;
};

// Define the structure of the auth state
export interface AuthState {
  globleCodes: any; // Replace 'any' with the actual type
  companyDetails: ICompany_Details; // Replace 'any' with the actual type
  userDetails: UserDetails; // Replace 'any' with the actual type
}

// Define the overall application state
export interface RootState {
  auth: AuthState;
}

export interface UserDetails {
  id: string;
  company_id: string;
  agent_id: string | null;
  badge_number: string;
  rank: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  main_phone: string;
  email: string;
  profile_photo: string;
  gender: "Male" | "Female" | "Other";
  marital_status: "1" | "2" | "3" | "4"; // Enum for marital status (e.g., Single, Married, etc.)
  email_verified_at: string | null;
  password: string;
  type: "company_admin" | "agent" | "user"; // Enum for user type
  logged_in: number; // 0 or 1
  status: number; // Active status (e.g., 0 = Inactive, 1 = Active)
  agent_active: number; // 0 or 1
  disabled: number; // 0 or 1
  show_in_admin: number; // 0 or 1
  client_site: string | null;
  client_activity: string | null;
  date_created: string; // ISO date string
  last_location_lat: number;
  last_location_lon: number;
  sms_active: number; // 0 or 1
  sms_phone_number: string | null;
  hire_date: string; // ISO date string
  birthdate: string; // ISO date string
  is_armed: number; // 0 or 1
  firearm_qualification_date: string | null;
  firearm_qualification_expire: string | null;
  firearm_permit_number: string | null;
  guardcard_number: string | null;
  guardcard_expire: string | null;
  drivers_license_state: string | null;
  drivers_license_number: string | null;
  drivers_license_expire: string | null;
  nightmode_active: number; // 0 or 1
  nightmode_theme: "Enabled" | "Disabled";
  emergency_note: string;
  remember_token: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
  current_role_id: string;
  last_seen: string; // ISO date string
  location_id: number;
}


export type ICompany_Details = {
  id: number;
  business_type_id: number;
  name: string;
  logo: string;
  domain: string | null;
  owner: string;
  email: string;
  language_code: string;
  timezone: string | null;
  date_format: string;
  layout: string;
  street: string;
  address: string | null;
  street_name: string;
  state: string;
  zip_code: string;
  city: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  locations: LocationType[];
};

export type Grid_Column = {
  group_by: string;
  key?: string;
  title?: string;
  default?: boolean;
  sortable?: boolean;
  dataindex?: string;
  searchable?: boolean;
  fixed?: boolean;
  viewable?: boolean;
  order_by?: number;
};

export type LocationType = {
  id?: number;
  address?: string;
  street?: string;
  street_name?: string;
  latitude?: number;
  longitude?: number;
  theme?: string;
  logo?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  country_code?: string;
  date_format?: string;
  timezone?: string;
  language?: string;
  is_default?: number;
  company_id?: number;
  name?: string;
  time_format?: string;
  week_day_start?: string;
  working_hours?: null | any;
};

export type Route = {
  path: string;
  title: string;
  key?: string;
};

export type Permission = {
  view: boolean;
  edit: boolean;
  delete: boolean;
  create: boolean;
};

export type Sub_Menu_Items = {
  id: number;
  path: string;
  logo: string;
  title: string;
  isSideBar: boolean;
  children: any[]; // You can specify a more specific type if there are specific child structures
  routes: Route[];
  permission: Permission;
};

export type Menu_Items = {
  id: number;
  path: string;
  logo: string;
  title: string;
  isSideBar: boolean;
  children: any[]; // You can specify a more specific type if there are specific child structures
  sub_module: Sub_Menu_Items[];
  permission: Permission;
};

export type RangeValue = [Dayjs | null, Dayjs | null] | null;

// Define the interface for the member object
interface Member {
  chat_id: number;
  member_id: string;
  id: number;
  created_at: string;
  updated_at: string;
}

// Define the interface for the data object
interface Data {
  message: string;
  statusCode: number;
  data: any;
  err: any[];
}

// Define the interface for the headers object
interface Headers {
  "content-length": string;
  "content-type": string;
}

// Define the interface for the transitional object
interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

// Define the interface for the config object
interface Config {
  transitional: Transitional;
  adapter: string[];
  transformRequest: any[];
  transformResponse: any[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Record<string, any>;
  headers: Record<string, string>;
  method: string;
  url: string;
  data: string;
}

// Define the interface for the root object
export interface ApiResponse {
  data: Data;
  status: number;
  statusText: string;
  headers: Headers;
  config: Config;
  request: Record<string, any>;
}

export type IWorkingHours = {
  start: string; // ISO date string
  end: string; // ISO date string
};

export type IAccountManager = {
  account_manager_name: string;
  account_manager_email: string;
};

export type ILocation = {
  id: number;
  address: string;
  street: string;
  street_name: string;
  name: string;
  short_name: string;
  time_format: string; // e.g., "24 hours"
  week_day_start: string; // e.g., "Monday"
  latitude: number;
  longitude: number;
  theme: string;
  logo: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  country_code: string;
  date_format: string; // e.g., "MM/DD/YYYY"
  timezone: string;
  working_hours: IWorkingHours[];
  language: string;
  currency_code: string | null;
  days_payable: number;
  weekly_pay_start: string | null;
  weekly_pay_end: string | null;
  weekly_pay_day: string | null;
  bi_weekly_pay_start: string | null;
  bi_weekly_pay_end: string | null;
  bi_weekly_pay_day: string | null;
  bi_monthly_first_pay_start: string | null;
  bi_monthly_first_pay_end: string | null;
  bi_monthly_first_pay_day: string | null;
  bi_monthly_second_pay_start: string | null;
  bi_monthly_second_pay_end: string | null;
  bi_monthly_second_pay_day: string | null;
  monthly_pay_start: string;
  monthly_pay_end: string;
  monthly_pay_date: string;
  next_date: string | null;
  radius_miles: string;
  radius_type: string;
  is_default: boolean;
  account_manager: IAccountManager[];
  created_at: string; // ISO date string
  created_by: string | null;
  updated_at: string; // ISO date string
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
};

export type ICall = {
  site_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  site_name: string;
  avg_call_duration_hours: string; // number as string
};

export type Invoice = {
  past: number;
  upcoming: string; // price as string
  date: string; // date in string format (MM/DD/YYYY)
};

export type ICallsAvg = {
  site_id: string;
  site_name:string;
  avg_call_duration_hours: string;
};

// Define the interface for total call information
export type TotalCall = {
  total_call: string; // Total number of calls as a string
}

// Define the interface for each call count entry
export type CallCount = {
  call_received_from: string; // Source of the call
  call_count: string; // Count of calls from that source as a string
  name: string;
  count: number;
}

// Define the interface for the overall call data
export type  CallData = {
  total_call: TotalCall; // Total call information
  calls_count: CallCount[]; // Array of call count entries
}

export type IncidentData =  {
  major_incident: number;
  incident: number;
  calls_list: ICall[];
  invoice: Invoice;
  calls_avg: ICallsAvg[];
  calls: CallData
};

export interface FormType {
  id: number;
  name: string;
  is_multiple: boolean;
  key: string;
  fields: Field[];
}

export type globalSearch = {
  title: string;
};

export type Grid = {
  actions: Actions;
  column: Grid_Column[];
  form_actions: Actions[];
  screen_id: string;
  sub_module_id: string;
  name: string;
};


export type SideBar = { id: number; title: string; button: string };

export type Actions = {
  key: string;
  title?: string;
  path?: string;
};

export type Common_Form = {
  actions: Actions[];
  form: FormType[];
  globalSearch: globalSearch;
  grid: Grid;
  sideBar: SideBar;
  name: string;
};


export interface Common_Api_Type {
  data: {
    data: Common_Form;
    err: Error;
  };
  config: {};
  status: number;
}


export interface Certificate {
  id: string;
  company_id: string;
  location_id: string;
  name: string;
  path: string;
  description: string;
  added_by: string;
  created_at: string;
  updated_at: string;
  serial_number: string;
  action:any[]
}

export interface TextElement {
  id: string;
  type: string;
  content: string | EditorState;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  is_sign?: string;
  key?: string;
}
export type IReportData = {
  id: string;
  location_id: string; // Comma-separated IDs
  company_id: string;
  client_id: string;
  site_ids: string | null;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  report_type: string;
  file_name: string;
  file_url: string | null;
  created_at: string; // ISO date string
  created_by: string;
  updated_at: string | null;
  deleted_at: string | null;
  first_name: string;
  last_name: string;
  badge_number: string;
};
// API error response

export type ApiErrorMessage = {
  message: string;
};
