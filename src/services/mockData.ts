export const ok = (data: any, status = 200) => ({
  status,
  data: {
    message: "Mock response",
    data,
  },
});

export const success = (data: any = {}) => ok(data, 201);

export const mockCompany = {
  id: "company-demo",
  language_code: "en",
  date_format: "MM/DD/YYYY",
  locations: [
    {
      id: "1",
      name: "New York Office",
      short_name: "NYC",
      country_code: "US",
      timezone: "America/New_York",
    },
  ],
};

export const mockLocations = [
  mockCompany.locations[0],
  {
    id: "2",
    name: "Austin Office",
    short_name: "AUS",
    country_code: "US",
    timezone: "America/Chicago",
  },
];

export const mockRoles = [
  { id: "role-1", name: "Recruiter", role_name: "Recruiter" },
  { id: "role-2", name: "Hiring Manager", role_name: "Hiring Manager" },
  { id: "role-3", name: "Operations Admin", role_name: "Operations Admin" },
];

export const mockJobs = [
  {
    id: "job-101",
    jobId: "job-101",
    job_title: "Security Supervisor",
    job_department: "Operations",
    job_experience: "3+ years",
    job_job_mode: "On-site",
    job_required_skill: ["Leadership", "Scheduling", "Incident reporting"],
    job_salary_range: "$58,000 - $68,000",
    job_description:
      "<p>Lead daily site operations, coordinate patrol coverage, and support client reporting.</p>",
    job_company_id: "company-demo",
    job_location_id: "1",
    cl_name: "New York Office",
    atsf_is_employee_fields: 0,
    title: "Security Supervisor",
    position: "Security Supervisor",
    department: "Operations",
    jobs_department: "Operations",
    employment_type: "Full Time",
    location_id: "1",
    location: "New York Office",
    recruiter: "Recruiter A",
    status: "active",
    number_opening: 4,
    application_end_date: "2026-06-28",
    setting_form_id: 1,
    description:
      "<p>Lead daily site operations, coordinate patrol coverage, and support client reporting.</p>",
  },
  {
    id: "job-102",
    jobId: "job-102",
    job_title: "Patrol Officer",
    job_department: "Field Services",
    job_experience: "1+ years",
    job_job_mode: "Field",
    job_required_skill: ["Patrol operations", "Customer service", "Reporting"],
    job_salary_range: "$22 - $28 hourly",
    job_description:
      "<p>Perform patrols, incident documentation, and customer-facing site support.</p>",
    job_company_id: "company-demo",
    job_location_id: "2",
    cl_name: "Austin Office",
    atsf_is_employee_fields: 0,
    title: "Patrol Officer",
    position: "Patrol Officer",
    department: "Field Services",
    jobs_department: "Field Services",
    employment_type: "Part Time",
    location_id: "2",
    location: "Austin Office",
    recruiter: "Recruiter B",
    status: "active",
    number_opening: 8,
    application_end_date: "2026-07-12",
    setting_form_id: 1,
    description:
      "<p>Perform patrols, incident documentation, and customer-facing site support.</p>",
  },
  {
    id: "job-103",
    jobId: "job-103",
    job_title: "Dispatcher",
    job_department: "Command Center",
    job_experience: "2+ years",
    job_job_mode: "On-site",
    job_required_skill: ["Dispatch", "Communication", "Call logging"],
    job_salary_range: "$48,000 - $56,000",
    job_description:
      "<p>Monitor calls, coordinate field teams, and keep communication logs current.</p>",
    job_company_id: "company-demo",
    job_location_id: "1",
    cl_name: "New York Office",
    atsf_is_employee_fields: 0,
    title: "Dispatcher",
    position: "Dispatcher",
    department: "Command Center",
    jobs_department: "Command Center",
    employment_type: "Full Time",
    location_id: "1",
    location: "New York Office",
    recruiter: "Recruiter C",
    status: "draft",
    number_opening: 2,
    application_end_date: "2026-06-10",
    setting_form_id: 1,
    description:
      "<p>Monitor calls, coordinate field teams, and keep communication logs current.</p>",
  },
];

