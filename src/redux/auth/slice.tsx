import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface UserState {
  menuList: any[];
  token: string;
  companyDetails: any;
  globleCodes: any;
  loading: boolean;
  userDetails: {
    token: string;
    locale: string;
  };
  commonForm: {};
  formBuilderList: any;
  editFormBuilderList: any;
  activeTab: any;
}

export const demoCompanyDetails = {
  id: 1,
  name: "Northstar ATS",
  language_code: "en",
  date_format: "MM/DD/YYYY",
  locations: [
    {
      id: 1,
      name: "Head Office",
      date_format: "MM/DD/YYYY",
      language_code: "en",
    },
  ],
};

export const demoMenuItems = [
  {
    id: "ats-dashboard",
    title: "Dashboard",
    path: "admin/ats/dashboard",
    routes: [{ path: "/admin/ats/dashboard" }],
    children: [],
  },
  {
    id: "ats-jobs",
    title: "Jobs",
    path: "admin/ats/job-posting",
    routes: [
      { path: "/admin/ats/job-posting" },
      { path: "/admin/ats/job-posting/form" },
    ],
    children: [],
  },
  {
    id: "ats-candidates",
    title: "Candidates",
    path: "admin/ats/candidates",
    routes: [
      { path: "/admin/ats/candidates" },
      { path: "/admin/ats/candidates/form" },
    ],
    children: [],
  },
  {
    id: "ats-marketing",
    title: "Marketing",
    path: "admin/ats/marketing",
    routes: [{ path: "/admin/ats/marketing" }],
    children: [],
  },
  {
    id: "ats-settings",
    title: "Settings",
    path: "admin/ats/settings",
    routes: [{ path: "/admin/ats/settings" }],
    children: [],
  },
];

export const demoUserDetails = {
  token: "demo-token",
  locale: "en",
  name: "Demo Recruiter",
};

const initialState: UserState = {
  menuList: demoMenuItems,
  globleCodes: { data: [] },
  companyDetails: demoCompanyDetails,
  userDetails: {
    token: "demo-token",
    locale: "en",
  },
  token: "demo-token",
  commonForm: { module_id: "ats-dashboard" },
  loading: false,
  formBuilderList: {},
  editFormBuilderList: {},
  activeTab: "sourced",
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGlobleCodes: (state, action: PayloadAction<any>) => {
      state.globleCodes = action.payload;
    },
    setCompanyDetails: (state, action: PayloadAction<any>) => {
      state.companyDetails = action.payload;
    },
    setMenuItems: (state, action: PayloadAction<any>) => {
      state.menuList = action.payload;
    },
    setCommonForm: (state, action: PayloadAction<any>) => {
      state.commonForm = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<any>) => {
      state.userDetails = action.payload;
    },
    setFormBuilderList: (state, action: PayloadAction<any>) => {
      state.formBuilderList = action.payload;
    },
    setEditFormBuilderList: (state, action: PayloadAction<any>) => {
      state.editFormBuilderList = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setGlobleCodes,
  setCompanyDetails,
  setMenuItems,
  setCommonForm,
  setUserDetails,
  setFormBuilderList,
  setEditFormBuilderList,
  setActiveTab,
} = authSlice.actions;

export default authSlice.reducer;
