// @ts-nocheck
// utils.tsx
import React, { Suspense } from "react";
import { TabsProps, DatePicker, Input } from "antd";

const Sourced = React.lazy(() => import("./applicant"));
const JobOffers = React.lazy(() => import("./job-offers"));
const Interviews = React.lazy(() => import("./interviews"));
const Screened = React.lazy(() => import("./screened"));
const OnBoarding = React.lazy(() => import("./onboarding"));
const Blacklisted = React.lazy(() => import("./rejected-blacklisted"));
const Archived = React.lazy(() => import("./archived"));

import { FileUploadForm } from "reference/FileUploadForm";
import { TextEditor } from "../../text-editor/editor";
import { Field } from "utils/types";
import {
  BaseButton,
  BaseButtonsForm,
  BaseCol,
  BaseInputBox,
  SelectBox,
} from "@deepak-pahwa/citywide-commonmodules";
import {
  deleteCandidate,
  updateCandidateStatus,
} from "services/api-services/ats-apis";

import { locationId } from "utils/common-function";
import { Errornotify, Successnotify } from "utils/notification";
import Swal from "sweetalert2";
import { CITY_V2 } from "services/api-services/constants";
import PhoneInput from "react-phone-input-2";
import Loader from "components/loader";
import moment from "moment";
const LoadingFallback = () => <Loader />;

export function getTabItems(
  sourcedProps?: any,
  screenedProps?: any,
  interviewsProps?: any,
  job_offersProps?: any,
  onboardingProps?: any,
  rejected_blacklistedProps?: any,
  archived?: any
): TabsProps["items"] {
  return [
    {
      key: "sourced",
      label: "Applicants",
      children: (
        <Suspense fallback={<Loader />}>
          <Sourced {...sourcedProps} />
        </Suspense>
      ),
    },
    {
      key: "screened",
      label: "Screened",
      children: (
        <Suspense fallback={<LoadingFallback />}>
          <Screened {...screenedProps} />
        </Suspense>
      ),
    },
    {
      key: "schedule-interview",
      label: "Interviews",
      children: (
        <Suspense fallback={<LoadingFallback />}>
          <Interviews {...interviewsProps} />
        </Suspense>
      ),
    },
    {
      key: "offered",
      label: "Job Offers",
      children: (
        <Suspense fallback={<LoadingFallback />}>
          <JobOffers {...job_offersProps} />
        </Suspense>
      ),
    },
    {
      key: "on-board",
      label: "OnBoarding",
      children: (
        <Suspense fallback={<LoadingFallback />}>
          <OnBoarding {...onboardingProps} />
        </Suspense>
      ),
    },
    {
      key: "rejected",
      label: "Rejected/Blacklisted",
      children: (
        <Suspense fallback={<Loader />}>
          <Blacklisted {...rejected_blacklistedProps} />
        </Suspense>
      ),
    },
    {
      key: "archived",
      label: "Archived",
      children: (
        <Suspense fallback={<Loader />}>
          <Archived {...archived} />
        </Suspense>
      ),
    },
  ];
}
export interface CandidateInfoProps {
  candidate: any;
  simplifiedData: any[];
  offer?: any;
  showHeading?: boolean;
}

