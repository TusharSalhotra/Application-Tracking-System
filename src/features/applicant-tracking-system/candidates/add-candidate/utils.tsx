// @ts-nocheck
//Add Job Post Jason Data
import React from "react";
import {
  BaseButton,
  BaseButtonsForm,
  BaseInputBox,
  SelectBox,
  BaseCol,
} from "lib/ui-commonmodules";

import { Form, Input, Checkbox, DatePicker, Radio, Upload } from "antd";
import { Field } from "utils/types";
import { TextEditor } from "../../text-editor/editor";
import PhoneInput from "react-phone-input-2";

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
    rules={[
      ...(field?.validations?.map((item: any) => {
        if (item?.type === "required") {
          return {
            required: true,
            message: item?.message,
          };
        } else if (item?.type === "max Length") {
          return {
            max: Number(parseFloat(item.validation_value)),
            message: item?.message,
          };
        }
        return item;
      }) || []),
      {
        validator: (_, value) => {
          if (value && /^\s/.test(value)) {
            return Promise.reject("Leading spaces are not allowed.");
          }
          return Promise.resolve();
        },
      },
    ]}
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
      onFocus={() => setFocused(field?.id)}
      onChange={onChange}
      // placeholder={field?.name}
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
    // rules={[
    //   { required: true, message: "Please select a date!" },
    //   {
    //     validator(_, value) {
    //       if (value && value.$d < moment()) {
    //         return Promise.resolve();
    //       } else {
    //         return Promise.reject("Please do not enter a future date!");
    //       }
    //     },
    //   },
    // ]}.
    className={`floating-label-input siteSelect ${
      isValueFilled(field?.key) || focused === field?.id ? "focused " : ""
    }`}
    rules={field?.validations?.map((item: any) => {
      if (item?.required) {
        return {
          ...item,
          message: item?.message,
        };
      }
    })}
  >
    <DatePicker
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field?.id)}
      format={"MM/DD/YYYY"}
      // placeholder={field?.name}
    />
  </BaseButtonsForm.Item>
);

export const renderSelect = ({
  field,
  onChange,
  globleCodes,
  activityCode,
  focused,
  setFocused,
  isValueFilled,
  jopPosting,
  sourceType,
  skillType,
  handleSearch,
}: {
  field: Field;
  onChange?: (data: any) => void;
  globleCodes?: any;
  activityCode?: any;
  focused?: any;
  setFocused?: any;
  isValueFilled?: any;
  jopPosting?: any;
  sourceType?: any;
  skillType?: any;
  handleSearch?: any;
}) => {
  return (
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
      <SelectBox
        onChange={onChange}
        showSearch={field.type === "api"}
        // onMouseDown={() => handleSearch(null, field.key)}
        onSearch={(data) => handleSearch(data, field.key)}
        filterOption={false}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
            // handleSearch(null, field.key);
          }
        }}
        style={{
          width: "100%",
          margin: 0,
          padding: 0,
        }}
        onFocus={() => setFocused(field?.id)}
        mode={field?.is_multiple ? "multiple" : undefined}
      >
        {field?.type === "select"
          ? globleCodes[field.category]?.map((opt: any) => {
              return (
                <SelectBox.Option
                  key={field?.key || ""}
                  value={opt?.value || ""}
                >
                  {opt?.value || ""}
                </SelectBox.Option>
              );
            })
          : ""}
        {field?.key === "source_type"
          ? sourceType?.map((opt: any) => (
              <SelectBox.Option key={field?.id || ""} value={opt?.id || ""}>
                {`${opt?.name}` || ""}
              </SelectBox.Option>
            ))
          : ""}
        {field?.key === "skill"
          ? skillType?.map((opt: any) => (
              <SelectBox.Option key={field?.id || ""} value={opt?.id || ""}>
                {`${opt?.name}` || ""}
              </SelectBox.Option>
            ))
          : ""}
        {field?.key === "position"
          ? jopPosting?.map((opt: any) => {
              return (
                <SelectBox.Option key={field?.key || ""} value={opt?.id || ""}>
                  {opt?.title || ""}
                </SelectBox.Option>
              );
            })
          : ""}
        {field?.options?.length
          ? field.options.map((opt: any) => (
              <SelectBox.Option key={field?.key || ""} value={opt?.value || ""}>
                {opt?.text || opt?.label || opt?.value || ""}
              </SelectBox.Option>
            ))
          : ""}
      </SelectBox>
    </BaseButtonsForm.Item>
  );
};