export const mockCandidates = [
  {
    id: "cand-1001",
    uuid: "cand-1001",
    jobId: "job-101",
    job_id: "job-101",
    first_name: "Candidate",
    last_name: "One",
    full_name: "Candidate One",
    email: "candidate1@example.test",
    phone: "+1 000 000 0001",
    position: "Security Supervisor",
    source_type: "LinkedIn",
    skills: "Leadership, Scheduling",
    status: "sourced",
    offer_status: "",
    created_at: "2026-05-03",
    resume: "",
  },
  {
    id: "cand-1002",
    uuid: "cand-1002",
    jobId: "job-102",
    job_id: "job-102",
    first_name: "Candidate",
    last_name: "Two",
    full_name: "Candidate Two",
    email: "candidate2@example.test",
    phone: "+1 000 000 0002",
    position: "Patrol Officer",
    source_type: "Referral",
    skills: "Patrol, Reporting",
    status: "interview",
    offer_status: "",
    interview_date: "2026-05-20",
    created_at: "2026-05-06",
    resume: "",
  },
  {
    id: "cand-1003",
    uuid: "cand-1003",
    jobId: "job-103",
    job_id: "job-103",
    first_name: "Candidate",
    last_name: "Three",
    full_name: "Candidate Three",
    email: "candidate3@example.test",
    phone: "+1 000 000 0003",
    position: "Dispatcher",
    source_type: "Indeed",
    skills: "Dispatch, Communication",
    status: "offered",
    offer_status: "accepted",
    created_at: "2026-05-09",
    resume: "",
  },
  {
    id: "cand-1004",
    uuid: "cand-1004",
    jobId: "job-101",
    job_id: "job-101",
    first_name: "Candidate",
    last_name: "Four",
    full_name: "Candidate Four",
    email: "candidate4@example.test",
    phone: "+1 000 000 0004",
    position: "Security Supervisor",
    source_type: "Website",
    skills: "Supervision, Compliance",
    status: "onboarding",
    offer_status: "accepted",
    created_at: "2026-05-11",
    resume: "",
  },
];

export const mockSourceTypes = [
  { id: "src-1", name: "LinkedIn", type: "Online", status: "active" },
  { id: "src-2", name: "Referral", type: "Internal", status: "active" },
  { id: "src-3", name: "Indeed", type: "Online", status: "active" },
];

export const mockSkills = [
  { id: "skill-1", name: "Customer Service", type: "Soft Skill", status: "active" },
  { id: "skill-2", name: "Patrol Operations", type: "Security", status: "active" },
  { id: "skill-3", name: "Dispatch", type: "Operations", status: "active" },
];

export const mockDepartments = [
  { id: "dept-1", name: "Operations" },
  { id: "dept-2", name: "Field Services" },
  { id: "dept-3", name: "Command Center" },
];

export const mockEmploymentTypes = [
  { id: "emp-1", name: "Full Time" },
  { id: "emp-2", name: "Part Time" },
  { id: "emp-3", name: "Contract" },
];

export const mockBeats = [
  { id: "beat-1", beat_name: "Downtown Patrol", site_name: "City Center" },
  { id: "beat-2", beat_name: "North Gate", site_name: "Corporate Campus" },
];

export const mockSites = [
  { id: "site-1", siteName: "City Center", site_name: "City Center" },
  { id: "site-2", siteName: "Corporate Campus", site_name: "Corporate Campus" },
];

export const mockSettingForms = [
  {
    id: 1,
    name: "Default Candidate Form",
    is_employee_fields: false,
    posting_form: {
      questions: [
        {
          id: "first-name",
          element: "TextInput",
          text: "Text Input",
          label: "First Name",
          field_name: "first_name",
          required: true,
        },
        {
          id: "last-name",
          element: "TextInput",
          text: "Text Input",
          label: "Last Name",
          field_name: "last_name",
          required: true,
        },
        {
          id: "email",
          element: "EmailInput",
          text: "Email",
          label: "Email",
          field_name: "email",
          required: true,
        },
        {
          id: "primary-phone",
          element: "NumberInput",
          text: "Number",
          label: "Phone Number (Primary)",
          field_name: "phone_number_primary",
          required: true,
        },
        {
          id: "birth-date",
          element: "DatePicker",
          text: "Date Field",
          label: "Date of Birth",
          field_name: "date_of_birth",
          required: true,
        },
        {
          id: "branches",
          element: "Dropdown",
          text: "Dropdown",
          label: "Branches",
          field_name: "branches",
          required: true,
          options: [],
        },
        {
          id: "street-address",
          element: "TextInput",
          text: "Text Input",
          label: "Street Address",
          field_name: "street_address",
          required: true,
        },
        {
          id: "city",
          element: "TextInput",
          text: "Text Input",
          label: "City",
          field_name: "city",
          required: true,
        },
        {
          id: "state",
          element: "Dropdown",
          text: "Dropdown",
          label: "State",
          field_name: "state",
          required: true,
          options: [
            { text: "New York", value: "NY" },
            { text: "Texas", value: "TX" },
            { text: "California", value: "CA" },
          ],
        },
        {
          id: "zip-code",
          element: "TextInput",
          text: "Text Input",
          label: "Zip Code",
          field_name: "zip_code",
          required: true,
        },
        {
          id: "country",
          element: "Dropdown",
          text: "Dropdown",
          label: "Country",
          field_name: "country",
          required: true,
          options: [],
        },
        {
          id: "work-authorization",
          element: "RadioButtons",
          text: "Radio Group",
          label: "Are you authorized to work in the United States?",
          field_name: "work_authorization",
          required: true,
          options: [
            { text: "Yes", value: "yes" },
            { text: "No", value: "no" },
          ],
        },
        {
          id: "years-experience",
          element: "NumberInput",
          text: "Number",
          label: "Years of Relevant Experience",
          field_name: "years_experience",
          required: false,
        },
        {
          id: "preferred-shift",
          element: "Dropdown",
          text: "Dropdown",
          label: "Preferred Shift",
          field_name: "preferred_shift",
          required: false,
          options: [
            { text: "Day Shift", value: "day_shift" },
            { text: "Evening Shift", value: "evening_shift" },
            { text: "Night Shift", value: "night_shift" },
            { text: "Flexible", value: "flexible" },
          ],
        },
        {
          id: "available-start-date",
          element: "DatePicker",
          text: "Date Field",
          label: "Available Start Date",
          field_name: "available_start_date",
          required: false,
        },
        {
          id: "has-security-license",
          element: "RadioButtons",
          text: "Radio Group",
          label: "Do you currently hold a valid security license?",
          field_name: "has_security_license",
          required: false,
          options: [
            { text: "Yes", value: "yes" },
            { text: "No", value: "no" },
            { text: "In progress", value: "in_progress" },
          ],
        },
        {
          id: "certifications",
          element: "TextArea",
          text: "Text Area",
          label: "Relevant Certifications",
          field_name: "certifications",
          required: false,
        },
        {
          id: "referral-source",
          element: "Dropdown",
          text: "Dropdown",
          label: "How did you hear about this role?",
          field_name: "referral_source",
          required: false,
          options: [
            { text: "Company Website", value: "company_website" },
            { text: "LinkedIn", value: "linkedin" },
            { text: "Indeed", value: "indeed" },
            { text: "Employee Referral", value: "employee_referral" },
            { text: "Other", value: "other" },
          ],
        },
        {
          id: "resume",
          element: "FileUpload",
          text: "File Upload",
          label: "Resume / CV",
          field_name: "resume",
          required: false,
        },
        {
          id: "cover-letter",
          element: "TextArea",
          text: "Text Area",
          label: "Why are you interested in this role?",
          field_name: "cover_letter",
          required: false,
        },
      ],
    },
  },
];