export const statusValues = [
  { label: "Offered", value: "offered" },
  { label: "Accepted", value: "accepted" },
  { label: "Not Accepted", value: "rejected" },
];
export const statusVal = [
  { label: "Re-Offered", value: "offered" },
  { label: "Accepted", value: "accepted" },
  { label: "Not Accepted", value: "rejected" },
];
export const interviewStatuses = [
  { label: "Pending", value: "scheduled" },
  { label: "Cleared", value: "cleared" },
  { label: "Not Cleared", value: "not-cleared" },
];
export const timeSlots = [
  "15 Minutes",
  "30 Minutes",
  "45 Minutes",
  "60 Minutes",
];
export const status_colors = {
  sourced: "status-sourced",
  screened: "status-screened",
  interview: "status-interview",
  onboarding: "status-onboarding",
  offered: "status-offer",
  "re-offered": "re-offered",
  "on-board": "on-board",
  "re-scheduled": "re-scheduled",
  blacklisted: "status-blacklisted",
  rejected: "status-rejected",
  scheduled: "status-scheduled",
  accepted: "status-accepted",
  cleared: "status-cleared",
  "not-cleared": "not-cleared",
  pending: "status-pending",
  employed: "status-employed",
};
export const interviewmode = [
  { label: "Walk In", value: "offline" },
  { label: "Online", value: "online" },
];
export const meeting_mode = [
  // { label: "Google Meet", value: "google" },
  { label: "Zoom Meet", value: "zoom" },
];
//interview status enums
export enum CandidateStatus {
  NOT_CLEARED = "not-cleared",
  SCHEDULED = "scheduled",
  RE_SCHEDULED = "re-scheduled",
  CLEARED = "cleared",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  RE_OFFERED = "re-offered",
}
//form to schedule interview form
export const renderInput = (
  field: Field,
  onChange?: (data: any) => void,
  languageCode?: any,
  isEditAgent?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
) => (
  <BaseButtonsForm.Item
    label={field.name}
    key={field.key}
    name={field.key}
    rules={field?.validations?.map((item: any) => {
      if (item?.type === "required") {
        item = {
          whitespace: true,
          required: true,
          message: item?.message,
        };
      } else if (item?.type === "max Length") {
        item = {
          max: Number(parseFloat(item.validation_value)),
          message: item?.message,
        };
      }
      return item;
    })}
    className={`floating-label-input ${
      isValueFilled(field?.key) || focused === field?.id ? "focused " : ""
    }`}
  >
    <BaseInputBox
      onBlur={(e) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      disabled={field?.is_disable}
      onFocus={() => setFocused(field?.id)}
      onChange={onChange}
      // placeholder={field?.name}
    />
  </BaseButtonsForm.Item>
);
export const renderTextArea = (
  field: Field,
  onChange?: (data: any) => void,
  languageCode?: any,
  isEditAgent?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field?.name}
    name={field.key}
    rules={
      field.validations &&
      field.validations.map((rule: any) => {
        if (rule?.type === "maxLength") {
          return {
            max: Number(parseInt(rule.validation_value)),
            message: rule?.message,
          };
        }
        return rule;
      })
    }
    className={`floating-label-input  ${
      isValueFilled(field?.key) || focused === field?.id ? "focused " : ""
    }`}
  >
    {" "}
    <Input.TextArea
      placeholder={field?.name}
      className="w-full"
      onChange={onChange}
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field?.id)}
    />
  </BaseButtonsForm.Item>
);

export const renderSelect = (
  field: Field,
  onChange?: (data: any) => void,
  globleCodes?: any,
  activityCode?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any,
  location?: any,
  recruiter?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field?.name}
    name={field.key}
    rules={field?.validations?.map((item: any) => {
      if (item?.type === "required") {
        item = {
          ...item,
          whitespace: true,
          required: true,
          message: item?.message,
        };
      }
      return item;
    })}
    className={`floating-label-input siteSelect ${
      isValueFilled(field?.key) || focused === field?.id ? "focused " : ""
    }`}
  >
    {field?.is_multiple ? (
      <SelectBox
        mode="multiple"
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        style={{
          width: "100%",
          margin: 0,
          padding: 0,
        }}
        onFocus={() => setFocused(field?.id)}
      >
        {globleCodes ? (
          globleCodes[field.category]?.map((opt: any) => {
            return (
              <SelectBox.Option
                key={opt?.labels || ""}
                value={opt?.value || ""}
              >
                {opt?.value || ""}
              </SelectBox.Option>
            );
          })
        ) : (
          <SelectBox.Option key={"Select"} value={"select"}>
            Select
          </SelectBox.Option>
        )}
      </SelectBox>
    ) : (
      <SelectBox
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        style={{
          width: "100%",
          margin: 0,
          padding: 0,
        }}
        onFocus={() => setFocused(field?.id)}
      >
        <SelectBox.Option key={"Select"} value={"select"}>
          Select
        </SelectBox.Option>
      </SelectBox>
    )}
  </BaseButtonsForm.Item>
);

export const renderEmailInput = (
  field: Field,
  onChange?: (data: any) => void,
  languageCode?: any,
  isEditAgent?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
) => (
  <BaseButtonsForm.Item
    label={field.name}
    key={field.key}
    name={field.key}
    rules={[
      { type: "email", message: "Please enter a valid email address!" },
      ...(field?.validations?.map((item: any) => {
        if (item.type === "required") {
          return { required: true, message: item?.message };
        }
        return item;
      }) || []),
    ]}
    className={`floating-label-input ${
      isValueFilled(field.key) || focused === field.id ? "focused " : ""
    }`}
  >
    <BaseInputBox
      onBlur={(e) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field.id)}
      onChange={onChange}
      type="email"
      placeholder="Enter your email"
    />
  </BaseButtonsForm.Item>
);

