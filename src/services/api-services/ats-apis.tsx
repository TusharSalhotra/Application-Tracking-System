import {
  findCandidate,
  findJob,
  listResponse,
  mockAnalytics,
  mockCandidates,
  mockJobs,
  mockSettingForms,
  ok,
  success,
} from "services/mockData";

const getStoredApplicants = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("mock-applicants") || "[]");
  } catch {
    return [];
  }
};

export const getApplicantAnalyticsData = async (queryParam?: any) => {
  const query = String(queryParam || "");

  if (query.includes("export=true")) {
    return ok(mockAnalytics.export_path);
  }
  if (query.includes("application_conversion")) {
    return ok(mockAnalytics.application_conversion);
  }
  if (query.includes("retention")) {
    return ok(mockAnalytics.retention_rate);
  }
  if (query.includes("offer")) {
    return ok(mockAnalytics.offer_acceptance);
  }
  if (query.includes("vacant")) {
    return ok({ data: mockAnalytics.vacant_position });
  }

  return ok(mockAnalytics.application_record);
};

export const getDashboardData = async () =>
  ok({
    total_candidate: mockCandidates.length,
    total_jobs: mockJobs.length,
  });

export const getAllCandidates = async () =>
  listResponse([...mockCandidates, ...getStoredApplicants()]);

export const getCandidateDetail = async (id: any) => ok(findCandidate(id));

export const addNewCandidate = async (body?: any) =>
  success({ id: "cand-new", ...body });

export const updateCandidateStatus = async (id?: any, params?: object) =>
  success({ id, ...params });

export const deleteCandidate = async (candidateId: any) =>
  success({ id: candidateId });

export const getInterviewDetail = async (id: any) =>
  ok({
    ...findCandidate(id),
    interview_date: "2026-05-20",
    interview_time: "10:30 AM",
    interview_mode: "Video Call",
    interviewer: "Recruiter A",
    question: "<p>Discuss experience, availability, and certifications.</p>",
  });

export const updateInterviewStatus = async (id: any, body: any) =>
  success({ id, ...body });

export const getJobOfferDetail = async (id: any, jobId: any) =>
  ok({
    ...findCandidate(id),
    ...findJob(jobId),
    id,
    candidate_id: id,
    job_id: jobId,
    status: "offered",
    notes: "Mock offer generated for demo mode.",
    offer_sent_at: "2026-05-12T14:00:00Z",
    offer_expire_at: "2026-06-12T14:00:00Z",
  });

export const updateOfferStatus = async (id: any, body: any) =>
  success({ id, ...body });

export const getOfferDetails = async () =>
  ok({
    ...findCandidate("cand-1003"),
    ...findJob("job-103"),
    logo: "",
    color: "#19a7a5",
    timezone: "America/New_York",
    status: "offered",
    offer_status: "pending",
    offer_expire_at: "2026-06-12T14:00:00Z",
  });

export const acceptRejectOfferLink = async (body: object) => success(body);

export const onBoardApllicationApi = async (body: any) =>
  success({ user_id: "employee-demo", ...body });

export const getJobPostings = async () => listResponse(mockJobs);

export const getJobById = async (jobId: any) => ok(findJob(jobId));

export const addJobPost = async (body?: any) =>
  success({ id: "job-new", ...body });

export const updateJobPost = async (params?: object) => success(params);

export const deleteJobPost = async (jobPostId: any) =>
  success({ id: jobPostId });

export const getJobPosting = async () =>
  ok({
    data: mockJobs,
    logo: "",
    color: "#19a7a5",
  });

export const getJobPostingDetails = async () =>
  ok({
    result: [findJob("job-101")],
    logo: "",
    color: "#19a7a5",
    form: {
      questions: mockSettingForms[0].posting_form.questions,
    },
  });

export const getJobRequest = async (body?: any) =>
  success({ uuid: "cand-applied", ...body });

export const uploadCv = async () =>
  success([
    {
      id: "file-demo",
      file_url: "/mock-assets/demo-resume.pdf",
    },
  ]);

export const getLocation = async () =>
  ok({
    locations: [
      { id: "1", name: "New York Office", short_name: "NYC" },
      { id: "2", name: "Austin Office", short_name: "AUS" },
    ],
  });

export const getRecruiter = async () =>
  ok([
    { id: "rec-1", first_name: "Recruiter", last_name: "A" },
    { id: "rec-2", first_name: "Recruiter", last_name: "B" },
  ]);

export const getFormBuilderApi = async () =>
  ok({
    settingForm: mockSettingForms,
    setting: {
      id: 1,
      link: "/chs-jobs/job-101",
      color_code: "#19a7a5",
      time_period: 30,
    },
    link: "/chs-jobs/job-101",
  });

export const getFormById = async (id: any) =>
  ok(mockSettingForms.find((form) => `${form.id}` === `${id}`) || mockSettingForms[0]);

export const addNewForm = async (body?: any) => success({ id: 2, ...body });

export const addSettingsApi = async (body?: any) => success(body);

export const updateSettingsApi = async (id: number, body: any) =>
  success({ id, ...body });

export const deleteFormBuilderForms = async (id: any) => success({ id });
