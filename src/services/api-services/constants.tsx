const makePath = (path: string) => `/mock-api/${path.replace(/^\/+/, "")}`;

export const BASE_URL = "/mock-api/";
export const EXPORT_URL = "";
export const CITY_V2 = "/";
export const SOCKET_URL = "";
export const DIGITALOCEAN_SPACES_ENDPOINT_ACCESS = "/mock-assets/";
export const UPLOAD_PDF = `${BASE_URL}courses/upload/documents`;

export const GET_FORM_FIELDS = makePath("company/form");
export const GET_FORM_RECORD = makePath("module/get-form-record");
export const ForgetPassword = makePath("user/reset-password");
export const RESETPASSWORD = (token: string) =>
  makePath(`user/get/valid/token/password?token=${token}`);
export const UPDATEPASSWORD = makePath("user/update-password");

export const GET_AGENTS_RANK_LIST = (
  location_id: any,
  _pageNo: any,
  search: any
) => makePath(`user/rank?location_id=${location_id}&search=${search}`);
export const GET_EMPLOYEE_PREVIOUS_BADGE = (locationId: any) =>
  makePath(`user/badge-number?location_id=${locationId}`);
export const ADD_MULTIPLE_COMMENTS = makePath("user/add-comment");
export const GET_FORM_RECORD_BY_ID = makePath("module/form-record-by-id");
export const UPDATE_FORM_RECORD = (
  companyId: any,
  locationId: any,
  leaveId: any
) =>
  makePath(
    `company/update/${companyId}/location/${locationId}/leave-data/${leaveId}`
  );
export const UPDATE_FORM_DATA = makePath("module/form/update");
export const GET_USERS_COMMENTS = (userId: any, locationId: any) =>
  makePath(`user/comment/list/${userId}${locationId}`);
export const GET_USERS = makePath("user");
export const leave_type = (companyId: any, locationId: any) =>
  makePath(`company/${companyId}/location/${locationId}/leave`);
export const GET_EMPLOYEE_DATA = (
  companyId: any,
  locationId: any,
  params: string
) => makePath(`company/${companyId}/location/${locationId}/employee${params}`);
export const SAVE_LEAVE_FORM = makePath("module/save-form");
export const GET_MENU_API = (id: any) => makePath(`company/${id}/module`);
export const GET_LOCATION = makePath("company/details");
export const SAVE_FORM = makePath("user/save?type=user_basic_info");
export const SAVE_EMPLOYEE_FORM_SECTION = (type: any) =>
  makePath(`user/save?type=${type}`);
export const EMPLOYEE_DOCUMENT_BY_ID = makePath("user/document/");
export const SAVE_EMPLOYEE_PERMIT_DOCUMENTS_FORM = (id: any) =>
  makePath(`user/update-document/${id}`);
export const SAVE_EMPLOYEE_FIELDS_FORM = (type: any) =>
  makePath(`user/save?type=${type}`);
export const SAVE_EMPLOYEE_DOCUMENT_FIELD = (type: any) =>
  makePath(`user/user-save?type=${type}`);
export const GET_EMPLOYEE_FIELD_VALUES_BY_ID = (type: any, id: any) =>
  makePath(`user/get-user-info-record-by-id/${type}/${id}`);
export const GET_SERVICE_LIST = (id: any, search: any) =>
  makePath(`user/services?location_id=${id}&search=${search}`);
export const SAVE_EMPLOYEE_DOCUMENT_FORM = (type: any) => makePath(`user/${type}`);
export const GET_EMPLOYEE_FIELD_VALUES_BY_SECTION = (type: any, id: any) =>
  makePath(`user/${id}/${type}`);
export const GET_USER_ACCESS_PERMISSIONS = (
  type: any,
  id: any,
  locationId: any,
  sub_module_id?: string
) =>
  makePath(
    `user/${id}/${type}?location_id=${locationId}&sub_module_id=${sub_module_id}`
  );
export const SAVE_USER_PERMISSIONS = (type: any) =>
  makePath(`user/save?type=${type}`);
export const GET_EMPLOYEE_FIELD_VALUES = (id: any, type: any, query: any) =>
  makePath(`user/${id}/${type}${query}`);
export const GET_EMPLOYEE_WORK_HISTORY = (queryParam: string) =>
  makePath(`user/work/get-work-history${queryParam}`);