export const renderRadio = (
  field: Field,
  onChange?: (data: any) => void,
  languageCode?: any,
  isEditAgent?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.name}
    name={field.key}
    style={{
      marginLeft: "6px",
      padding: 0,
    }}
  >
    <Radio.Group>
      {/* {field?.options?.map((opt: any) => (
          <Radio value={opt}> {opt} </Radio>
        ))} */}
      <Radio value="yes">Yes</Radio>
      <Radio value="No">No</Radio>
    </Radio.Group>
  </BaseButtonsForm.Item>
);

export const renderCheckbox = (
  field: Field,
  onChange?: (data: any) => void,
  mendatory?: any
) => {
  return (
    <BaseButtonsForm.Item
      key={field.key}
      label={field.name}
      name={field.key}
      rules={
        field.validations &&
        field?.validations?.map((item: any) => {
          if (item?.type === "required") {
            item = {
              ...item,
              whitespace: true,
              required: true,
              message: item?.message,
            };
          }
          return item;
        })
      }
      style={{
        marginLeft: "6px",
        padding: 0,
      }}
    >
      <Checkbox
        className="c-m-0 p-0"
        onChange={onChange}
        checked={mendatory}
        defaultChecked={mendatory ? true : false}
      ></Checkbox>
    </BaseButtonsForm.Item>
  );
};

export const renderInputEmail = (
  field: Field,
  onChange?: (data: any) => void,
  editKey?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => (
  <BaseButtonsForm.Item
    label={field.name}
    key={field.key}
    name={field.key}
    rules={
      field.validations &&
      field?.validations?.map((item: any) => {
        if (item?.type === "required") {
          return {
            ...item,
            required: true,
            message: item?.message,
          };
        }
        if (item?.type === "email") {
          return {
            type: "email",
            message: item?.message,
          };
        }
      })
    }
    className={`floating-label-input ${
      isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
    }`}
  >
    <BaseInputBox
      autoComplete="new-password"
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field?.key)}
      onChange={onChange}
      disabled={
        (editKey && field.key === "email") || field?.is_edit === false
          ? true
          : false
      }
    />
  </BaseButtonsForm.Item>
);

