import {
  listResponse,
  mockDepartments,
  mockEmploymentTypes,
  mockSkills,
  mockSourceTypes,
  ok,
  success,
} from "services/mockData";

export const createSourceType = async (body?: any) =>
  success({ id: "src-new", ...body });

export const updateSourceType = async (id?: any, body?: any) =>
  success({ id, ...body });

export const getSourceTypes = async () => listResponse(mockSourceTypes);

export const getSourceTypeById = async (id: string) =>
  ok(mockSourceTypes.find((item) => item.id === id) || mockSourceTypes[0]);

export const deleteSourceTypeById = async (id: string) => success({ id });

export const createSkillQualification = async (body?: any) =>
  success({ id: "skill-new", ...body });

export const updateSkillQualification = async (id?: any, body?: any) =>
  success({ id, ...body });

export const getSkillQualifications = async () => listResponse(mockSkills);

export const getSkillQualificationById = async (id: string) =>
  ok(mockSkills.find((item) => item.id === id) || mockSkills[0]);

export const deleteSkillQualificationById = async (id: string) =>
  success({ id });

export const getEmploymentTypeList = async () =>
  ok({ data: mockEmploymentTypes, count: mockEmploymentTypes.length });

export const getDepartments = async () =>
  ok({ data: mockDepartments, count: mockDepartments.length });
