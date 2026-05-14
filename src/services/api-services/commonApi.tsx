import {
  listResponse,
  mockBeats,
  mockCompany,
  mockFormFields,
  mockLocations,
  mockRoles,
  mockSites,
  ok,
  success,
} from "services/mockData";

export const getFormFields = async () => ok(mockFormFields);

export const getGridRecord = async () =>
  ok({
    data: [],
    count: 0,
  });

export const getMenuData = async () =>
  ok({
    menuItems: [
      {
        id: "ats",
        title: "Applicant Tracking System",
        path: "admin/ats",
        isSideBar: true,
        sub_module: [],
      },
    ],
    companyDetails: mockCompany,
    globalCode: { data: [] },
    userDetails: {
      token: "demo-token",
      locale: "en",
      name: "Demo Recruiter",
    },
    token: "demo-token",
  });

export const getRolesData = async () => ok(mockRoles);

export const getLocationList = async () =>
  ok({
    ...mockCompany,
    locations: mockLocations,
  });

export const getSitesListData = async () => listResponse(mockSites);

export const getBeatsListData = async () => listResponse(mockBeats);

export const getStatesListData = async () =>
  ok({
    data: [
      { id: "NY", name: "New York", code: "NY" },
      { id: "TX", name: "Texas", code: "TX" },
      { id: "CA", name: "California", code: "CA" },
    ],
  });

export const getAgentRanksList = async () =>
  ok({
    data: [
      { id: "rank-1", name: "Officer" },
      { id: "rank-2", name: "Supervisor" },
      { id: "rank-3", name: "Dispatcher" },
    ],
  });

export const getServiceListFromApi = async () =>
  ok([
    { id: "svc-1", service_name: "Standing Guard", service_code: "SG" },
    { id: "svc-2", service_name: "Mobile Patrol", service_code: "MP" },
  ]);

export const getEmployeePreviousBadge = async () =>
  ok({ data: { badge_number: "ATS-1042" } });

export const saveFormData = async (_id?: any, params?: object) =>
  success(params);

export const uploadEmployeeImage = async () =>
  success([
    {
      id: "employee-image",
      file_url: "/mock-assets/profile-photo.png",
    },
  ]);

export const getUser = async () => ok([]);
export const getUserById = async () => ok({});
export const getLocation = async () => ok(mockLocations);
export const getServiceList = async () => ok([]);
export const addComments = async (params?: object) => success(params);
export const getUserComments = async () => ok([]);
export const getEmployeeData = async () => listResponse([]);
export const getEmployeeFormFieldsBySection = async () => ok(mockFormFields);
export const getEmployeeFieldValuesBySection = async () => ok({});
export const getEmployeeFieldValuesById = async () => ok({});
export const getEmployeeFieldValues = async () => ok({});
export const saveEmployeeDocumentForm = async (params?: object) => success(params);
export const saveEmployeePermitDocumentsForm = async (params?: object) => success(params);
export const updateAdditionalDocumentData = async (_id?: any, params?: object) => success(params);
export const getEmployeePreviousWorkHistory = async () => ok([]);
export const getAllowances = async () => ok([]);