export const renderButton = (
  field: Field,
  type?: string,
  languageCode?: any,
  isEditAgent?: any
) => (
  <BaseButton
    type="link"
    size="middle"
    style={{
      fontSize: "15px",
    }}
    icon={"+"}
  >
    {field?.name}
  </BaseButton>
);

export const PhoneNumberInput = (
  field: Field,
  onChangePhone?: (data: any) => {}
) => {
  return (
    <BaseButtonsForm.Item
      id={field.key}
      label={field.name}
      key={field.key}
      name={field.key}
      rules={field.validations?.map((item: any) => {
        if (item?.type === "required") {
          return {
            ...item,
            required: true,
            message: item?.message,
          };
        }
        if (item?.type === "maxLength") {
          return {
            ...item,
            max: parseInt(item?.validation_value),
            message: item?.message,
          };
        }
        if (item?.type === "minLength") {
          return {
            ...item,
            validator: async (_, value: any) => {
              if (
                value &&
                value.length > 2 &&
                value.replace(/\D/g, "").length <
                  parseInt(item.validation_value)
              ) {
                return Promise.reject(
                  `Phone number must be at least ${parseInt(
                    item.validation_value
                  )} digits long.`
                );
              }
              return Promise.resolve();
            },
          };
        }
      })}
      className={`floating-label-input global-input-box ${
        true ? "focused " : ""
      }`}
    >
      <PhoneInput
        onChange={(...args: any) =>
          onChangePhone && onChangePhone(args, field.key)
        }
        disabled={field?.is_edit === false}
        countryCodeEditable={false}
        country={"us"}
      />
    </BaseButtonsForm.Item>
  );
};

export const renderForm = (fieldprops: {
  field: any;
  onChange: any;
  handleSearch: any;
  globleCodes: any;
  languageCode: any;
  isEditAgent: any;
  activityCode: any;
  focused: any;
  setFocused: any;
  isValueFilled: any;
  handleEditor: any;
  editorData: any;
  onSelectFiles: any;
  onChangePhone?: any;
  open: boolean;
}) => {
  const {
    field,
    onChange,
    globleCodes,
    languageCode,
    isEditAgent,
    activityCode,
    focused,
    setFocused,
    isValueFilled,
    handleEditor,
    editorData,
    onSelectFiles,
    onChangePhone,
    open,
  } = fieldprops;

  switch (field.type) {
    case "text":
      return (
        <BaseCol lg={12} md={12} xs={24}>
          {renderInput(
            field,
            onChange,
            languageCode,
            isEditAgent,
            focused,
            setFocused,
            isValueFilled
          )}
        </BaseCol>
      );
    case "email":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {renderEmailInput(
            field,
            onChange,
            languageCode,
            isEditAgent,
            focused,
            setFocused,
            isValueFilled
          )}
        </BaseCol>
      );

    case "select":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {renderSelect(
            field,
            onChange,
            globleCodes,
            activityCode,
            focused,
            setFocused,
            isValueFilled
          )}
        </BaseCol>
      );

    case "textarea":
      return field.key === "message" ? (
        <BaseCol xl={24} lg={24} md={24} xs={24}>
          <TextEditor
            field={field}
            onChange={handleEditor}
            editorData={editorData}
            languageCode={languageCode}
            isEditAgent={isEditAgent}
            focused={focused}
            setFocused={setFocused}
            isValueFilled={isValueFilled}
          />
        </BaseCol>
      ) : (
        <BaseCol xl={12} lg={12} md={12} xs={24}>
          {renderTextArea(
            field,
            onChange,
            languageCode,
            isEditAgent,
            focused,
            setFocused,
            isValueFilled
          )}
        </BaseCol>
      );

    case "date":
      return (
        <BaseCol
          xl={field.key === "offer_expire_at" ? 24 : 12}
          lg={12}
          md={12}
          xs={24}
        >
          {renderDatePicker(field, focused, setFocused, isValueFilled)}
        </BaseCol>
      );

    case "phone":
      return (
        <BaseCol span={field?.span} xxl={6} xl={8} lg={8} md={12} xs={24}>
          {PhoneNumberInput(field, onChangePhone)}
        </BaseCol>
      );
    case "file":
      return (
        <BaseCol span={24}>
          <FileUploadForm
            field={field}
            onChange={onChange}
            onSelectFiles={onSelectFiles}
            open={open}
          />
        </BaseCol>
      );
    case "submit":
      return (
        <BaseCol span={8}>
          {renderButton(field, "default", languageCode, isEditAgent)}
        </BaseCol>
      );

    default:
      return null;
  }
};

