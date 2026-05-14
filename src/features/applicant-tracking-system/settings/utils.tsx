export const jobData = [
  {
    title: "Pool Watch",
    job: "Pool Watch",
    empType: "Full-time",
    address: "9320 Willowgrove Ave",
    state: "Riverside, CA",
    city: "Santee, CA",
    experience: "4 Years",
  },
  {
    title: "Fire Watch",
    job: "Fire Watch",
    empType: "Full-time",
    address: "8906 Riverside",
    state: "Riverside, CA",
    city: "Santee, CA",
    experience: "8 Years",
  },
];
export const Form = [
  {
    id: "1",
    name: "Form-1",
    fields: [
      { id: "field1", label: "First Name", type: "text", required: true },
      { id: "field2", label: "Last Name", type: "text", required: true },
      { id: "field3", label: "Email", type: "email", required: true },
    ],
  },
  {
    id: "2",
    name: "Form-2",
    fields: [
      { id: "field1", label: "Full Name", type: "text", required: true },
      { id: "field2", label: "Phone Number", type: "number", required: true },
      { id: "field3", label: "Portfolio Link", type: "url", required: false },
    ],
  },
  {
    id: "3",
    name: "Form-3",
    fields: [
      { id: "field1", label: "Name", type: "text", required: true },
      {
        id: "field2",
        label: "Experience (in years)",
        type: "number",
        required: true,
      },
      { id: "field3", label: "Expected Salary", type: "text", required: false },
    ],
  },
];