// Render function for phone number input
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
const firstNameRegExp = /^[a-zA-Z'-]+$/;
export const renderFirstNameInput = (
  field: Field,
  onChange?: (data: any) => void,
  language_code?: any,
  editKey?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => {
  const rules =
    field?.validations
      ?.map((rule: any) => {
        if (rule.type === "required") {
          return {
            required: true,
            message: rule.message,
          };
        }
        if (rule.type === "maxLength") {
          return {
            max: parseInt(rule?.validation_value),
            message: rule?.message,
          };
        }
        return null;
      })
      .filter((rule: any) => rule !== null) || []; // Filter out null rules

  rules.push({
    validator: (_, value) => {
      if (value && /^\s/.test(value)) {
        return Promise.reject("Leading spaces are not allowed.");
      }
      return Promise.resolve();
    },
  });

  rules.push({
    pattern: /^[A-Za-z\s]+$/, // Updated regex to allow letters and spaces
    message: `Only letters and spaces are allowed`,
  });

  return (
    <>
      <BaseButtonsForm.Item
        label={field.name}
        key={field.key}
        name={field.key}
        rules={rules}
        className={`floating-label-input global-input-box ${
          isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
        }`}
      >
        <BaseInputBox
          autoComplete="new-password"
          onBlur={(e: any) => {
            if (!e.target.value) {
              setFocused("");
            }
          }}
          onFocus={() => setFocused(field?.key)}
          onChange={onChange}
          disabled={field?.is_edit === false}
        />
      </BaseButtonsForm.Item>
    </>
  );
};
export const renderSelectTags = (
  field: Field,
  onChange?: (data: any) => void,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
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
    <SelectBox
      mode="tags"
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
    ></SelectBox>
  </BaseButtonsForm.Item>
);

export const renderForm = (
  field: any,
  onChange?: (data: any) => void,
  handleSearch?: (data: any) => void,
  globleCodes?: any,
  languageCode?: any,
  isEditAgent?: any,
  activityCode?: any,
  mendatory?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any,
  customRequest?: any,
  renderUpload?: any,
  jopPosting?: any,
  onChangePhone?: any,
  sourceType?: any,
  skillType?: any
) => {
  switch (field.type) {
    case "text":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {field?.key == "first_name" ? (
            <>
              {renderFirstNameInput(
                field,
                onChange,
                languageCode,
                isEditAgent,
                isValueFilled,
                focused,
                setFocused
              )}
            </>
          ) : (
            <>
              {renderInput(
                field,
                onChange,
                languageCode,
                isEditAgent,
                focused,
                setFocused,
                isValueFilled
              )}
            </>
          )}
        </BaseCol>
      );
    case "date":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {renderDatePicker(field, focused, setFocused, isValueFilled)}
        </BaseCol>
      );
    case "tag_mode":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {renderSelectTags(
            field,
            onChange,
            focused,
            setFocused,
            isValueFilled
          )}
        </BaseCol>
      );
    case "select":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {renderSelect({
            field,
            onChange,
            globleCodes,
            activityCode,
            focused,
            setFocused,
            isValueFilled,
            jopPosting,
            sourceType,
            skillType,
            handleSearch,
          })}
        </BaseCol>
      );
    case "upload":
      return <BaseCol span={8}>{renderUpload(field, customRequest)}</BaseCol>;
    case "api":
      return (
        <BaseCol
          xl={field?.key === "type" ? 24 : 8}
          lg={field?.key === "type" ? 24 : 8}
          md={field?.key === "type" ? 24 : 8}
          xs={24}
        >
          {renderSelect({
            field,
            onChange,
            globleCodes,
            activityCode,
            focused,
            setFocused,
            isValueFilled,
            jopPosting,
            sourceType,
            skillType,
            handleSearch,
          })}
        </BaseCol>
      );
    case "radio":
      return (
        <BaseCol span={8}>
          {renderRadio(field, onChange, languageCode, isEditAgent)}
        </BaseCol>
      );
    case "checkbox":
      return (
        <BaseCol span={8}>{renderCheckbox(field, onChange, mendatory)}</BaseCol>
      );
    case "textarea":
      return field.key === "description" ? (
        <BaseCol xl={24} lg={24} md={24} xs={24}>
          <TextEditor
            field={field}
            // onChange={onChange}
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
    case "upload":
      return <BaseCol span={8}>{renderUpload(field)}</BaseCol>;
    case "button":
      return (
        <BaseCol span={8}>
          {renderButton(field, "default", languageCode, isEditAgent)}
        </BaseCol>
      );
    case "email":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {renderInputEmail(
            field,
            onChange,
            isEditAgent,
            isValueFilled,
            focused,
            setFocused
          )}
        </BaseCol>
      );
    case "phone":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {PhoneNumberInput(field, onChangePhone)}
        </BaseCol>
      );

    default:
      return null;
  }
};

