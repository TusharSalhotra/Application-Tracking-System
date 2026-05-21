//Add Job Post Jason Data
import React from "react";
import {
  BaseButton,
  BaseButtonsForm,
  BaseInputBox,
  SelectBox,
  BaseCol,
} from "lib/citywide-commonmodules";

import { Form, Input, Checkbox, DatePicker, Radio, Upload } from "antd";
import { Field } from "utils/types";
import { TextEditor } from "../text-editor/editor";
import moment from "moment";
import dayjs from "dayjs";

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
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field?.id)}
      format={"MM/DD/YYYY"}
      disabledDate={(current) => {
        return current && current < dayjs().startOf("day");
      }}
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
  location,
  jobForm,
  id,
  skillType,
  handleSearch,
  arrayOfData,
}: {
  field: Field;
  onChange?: (data: any) => void;
  globleCodes?: any;
  activityCode?: any;
  focused?: any;
  setFocused?: any;
  isValueFilled?: any;
  location?: any;
  jobForm?: any;
  id?: any;
  skillType?: any;
  handleSearch?: any;
  arrayOfData?: any;
}) => (
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
        showSearch={field.type === "api"}
        // onMouseDown={() => handleSearch(null, field.key)}
        onSearch={(data) => handleSearch(data, field.key)}
        filterOption={false}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        disabled={field.key === "location_id" && id}
        style={{
          width: "100%",
          margin: 0,
          padding: 0,
        }}
        onFocus={() => setFocused(field?.id)}
      >
        {field?.key === "location_id" ? (
          (location?.data?.data?.locations || location?.data?.data || [])?.map(
            (opt: any) => {
              return (
                <SelectBox.Option key={opt?.name || ""} value={opt?.id || ""}>
                  {opt?.name || ""}
                </SelectBox.Option>
              );
            }
          )
        ) : field?.key === "setting_form_id" ? (
          jobForm?.data?.data?.settingForm?.map((opt: any) => {
            return (
              <SelectBox.Option key={opt?.name || ""} value={opt?.id || ""}>
                {opt?.name || ""}
              </SelectBox.Option>
            );
          })
        ) : field?.key === "required_skill" ? (
          skillType?.map((opt: any) => (
            <SelectBox.Option key={field?.id || ""} value={opt?.id || ""}>
              {`${opt?.name}` || ""}
            </SelectBox.Option>
          ))
        ) : globleCodes || field?.key === "select" ? (
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
        showSearch={field.type === "api"}
        // onMouseDown={() => handleSearch(null, field.key)}
        onSearch={(data) => handleSearch(data, field.key)}
        filterOption={false}
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
        {arrayOfData && arrayOfData?.length ? (
          arrayOfData?.map((opt: any) => {
            return (
              <SelectBox.Option key={opt?.id || ""} value={opt?.id}>
                {opt?.name}
              </SelectBox.Option>
            );
          })
        ) : field?.key === "location_id" ? (
          location?.data?.data?.locations?.map((opt: any) => {
            return (
              <SelectBox.Option key={opt?.name || ""} value={opt?.id || ""}>
                {opt?.name || ""}
              </SelectBox.Option>
            );
          })
        ) : field?.key === "setting_form_id" ? (
          jobForm?.data?.data?.settingForm?.map((opt: any) => {
            return (
              <SelectBox.Option
                key={opt?.name || ""}
                value={Number(opt?.id) || ""}
              >
                {opt?.name || ""}
              </SelectBox.Option>
            );
          })
        ) : globleCodes ? (
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
    )}
  </BaseButtonsForm.Item>
);
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

const renderUpload = (field: Field, type?: string) => (
  <Form.Item
    key={field.id}
    label={field.label}
    name={field.id}
    // rules={field?.validation}
    style={{
      width: "100%",
    }}
  >
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={(options: any) => options.onSuccess?.({}, new XMLHttpRequest())}
      //   beforeUpload={beforeUpload}
      //   onChange={handleChange}
    >
      {/* {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )} */}
    </Upload>
  </Form.Item>
);
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
            whitespace: true,
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

const SalaryRangeRegExp = /^(?! )[a-zA-Z0-9',-]+( [a-zA-Z0-9',-]+)*$/;
export const renderSalaryRangeInput = (
  field: Field,
  onChange?: (data: any) => void,
  language_code?: any,
  editKey?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  currencySymbol?: any
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
    pattern: SalaryRangeRegExp,
    message: `Only alphabets, numbers, alphanumeric and commas are allowed.`,
  });

  return (
    <>
      <BaseButtonsForm.Item
        label={` ${field.name} ${currencySymbol ?? ""}`}
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

const NumberRegExp = /^[0-9]+$/;
export const renderNumberInput = (
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
        return null;
      })
      .filter((rule: any) => rule !== null) || []; // Filter out null rules

  rules.push({
    pattern: NumberRegExp,
    message: `Only numbers are allowed.`,
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

export const renderForm = (fieldprops: {
  field: any;
  onChange: any;
  handleSearch: any;
  handleEditor: any;
  editorData: any;
  globleCodes: any;
  languageCode: any;
  isEditAgent: any;
  activityCode: any;
  focused: any;
  setFocused: any;
  isValueFilled: any;
  location: any;
  jobForm: any;
  id: any;
  currencySymbol: any;
  skillType?: any;
  Departments?: any;
  employmentList?: any;
  arrayOfData?: any;
}) => {
  const {
    field,
    onChange,
    handleSearch,
    handleEditor,
    editorData,
    globleCodes,
    languageCode,
    isEditAgent,
    activityCode,
    focused,
    setFocused,
    isValueFilled,
    location,
    jobForm,
    id,
    currencySymbol,
    skillType,
    arrayOfData,
  } = fieldprops;
  switch (field.type) {
    case "text":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {field.key === "title" ? (
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
              {field.key === "salary_range" ? (
                <>
                  {renderSalaryRangeInput(
                    field,
                    onChange,
                    languageCode,
                    isEditAgent,
                    isValueFilled,
                    focused,
                    setFocused,
                    currencySymbol
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
    case "number":
      return (
        <BaseCol xl={8} lg={8} md={8} xs={24}>
          {renderNumberInput(
            field,
            onChange,
            languageCode,
            isEditAgent,
            isValueFilled,
            focused,
            setFocused
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
            location,
            jobForm,
            id,
            skillType,
            handleSearch,
            arrayOfData,
          })}
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
            location,
            jobForm,
            id,
            skillType,
            handleSearch,
            arrayOfData,
          })}
        </BaseCol>
      );
    case "radio":
      return (
        <BaseCol span={8}>
          {renderRadio(field, onChange, languageCode, isEditAgent)}
        </BaseCol>
      );
    case "textarea":
      return field.key === "description" ? (
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
    case "upload":
      return <BaseCol span={8}>{renderUpload(field)}</BaseCol>;
    case "button":
      return (
        <BaseCol span={8}>
          {renderButton(field, "default", languageCode, isEditAgent)}
        </BaseCol>
      );

    default:
      return null;
  }
};

export const formatDate = (dateString: string) => {
  return moment.utc(dateString).format("MM/DD/YYYY");
};

export enum StatusColors {
  Published = "status-published",
  Closed = "status-closed",
  Draft = "status-draft",
}

export enum Keys {
  BADGE_NUMBER = "badge_number",
  FIRST_NAME = "first_name",
  LAST_NAME = "last_name",
  COLUMN_SORT_KEY = "column_sort_key",
  COLUMN_SORT_VALUE = "column_sort_value",
}

export enum ActionType {
  ADD = "Add",
  UPDATE = "Update",
  EDIT = "EDIT",
  DELETE = "DELETE",
}