export const drower = {
  message: "Success",
  statusCode: 200,
  data: {
    name: "Add New Course",
    form: [
      {
        id: 85,
        name: "Add Job Posting",
        is_multiple: false,
        key: "basic_information",
        fields: [
          {
            id: 465,
            type: "select",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "12",
            is_default: true,
            placeholder: "Select Time",
            name: "Select Time",
            key: "time",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "Interview time field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 466,
            type: "select",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "12",
            is_default: true,
            placeholder: "Mode",
            name: "Mode",
            key: "mode",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "The Interview mode field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },

          {
            id: 470,
            type: "text",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "12",
            is_default: true,
            placeholder: "Interviewer Name",
            name: "Interviewer Name",
            key: "interviewer",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: " Interviewer is required",
                validation_value: null,
                type: "required",
              },
            ],
          },
        ],
      },
    ],
    actions: [
      {
        path: "admin/course/add",
        title: "Add New Course",
        type: "submit",
      },
    ],
  },
  err: [],
};

export const sendOffer = {
  form: [
    {
      id: 1,
      name: "Send Offer",
      is_multiple: false,
      key: "send_offer",
      fields: [
        {
          id: 466,
          type: "text",
          category: null,
          is_disable: true,
          is_multiple: false,
          url: null,
          options: null,
          group_by: null,
          sub_group_by: null,
          order_by: null,
          span: "12",
          is_default: true,
          placeholder: "Enter applicant name",
          name: "Applicant Name",
          key: "candidate_name",
          selected_check: null,
          is_delete: true,
          is_view: true,
          is_create: true,
          is_edit: true,
          validations: [
            {
              message: "Applicant name is required.",
              validation_value: null,
              type: "required",
            },
          ],
        },
        {
          id: 467,
          type: "text",
          category: null,
          is_disable: true,
          is_multiple: false,
          url: null,
          options: null,
          group_by: null,
          sub_group_by: null,
          order_by: null,
          span: "12",
          is_default: true,
          placeholder: "Enter applicant email",
          name: "Applicant Email",
          key: "candidate_email",
          selected_check: null,
          is_delete: true,
          is_view: true,
          is_create: true,
          is_edit: true,
          validations: [
            {
              message: "Applicant email is required.",
              validation_value: null,
              type: "required",
            },
            {
              message: "Please enter a valid email address.",
              validation_value: null,
              type: "email",
            },
          ],
        },
        {
          id: 470,
          type: "date",
          category: null,
          is_disable: false,
          is_multiple: false,
          url: null,
          options: null,
          group_by: null,
          sub_group_by: null,
          order_by: null,
          span: "12",
          is_default: true,
          placeholder: "Enter offer expire date",
          name: "Offer Expire Date",
          key: "offer_expire_date",
          selected_check: null,
          is_delete: true,
          is_view: true,
          is_create: true,
          is_edit: true,
          validations: [
            {
              message: "Offer expire date is required.",
              validation_value: null,
              type: "required",
            },
          ],
        },
        {
          id: 468,
          type: "text",
          category: null,
          is_disable: false,
          is_multiple: false,
          url: null,
          options: null,
          group_by: null,
          sub_group_by: null,
          order_by: null,
          span: "24",
          is_default: true,
          placeholder: "Enter Subject",
          name: "Subject",
          key: "subject",
          selected_check: null,
          is_delete: true,
          is_view: true,
          is_create: true,
          is_edit: true,
          validations: [
            {
              message: "Subject field is required.",
              validation_value: null,
              type: "required",
            },
          ],
        },
        {
          id: 469,
          type: "textarea",
          category: null,
          is_disable: false,
          is_multiple: false,
          url: null,
          options: null,
          group_by: null,
          sub_group_by: null,
          order_by: null,
          span: "24",
          is_default: true,
          placeholder: "Enter Notes",
          name: "Notes",
          key: "message",
          selected_check: null,
          is_delete: true,
          is_view: true,
          is_create: true,
          is_edit: true,
          validations: [
            {
              message: "Notes field is required",
              validation_value: null,
              type: "required",
            },
          ],
        },
        {
          id: 471,
          type: "file",
          category: null,
          is_disable: false,
          is_multiple: false,
          url: null,
          options: null,
          group_by: null,
          sub_group_by: null,
          order_by: null,
          span: "24",
          is_default: true,
          placeholder: "Enter Notes",
          name: "Notes",
          key: "file",
          selected_check: null,
          is_delete: true,
          is_view: true,
          is_create: true,
          is_edit: true,
          validations: [
            {
              message: "This field is required",
              validation_value: null,
              type: "required",
            },
          ],
        },
      ],
    },
  ],
};

