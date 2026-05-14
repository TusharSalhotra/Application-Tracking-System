import { BASE_URL } from "services/api-services/constants";

export const CREATE_SOURCE_TYPE = `${BASE_URL}ats/create/source`;
export const UPDATE_SOURCE_TYPE = `${BASE_URL}ats/update/source`;
export const GET_SOURCE_TYPE_LIST = `${BASE_URL}ats/get-all/source`;
export const GET_SOURCE_TYPE_BY_ID = (id: string) =>
  `${BASE_URL}ats/source/${id}`;
export const DELETE_SOURCE_TYPE_BY_ID = (id: string) =>
  `${BASE_URL}ats/source/${id}`;
//CW class code constants
export const CREATE_SKILL_QUALIFICATION = `${BASE_URL}ats/create/skills`;
export const UPDATE_SKILL_QUALIFICATION = `${BASE_URL}ats/update/skills`;
export const GET_SKILL_QUALIFICATION = `${BASE_URL}ats/get-all/skills`;
export const GET_SKILL_QUALIFICATION_BY_ID = (id: string) =>
  `${BASE_URL}ats/skills/${id}`;
export const DELETE_SKILL_QUALIFICATION_BY_ID = (id: string) =>
  `${BASE_URL}ats/skills/${id}`;
//employment
export const GET_EMPLOYMENT_LIST = `${BASE_URL}company/get-all/setting/employement-type`;
//Department
export const GET_DEPARTMENTS_LIST = `${BASE_URL}company/get-all/setting/department`;