export const mockGridColumns = [
  { title: "First Name", dataIndex: "first_name", key: "first_name", default: true, group_by: "sourced" },
  { title: "Last Name", dataIndex: "last_name", key: "last_name", default: true, group_by: "sourced" },
  { title: "Email", dataIndex: "email", key: "email", default: true, group_by: "sourced" },
  { title: "Phone", dataIndex: "phone", key: "phone", default: true, group_by: "sourced" },
  { title: "Position", dataIndex: "position", key: "position", default: true, group_by: "sourced" },
  { title: "Status", dataIndex: "status", key: "status", default: true, group_by: "sourced" },
  { title: "Job Title", dataIndex: "job_title", key: "job_title", default: true, group_by: "job" },
  { title: "Department", dataIndex: "department", key: "department", default: true, group_by: "job" },
  { title: "Employment Type", dataIndex: "employment_type", key: "employment_type", default: true, group_by: "job" },
  { title: "Openings", dataIndex: "number_opening", key: "number_opening", default: true, group_by: "job" },
  { title: "Source Type", dataIndex: "name", key: "name", default: true, group_by: "source_type" },
  { title: "Skill", dataIndex: "name", key: "name", default: true, group_by: "skills" },
];

export const mockFormFields = {
  grid: { column: mockGridColumns },
  form: [
    {
      name: "Job Details",
      key: "job_details",
      fields: [
        { id: "job_title", key: "job_title", name: "Job Title", type: "text", span: 12, validations: [{ type: "required", message: "Job title is required" }] },
        { id: "department", key: "department", name: "Department", type: "select", span: 12, options: mockDepartments },
        { id: "employment_type", key: "employment_type", name: "Employment Type", type: "select", span: 12, options: mockEmploymentTypes },
        { id: "number_opening", key: "number_opening", name: "Openings", type: "number", span: 12 },
        { id: "application_end_date", key: "application_end_date", name: "Application End Date", type: "date", span: 12 },
        { id: "description", key: "description", name: "Description", type: "textarea", span: 24 },
      ],
    },
  ],
};

export const mockAnalytics = {
  application_record: [
    { label: "Sourced", count: 28 },
    { label: "Interview", count: 12 },
    { label: "Offered", count: 7 },
    { label: "Onboarding", count: 4 },
  ],
  application_conversion: {
    total_candidates: 51,
    sourced_candidates: 28,
    converted_candidates: 19,
    conversion_rate: 37,
  },
  retention_rate: {
    total_candidates: 51,
    retained_candidates: 39,
    retention_rate: 76,
  },
  offer_acceptance: {
    total_candidates: 12,
    accepted_candidates: 9,
    rejected_candidates: 3,
    offer_accept_rate: 75,
    offer_reject_rate: 25,
  },
  vacant_position: [
    { jobs_department: "Operations", count: 4 },
    { jobs_department: "Field Services", count: 8 },
    { jobs_department: "Command Center", count: 2 },
  ],
  export_path: "/mock-export.csv",
};

export function listResponse(items: any[]) {
  return ok({ data: items, count: items.length });
}

export function findCandidate(id?: any) {
  return mockCandidates.find((candidate) => candidate.id === id) || mockCandidates[0];
}

export function findJob(id?: any) {
  return mockJobs.find((job) => job.id === id || job.jobId === id) || mockJobs[0];
}