export const renderDatePicker = (
  field: Field,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
) => (
  <BaseButtonsForm.Item
    key={field?.key}
    name={field?.key}
    label={field?.name}
    // rules={field?.validations?.map((item: any) => {
    //   if (item?.required) {
    //     return {
    //       ...item,
    //       message: item?.message,
    //     };
    //   }
    // })}
    className={`floating-label-input siteSelect ${
      isValueFilled(field?.key) || focused === field?.id ? "focused " : ""
    }`}
    rules={field?.validations?.map((item: any) => {
      if (item?.type === "required") {
        return {
          ...item,
          required: true,
          message: item?.message,
        };
      }
    })}
  >
    <DatePicker
      disabledDate={(current) => {
        let customDate = moment().format("MM/DD/YYYY");
        return current && current < moment(customDate, "MM/DD/YYYY");
      }}
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field?.id)}
      format={"MM/DD/YYYY"}
    />
  </BaseButtonsForm.Item>
);

export const submitInterviewDetails = async (
  value: any,
  setLoader: any,
  candidateDetail: any,
  companyDetails: any,
  setOpen: any,
  fetchCandidateData?: any,
  interviewStatus?: any,
  id?: any,
  BaseFormMethod?: any
) => {
  setLoader(true);
  try {
    const obj = {
      ...value,
      status: interviewStatus,
      company_id: companyDetails?.id,
      location_id: locationId,
    };
    const response = await updateCandidateStatus(
      candidateDetail?.id,
      obj
    ).finally(() => {
      setLoader(false);
    });
    if (response?.status === 201 || response?.status === 200) {
      Successnotify(
        `${
          interviewStatus === "re-schedule-interview"
            ? "Interview reschedule successfully"
            : "Interview schedule successfully"
        }`
      );
      if (id) {
        window.location.href = `${CITY_V2}admin/ats/interview-detail/${id}`;
      }
      setOpen(false);
      fetchCandidateData();
    } else {
      response?.data?.err?.errorMessage?.forEach((msg: any) => {
        Errornotify(msg?.message || "Something went wrong!");
      });
      BaseFormMethod.resetFields();
    }
  } catch (error) {
    // Errornotify("Something went wrong!");
  }
};