export const jobForm = {
  message: "Success",
  statusCode: 200,
  data: {
    screen_id: "99",
    globalSearch: {
      title: "Search",
    },
    grid: {
      sub_module_id: "99",
      screen_id: "99",
      column: [
        {
          key: "name",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Name",
          order_by: null,
        },
        {
          key: "certificate",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Select Certificate",
          order_by: null,
        },
        {
          key: "type",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Type",
          order_by: null,
        },
        {
          key: "time_period",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Time Period",
          order_by: null,
        },
        {
          key: "duration",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Duration",
          order_by: null,
        },
        {
          key: "description",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Detailed Description",
          order_by: null,
        },
        {
          key: "chapter",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Chapter",
          order_by: null,
        },
        {
          key: "assessment",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Assessment",
          order_by: null,
        },
        {
          key: "agent_id",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Instructor",
          order_by: null,
        },
        {
          key: "name",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Chapter Name",
          order_by: null,
        },
        {
          key: "hours",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Hours",
          order_by: null,
        },
        {
          key: "chapter_content",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Chapter Content",
          order_by: null,
        },
        {
          key: "upload",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Upload Video",
          order_by: null,
        },
        {
          key: "upload",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Upload File",
          order_by: null,
        },
        {
          key: "url",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Files/URL",
          order_by: null,
        },
        {
          key: "chapter",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Select Chapter",
          order_by: null,
        },
        {
          key: "duration",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Duration",
          order_by: null,
        },
        {
          key: "assessment_name",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Assessment Name",
          order_by: null,
        },
        {
          key: "type",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Type",
          order_by: null,
        },
        {
          key: "score",
          default: true,
          sortable: true,
          dataindex: null,
          group_by: null,
          searchable: false,
          title: "Remarks",
          order_by: null,
        },
      ],
      actions: [
        {
          path: "/admin/edit-training-course/:id",
          title: "Update",
          key: "edit",
        },
        {
          path: "/admin/training-course-details/:id",
          title: "View",
          key: "view",
        },
        {
          path: "",
          title: "Delete",
          key: "isDelete",
        },
        {
          path: "",
          title: "Archive",
          key: "isArchive",
        },
        {
          path: "/admin/add-training-course",
          title: "Add",
        },
        {
          path: "",
          title: "Status",
        },
        {
          path: "",
          title: "Is Active",
        },
        {
          key: "comment",
          title: "comment",
          path: "",
        },
      ],
      form_actions: [
        {
          path: "admin/course/add",
          title: "Add New Course",
          id: 90,
        },
      ],
    },
    name: "Add New Course",
    form: [
      {
        id: 85,
        name: "Add Job Posting",
        is_multiple: false,
        key: "basic_information",
        fields: [
          {
            id: 459,
            type: "text",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "8",
            is_default: true,
            placeholder: "Candidate Name",
            name: "Candidate Name",
            key: "candidate_name",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "The candidate name field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 460,
            type: "text",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "8",
            is_default: true,
            placeholder: "Job Id",
            name: "Job Id",
            key: "jobid",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "The job id field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 461,
            type: "api",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "8",
            is_default: true,
            placeholder: "Source Type",
            name: "Source Type",
            key: "source_type",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "The source typefield is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 462,
            type: "date",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "8",
            is_default: true,
            placeholder: "Sourcing Date",
            name: "Sourcing Date",
            key: "sourcing_date",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "The sourcing date field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 463,
            type: "email",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "8",
            is_default: true,
            placeholder: "Emai",
            name: "Emai",
            key: "email",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: " Emai field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 464,
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
            placeholder: "Position Applied For",
            name: "Position Applied For",
            key: "position_applied",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "The position applied for field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 465,
            type: "phone",
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
            placeholder: "Phone Number",
            name: "Phone Number",
            key: "phone_number",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "Phone number field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 466,
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
            placeholder: "Currrent Employer",
            name: "Currrent Employer",
            key: "current_employer",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "The currrent employer field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 467,
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
            placeholder: "Current Role",
            name: "Current Role",
            key: "current_role",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "Current role field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 468,
            type: "select",
            category: null,
            is_disable: false,
            is_multiple: false,
            url: null,
            options: null,
            group_by: null,
            sub_group_by: null,
            order_by: null,
            span: "8",
            is_default: true,
            placeholder: "Skills & Qualification",
            name: "Skills & Qualification",
            key: "skills_qualfication",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "Skills & qualification field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 469,
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
            placeholder: "Status",
            name: "Status",
            key: "status",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
            validations: [
              {
                message: "Status field is required.",
                validation_value: null,
                type: "required",
              },
            ],
          },
          {
            id: 471,
            type: "upload",
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
            placeholder: "Upload Media",
            name: "Upload Media",
            key: "upload",
            selected_check: null,
            is_delete: true,
            is_view: true,
            is_create: true,
            is_edit: true,
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
