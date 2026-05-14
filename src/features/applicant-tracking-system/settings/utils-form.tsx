// @ts-nocheck
import React, { useState } from "react";
import {
  BaseButton,
  BaseButtonsForm,
  BaseInputBox,
  BaseDatePicker,
  SelectBox,
  BaseRadio,
  BaseCheckbox,
  BaseCol,
} from "@deepak-pahwa/citywide-commonmodules";

import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Radio,
  message,
  Upload,
  UploadProps,
} from "antd";
import { Field } from "utils/types";
import { max } from "moment";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import PhoneInput from "react-phone-input-2";

const alphanumeric_validate = {
  pattern: /^[a-zA-Z0-9\s]*$/,
  message: "Only alphanumeric characters are allowed",
};

export const renderInput = (
  field: Field,
  onChange?: (data: any) => void,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
) => {
  return (
    <BaseButtonsForm.Item
      label={field.name}
      key={field.key}
      name={field.key}
      rules={[
        ...field?.validations?.map((item: any) => {
          if (item?.type === "required") {
            item = {
              whitespace: true,
              required: true,
              message: item?.message,
            };
          } else if (item?.type === "maxLength") {
            item = {
              max: Number(parseFloat(item.validation_value)),
              message: item?.message,
            };
          } else if (item?.type === "pattern") {
            item = {
              pattern: /^[a-zA-Z0-9\s]*$/,
              message: item?.message,
            };
          }
          return item;
        }),
      ].filter(Boolean)}
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
        maxLength={150}
        onFocus={() => setFocused(field?.id)}
        onChange={onChange}
        // placeholder={field?.name}
      />
    </BaseButtonsForm.Item>
  );
};

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
  onChangePhone?: (data: any) => {},
  language_code?: any,
  editKey?: string,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => {
  return (
    <Form.Item
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
    </Form.Item>
  );
};

export const renderTextArea = (
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
  onChange?: (data: any) => void,
  languageCode?: any,
  isEditAgent?: any
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
      onChange={onChange}
      format={"MM/DD/YYYY"}
      // placeholder={field?.name}
    />
  </BaseButtonsForm.Item>
);

export const renderSelect = (
  field: Field,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any,
  arrayOfData?: any,
  globleCodes?: any,
  handleSearch?: (key: string, data: string) => void,
  AgencyData?: any
) => {
  return (
    <BaseButtonsForm.Item
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
        onFocus={() => setFocused(field?.id)}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        placeholder={field.name}
      >
        {AgencyData?.data?.map((opt: any) => (
          <Select.Option key={opt?.id || ""} value={opt?.id || ""}>
            {`${opt?.name}` || ""}
          </Select.Option>
        ))}
      </SelectBox>
    </BaseButtonsForm.Item>
  );
};

export const renderNumInput = (
  field: Field,
  onChange?: (data: any) => void,
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
        } else if (item?.type === "maxLength") {
          item = {
            max: Number(parseFloat(item.validation_value)),
            message: item?.message,
          };
        }
        return item; // Include other standard rules here
      }) || []),
      {
        validator: (_, value) => {
          if (parseInt(value) <= 0) {
            return Promise.reject(new Error("Value cannot be less than 1"));
          }
          return Promise.resolve();
        },
      },
    ]}
    className={`floating-label-input ${
      isValueFilled(field?.key) ||
      isValueFilled(field?.key) ||
      focused === field?.id
        ? "focused "
        : ""
    }`}
  >
    <BaseInputBox
      onChange={onChange}
      type="number"
      placeholder={field.name}
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field?.id)}
    />
  </BaseButtonsForm.Item>
);

export const renderRadio = (
  field: Field,
  onChange?: (data: any) => void,
  languageCode?: any,
  isEditAgent?: any
) => {
  // Default to an empty array if options is null or undefined
  const options = field?.options || [];
  return (
    <BaseButtonsForm.Item
      key={field.key}
      label={field.name}
      name={field.key}
      className="c-mb-1"
      rules={
        field.validations &&
        field?.validations?.map((item: any) => {
          if (item?.type === "required") {
            item = {
              ...item,
              required: true,
              message: item?.message,
            };
          }
          return item;
        })
      }
    >
      <BaseRadio.Group
        className="radio-group c-m-0"
        buttonStyle="solid"
        onChange={onChange}
      >
        {field.options?.map((opt: any) => (
          <BaseRadio
            key={opt?.value}
            value={opt?.value}
            checked={opt?.value === 1 ? true : false}
          >
            {opt?.label}
          </BaseRadio>
        ))}
      </BaseRadio.Group>
    </BaseButtonsForm.Item>
  );
};

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
      <Checkbox className="c-m-0 p-0" onChange={onChange}></Checkbox>
    </BaseButtonsForm.Item>
  );
};
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
        <img src={imageUrl} alt="avatar" style={{  window.location.href = `${CITY_V2}admin/break`;width: "100%" }} />
      ) : (
        uploadButton
      )} */}
    </Upload>
  </Form.Item>
);