export const handleDeleteCandidate = async (
  candidateId?: any,
  fetchCandidateDetail?: any,
  setLoader?: (data: boolean) => void,
  setIsModalOpen?: (data: boolean) => void
) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action will archive this applicant",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    reverseButtons: false,
    customClass: {
      cancelButton: "red-cancel-button",
    },
  });
  if (result.isConfirmed) {
    if (setLoader) {
      setLoader(true);
    }
    const res: any = await deleteCandidate(candidateId).finally(() => {
      if (setLoader) {
        setLoader(false);
      }
      if (setIsModalOpen) {
        setIsModalOpen(false);
      }
    });
    if (res?.status === 201 || res?.status === 200) {
      fetchCandidateDetail();
      Successnotify("Applicant archived successfully");
    } else {
      Errornotify("Something went wrong!");
    }
  }
};
export const employeeOnboard = [
  {
    id: 2,
    type: "text",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 1,
    span: "6",
    is_default: true,
    placeholder: "First Name",
    name: "First Name",
    key: "first_name",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "First Name field is required.",
        validation_value: null,
        type: "required",
      },
      {
        message: "Maximum limit for first name is 50.",
        validation_value: "50",
        type: "maxLength",
      },
    ],
  },
  {
    id: 4,
    type: "text",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 3,
    span: "6",
    is_default: true,
    placeholder: "Last Name",
    name: "Last Name",
    key: "last_name",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Last Name field is required.",
        validation_value: null,
        type: "required",
      },
      {
        message: "Maximum limit for last name is 50.",
        validation_value: "50",
        type: "maxLength",
      },
    ],
  },
  {
    id: 43,
    type: "text",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "",
    order_by: 10,
    span: "8",
    is_default: true,
    placeholder: "Employee Id",
    name: "Employee ID",
    key: "badge_number",
    selected_check: "0",
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Employee ID field is required.",
        validation_value: null,
        type: "required",
      },
      {
        message: "Badge Number field must not be greater than 8 characters.",
        validation_value: "8",
        type: "maxLength",
      },
      {
        message: "Badge Number field should be alphanumeric",
        validation_value: "/^[a-zA-Z0-9#]+$/",
        type: "pattern",
      },
    ],
  },
  {
    id: 5,
    type: "email",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 9,
    span: "6",
    is_default: true,
    placeholder: "Email (Primary)",
    name: "Email (Primary)",
    key: "email",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Email (Primary) field is required.",
        validation_value: null,
        type: "required",
      },
      {
        message: "Please enter a valid email.",
        validation_value: null,
        type: "email",
      },
    ],
  },
  {
    id: 6,
    type: "date",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 5,
    span: "6",
    is_default: true,
    placeholder: "dd/mm/yyyy",
    name: "Birth Date",
    key: "birthdate",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Birth Date field is required.",
        validation_value: null,
        type: "required",
      },
    ],
  },
  {
    id: 7,
    type: "select",
    category: "gender",
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 4,
    span: "6",
    is_default: true,
    placeholder: "Gender",
    name: "Gender",
    key: "gender",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Please select gender",
        validation_value: null,
        type: "required",
      },
    ],
  },
  // {
  //     "id": 22,
  //     "type": "text",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "residence_address",
  //     "sub_group_by": null,
  //     "order_by": 1,
  //     "span": "12",
  //     "is_default": true,
  //     "placeholder": "Street #",
  //     "name": "Street #",
  //     "key": "residence_street_address_1",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Maximum limit for street address is 252.",
  //             "validation_value": "252",
  //             "type": "maxLength"
  //         },
  //         {
  //             "message": "Street field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  // {
  //     "id": 23,
  //     "type": "text",
  //     "category": "NULL",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": "NULL",
  //     "options": null,
  //     "group_by": "residence_address",
  //     "sub_group_by": null,
  //     "order_by": 2,
  //     "span": "12",
  //     "is_default": true,
  //     "placeholder": "Street Name",
  //     "name": "Street Name",
  //     "key": "residence_street_address_2",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Street Name field is required.",
  //             "validation_value": null,
  //             "type": "required"
  //         }
  //     ]
  // },
  {
    id: 24,
    type: "text",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "residence_address",
    sub_group_by: null,
    order_by: 3,
    span: "6",
    is_default: true,
    placeholder: "City",
    name: "City",
    key: "residence_city",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Maximum length for city is 28.",
        validation_value: "28",
        type: "maxLength",
      },
      {
        message: "City field is required.",
        validation_value: "",
        type: "required",
      },
    ],
  },
  {
    id: 25,
    type: "api",
    category: "state",
    is_disable: false,
    is_multiple: false,
    url: "/user/states",
    options: null,
    group_by: "residence_address",
    sub_group_by: null,
    order_by: 4,
    span: "6",
    is_default: true,
    placeholder: "State",
    name: "State",
    key: "residence_state",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "State field is required.",
        validation_value: "",
        type: "required",
      },
    ],
  },
  // {
  //     "id": 26,
  //     "type": "text",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 1,
  //     "span": "12",
  //     "is_default": true,
  //     "placeholder": "Street #",
  //     "name": "Street #",
  //     "key": "mailing_street_address_1",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Maximum limit for address is 252.",
  //             "validation_value": "252",
  //             "type": "maxLength"
  //         },
  //         {
  //             "message": "Street field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  // {
  //     "id": 27,
  //     "type": "text",
  //     "category": "NULL",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": "",
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 2,
  //     "span": "12",
  //     "is_default": true,
  //     "placeholder": "Street Name",
  //     "name": "Street Name",
  //     "key": "mailing_street_address_2",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Street Name field is required.",
  //             "validation_value": null,
  //             "type": "required"
  //         }
  //     ]
  // },
  // {
  //     "id": 28,
  //     "type": "text",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 3,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "City",
  //     "name": "City",
  //     "key": "mailing_city",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Maximum limit for city is 28.",
  //             "validation_value": "28",
  //             "type": "maxLength"
  //         },
  //         {
  //             "message": "City field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  // {
  //     "id": 29,
  //     "type": "api",
  //     "category": "state",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": "/user/states",
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 4,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "State",
  //     "name": "State",
  //     "key": "mailing_state",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "State field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  // {
  //     "id": 30,
  //     "type": "text",
  //     "category": "NULL",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "personal_information",
  //     "sub_group_by": null,
  //     "order_by": 16,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Emergency Name",
  //     "name": "Emergency Name",
  //     "key": "emergency_contact_name",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Maximum length for name is 50.",
  //             "validation_value": "50",
  //             "type": null
  //         }
  //     ]
  // },
  {
    id: 31,
    type: "text",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "residence_address",
    sub_group_by: null,
    order_by: 5,
    span: "6",
    is_default: true,
    placeholder: "Zip Code",
    name: "Zip Code",
    key: "residence_zip_code",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Zip Code maximum length must be of 6 digit.",
        validation_value: "6",
        type: "maxLength",
      },
      {
        message: "Zip Code field is required.",
        validation_value: "",
        type: "required",
      },
    ],
  },
  // {
  //     "id": 32,
  //     "type": "phone",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "personal_information",
  //     "sub_group_by": null,
  //     "order_by": 17,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Emergency Number",
  //     "name": "Emergency Number",
  //     "key": "emergency_contact_number",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Contact Number field must be at least 10 characters.",
  //             "validation_value": "10",
  //             "type": "minLength"
  //         },
  //         {
  //             "message": "Contact Number field must not be greater than 14 characters.",
  //             "validation_value": "14",
  //             "type": "maxLength"
  //         }
  //     ]
  // },
  // {
  //     "id": 33,
  //     "type": "text",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "personal_information",
  //     "sub_group_by": null,
  //     "order_by": 18,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Emergency Relationship",
  //     "name": "Emergency Relationship",
  //     "key": "emergency_contact_relationship",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": []
  // },
  // {
  //     "id": 34,
  //     "type": "text",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 5,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Zip Code",
  //     "name": "Zip Code",
  //     "key": "mailing_zip_code",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Zip Code maximum length must be of 6 digit.",
  //             "validation_value": "6",
  //             "type": "maxLength"
  //         },
  //         {
  //             "message": "Zip Code field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  {
    id: 222,
    type: "phone",
    category: null,
    is_disable: false,
    is_multiple: false,
    url: null,
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 14,
    span: "6",
    is_default: true,
    placeholder: "Phone Number (Primary)",
    name: "Phone Number (Primary)",
    key: "main_phone",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Phone Number field is required.",
        validation_value: null,
        type: "required",
      },
      {
        message: "Phone Number field must not be greater than 14 characters.",
        validation_value: "14",
        type: "maxLength",
      },
      {
        message: "Phone Number field must be at least 10 characters.",
        validation_value: "10",
        type: "minLength",
      },
    ],
  },
  // {
  //     "id": 274,
  //     "type": "textarea",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 7,
  //     "span": "24",
  //     "is_default": true,
  //     "placeholder": "Notes",
  //     "name": "Notes",
  //     "key": "emergency_note",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Maximum limit for note is 252",
  //             "validation_value": "252",
  //             "type": "maxLength"
  //         }
  //     ]
  // },
  // {
  //     "id": 275,
  //     "type": "select",
  //     "category": "ethnicity",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "personal_information",
  //     "sub_group_by": null,
  //     "order_by": 8,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Ethnic Code",
  //     "name": "Ethnic Code",
  //     "key": "ethnic_code",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": []
  // },
  // {
  //     "id": 276,
  //     "type": "phone",
  //     "category": "",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "personal_information",
  //     "sub_group_by": null,
  //     "order_by": 15,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Phone Number (Alternate)",
  //     "name": "Phone Number (Alternate)",
  //     "key": "alternate_phone_number",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": []
  // },
  // {
  //     "id": 277,
  //     "type": "text",
  //     "category": "",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "personal_information",
  //     "sub_group_by": null,
  //     "order_by": 6,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Social Security Number",
  //     "name": "Social Security Number",
  //     "key": "social_security_number",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Social Security Number field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  // {
  //     "id": 278,
  //     "type": "email",
  //     "category": "",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "personal_information",
  //     "sub_group_by": null,
  //     "order_by": 13,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Email (Alternate)",
  //     "name": "Email (Alternate)",
  //     "key": "email_address_alternate",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": []
  // },
  // {
  //     "id": 279,
  //     "type": "select",
  //     "category": "",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 6,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Country",
  //     "name": "Country",
  //     "key": "mailing_country",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Country field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  // {
  //     "id": 309,
  //     "type": "select",
  //     "category": "",
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "residence_address",
  //     "sub_group_by": null,
  //     "order_by": 6,
  //     "span": "6",
  //     "is_default": true,
  //     "placeholder": "Country",
  //     "name": "Country",
  //     "key": "residence_country",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": [
  //         {
  //             "message": "Country field is required.",
  //             "validation_value": "",
  //             "type": "required"
  //         }
  //     ]
  // },
  {
    id: 310,
    type: "api",
    category: "",
    is_disable: false,
    is_multiple: false,
    url: "/user/role",
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 7,
    span: "6",
    is_default: true,
    placeholder: "Type",
    name: "Type",
    key: "type",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Type field is required.",
        validation_value: null,
        type: "required",
      },
    ],
  },
  {
    id: 311,
    type: "password",
    category: "",
    is_disable: false,
    is_multiple: false,
    url: "",
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 22,
    span: "6",
    is_default: true,
    placeholder: "Password",
    name: "Password",
    key: "password",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Password field is required.",
        validation_value: null,
        type: "required",
      },
    ],
  },
  {
    id: 312,
    type: "confirm_password",
    category: "",
    is_disable: false,
    is_multiple: false,
    url: "",
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 23,
    span: "6",
    is_default: true,
    placeholder: "Confirm Password",
    name: "Confirm Password",
    key: "confirm_password",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Confirm Password field is required.",
        validation_value: null,
        type: "required",
      },
    ],
  },
  {
    id: 313,
    type: "api",
    category: "",
    is_disable: false,
    is_multiple: false,
    url: "guard-tour/site",
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 20,
    span: "6",
    is_default: true,
    placeholder: "Site",
    name: "Site",
    key: "client_site",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [],
  },
  {
    id: 314,
    type: "api",
    category: "",
    is_disable: false,
    is_multiple: false,
    url: "/template/beats",
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 21,
    span: "6",
    is_default: true,
    placeholder: "Beats",
    name: "Beats",
    key: "beat_id",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [],
  },
  {
    id: 315,
    type: "api",
    category: "",
    is_disable: false,
    is_multiple: false,
    url: "/company/details",
    options: null,
    group_by: "personal_information",
    sub_group_by: null,
    order_by: 19,
    span: "6",
    is_default: true,
    placeholder: "Branches",
    name: "Branches",
    key: "location_id",
    selected_check: null,
    is_delete: true,
    is_view: true,
    is_create: true,
    is_edit: true,
    validations: [
      {
        message: "Branch field is required.",
        validation_value: "",
        type: "required",
      },
    ],
  },
  // {
  //     "id": 319,
  //     "type": "text",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "mailing_address",
  //     "sub_group_by": null,
  //     "order_by": 2,
  //     "span": "12",
  //     "is_default": true,
  //     "placeholder": "Address",
  //     "name": "Address",
  //     "key": "mailing_address",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": []
  // },
  // {
  //     "id": 320,
  //     "type": "text",
  //     "category": null,
  //     "is_disable": false,
  //     "is_multiple": false,
  //     "url": null,
  //     "options": null,
  //     "group_by": "residence_address",
  //     "sub_group_by": null,
  //     "order_by": 2,
  //     "span": "12",
  //     "is_default": true,
  //     "placeholder": "Address",
  //     "name": "Address",
  //     "key": "residence_address",
  //     "selected_check": null,
  //     "is_delete": true,
  //     "is_view": true,
  //     "is_create": true,
  //     "is_edit": true,
  //     "validations": []
  // }
];

export const messagesTest = {
  screened: "This action will send the applicant to screening",
  sourced: "This action will send the applicant to applicants",
  blacklisted: "This action will send the applicant to blacklist",
  interview: "This action will send the applicant to interview ",
  "schedule-interview": "This action will send the applicant to interview ",
  rejected: "This action will send the applicant to rejected.",
};
export const messages = {
  screened: "Applicant moved to screening successfully ",
  blacklisted: "Applicant moved to blacklist successfully",
  interview: "Applicant moved to interview successfully ",
  rejected: "Applicant rejected successfully",
  applicant: "Applicant moved to applicants successfully",
  sourced: "Applicant moved to applicants successfully",
};