export const EMPLOYEE_COMMON_FORM = makePath("user/employee-form/");
export const UPDATE_EMPLOYEE_DOCUMENT_BY_ID = makePath("user/update-document/");
export const DELETE_EMPLOYEE_DOCUMENT_BY_ID = makePath("user/delete-document/");
export const UPDATE_EMPLOYEE_PASSWARD = makePath("user/update/password");
export const DELETE_EMPLOYEE_SUB_RECORD_BY_ID = (type: any, id: any) =>
  makePath(`user/${type}/${id}`);
export const GET_ATTENDANCE = makePath("user/get/employee/attendance");
export const DOWNLOAD_CSV = makePath("user/attendance?is_csv=true");
export const GET_FORM_ATTENDENCE_FORM = makePath("company/form");
export const GET_USER_ROLES = (id: any) => makePath(`user/role?location_id=${id}`);
export const GET_LEAVE_GRID = makePath("company/form");
export const GET_LEAVE_GRID_DATA = makePath("company/get/data/apply-leave-data");
export const LEAVES_API = (comapanyId: any, locationId: any) =>
  makePath(`company/${comapanyId}/location/${locationId}/remaining-leave`);
export const lEAVE_UPDATE = (id: number, status: any) =>
  makePath(`company/leave/${id}/${status}`);
export const UPDATE_lEAVE_ACTION = (id: any, typeId: any) =>
  makePath(`company/leave/${id}/${typeId}`);
export const UPDATE_LEAVE_FORM_BY_ID = (id: any) =>
  makePath(`company/get/1/location/1/leave-data/${id}`);
export const GRID_API_DATA = (
  companyId: any,
  locationId: any,
  api: string,
  obj: string
) => makePath(`company/${companyId}/location/${locationId}/${api}${obj}`);
export const UPDATE_ATTENDENCE_TIME = (
  attendenceId: any,
  companyId: any,
  locationId: any,
  id: any,
  extra = ""
) =>
  makePath(
    `user/update/working-hours?id=${attendenceId}&companyId=${companyId}&locationId=${locationId}&user_id=${id}${extra}`
  );
export const GET_DASHBOARD = (companyId: any, locationId: any) =>
  makePath(`company/dashboard?company_id=${companyId}&location_id=${locationId}`);
export const GET_SITE_DASHBOARD = (companyId: any, locationId: any) =>
  makePath(`company/my-sites?company_id=${companyId}&location_id=${locationId}`);
export const GET_RESENT_ACTIVITY = (companyId: any, locationId: any) =>
  makePath(
    `company/recent-activities?company_id=${companyId}&location_id=${locationId}`
  );
export const GET_PAYROLL = makePath("company/form");
export const GET_PAYROLL_DATA = makePath("user/get/payroll/list");
export const GET_EMPLOYEE_EXPORT_DATA = makePath("user/export-employee-report");
export const GET_PAYROLL_DETAILS = makePath("user/working-detail-form/30");
export const GET_PAYROLL_DETAILS_DATA = (
  payRollId: any,
  companyId: any,
  locationId: any
) =>
  makePath(
    `user/get/working/details?id=${payRollId}&companyId=${companyId}&locationId=${locationId}`
  );
export const UPDATE_PAYROLL_DATA = (companyId: any, locationId: any) =>
  makePath(`user/update/payroll?companyId=${companyId}&locationId=${locationId}`);
export const DELETE_PAYROLL = (
  payRollId: any,
  companyId: any,
  locationId: any
) =>
  makePath(
    `user/delete/payroll?companyId=${companyId}&locationId=${locationId}&id=${payRollId}`
  );
export const CREATE_GROUP = makePath("chat/create-group");
export const GET_LAST_DATE_WORKED = (companyId: any, locationId: any, id: any) =>
  makePath(
    `user/get/work/last-working-day?company_id=${companyId}&location_id=${locationId}&user_id=${id}`
  );
export const UPLOAD_EMPLOYEE_IMAGE = (_user: any) =>
  makePath("user/upload_profile_photo");
export const GET_INCIDENTS = makePath("company/incident-report-graph");
export const SELECT_PAYROLL = makePath("user/update/user-payroll/mass-status");
export const GET_ALLOWANCES = (params: string) =>
  makePath(`company/get-all/setting/allowance?${params}`);