export const renderForm = ({
  field,
  onChange,
  handleSearch,
  mendatory,
  focused,
  setFocused,
  isValueFilled,
  coursesData,
  instructor,
  employee,
  handleEditor,
  editorData,
  chapter,
  assessment,
  arrayOfData,
  globleCodes,
  handelReset,
  AgencyData,
  onChangePhone,
  language_code,
}: {
  field: any;
  onChange?: (data: any) => void;
  handleSearch?: (key: string, data: string) => void;

  globleCodes?: any;
  languageCode?: any;
  isEditAgent?: any;
  activityCode?: any;
  mendatory?: any;
  focused?: any;
  setFocused?: any;
  isValueFilled?: any;
  coursesData?: any;
  instructor?: any;
  employee?: any;
  handleEditor?: (editorState: any, editorIndex: number) => void;
  editorData?: { question: EditorState }[];
  assessment?: any;
  chapter?: any;
  arrayOfData?: any;
  handelReset?: any;
  AgencyData?: any;
  onChangePhone?: any;
  language_code?: any;
}) => {
  switch (field.type) {
    case "text":
      return (
        <>
          <BaseCol xl={12} lg={12} md={24} sm={24} xs={24}>
            {renderInput(field, onChange, focused, setFocused, isValueFilled)}
          </BaseCol>
        </>
      );
    case "date":
      return (
        <BaseCol xl={12} lg={12} md={24} sm={24} xs={24}>
          {renderDatePicker(field, focused, setFocused, isValueFilled)}
        </BaseCol>
      );
    case "number":
      return (
        <BaseCol xl={12} lg={12} md={24} sm={24} xs={24}>
          {renderNumInput(field, onChange, focused, setFocused, isValueFilled)}
        </BaseCol>
      );
    case "select":
      return (
        <>
          <BaseCol xl={12} lg={12} md={24} sm={24} xs={24}>
            {renderSelect(
              field,
              focused,
              setFocused,
              isValueFilled,
              arrayOfData,
              globleCodes,
              handleSearch,
              handelReset
            )}
          </BaseCol>
        </>
      );
    case "api":
      return (
        <>
          {field.key !== "instructor_id" ? (
            <BaseCol xl={12} lg={12} md={24} sm={24} xs={24}>
              {renderSelect(
                field,
                focused,
                setFocused,
                isValueFilled,
                arrayOfData,
                globleCodes,
                handleSearch,
                AgencyData
              )}
            </BaseCol>
          ) : null}
        </>
      );
    case "radio":
      return (
        <BaseCol xl={24} lg={24} md={24} sm={24} xs={24}>
          {renderRadio(field, onChange)}
        </BaseCol>
      );
    case "checkbox":
      return (
        <BaseCol xl={12} lg={12} md={24} sm={24} xs={24}>
          {renderCheckbox(field, onChange, mendatory)}
        </BaseCol>
      );
    case "phone":
      return (
        <BaseCol span={field?.span} xxl={12} xl={12} lg={8} md={24} xs={24}>
          {PhoneNumberInput(
            field,
            onChangePhone,
            language_code,
            isValueFilled,
            focused,
            setFocused
          )}
        </BaseCol>
      );
    case "textarea":
      return (
        <BaseCol xl={12} lg={12} md={24} sm={24} xs={24}>
          {renderTextArea(field, onChange, focused, setFocused, isValueFilled)}
        </BaseCol>
      );
    case "upload":
      return <BaseCol span={8}>{renderUpload(field)}</BaseCol>;
    case "button":
      return <BaseCol span={8}>{renderButton(field, "default")}</BaseCol>;

    default:
      return null;
  }
};
