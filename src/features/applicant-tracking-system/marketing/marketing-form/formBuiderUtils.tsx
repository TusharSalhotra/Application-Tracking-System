// @ts-nocheck
import {
    BaseButton,
    BaseButtonsForm,
    BaseCol,
    BaseInputBox,
    SelectBox,
  } from "@deepak-pahwa/citywide-commonmodules";
  import React from "react";
  import { Checkbox, Col, DatePicker, Flex, Input, Radio, Typography } from "antd";
  import dayjs from "dayjs";
  import { Field } from "utils/types";
  import PhoneInput from "react-phone-input-2";
  const { Text } = Typography;
  const { countries } = require("countries-list");
  
  const firstNameRegExp = /^[a-zA-Z'-]+$/;
  export const renderInput = (
    field: Field,
    onChange?: (data: any) => void,
    focused?: any,
    setFocused?: any,
    isValueFilled?: any
  ) => {
    const rules = field?.validations?.map((item: any) => {
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
    });
  
    if (field?.text === "Email") {
      rules.push({
        type: "email",
        message: "Please enter a valid email address!",
      });
    }
    rules.push({
      pattern:
        field.key == "first_name" || field.key == "last_name"
          ? firstNameRegExp
          : "",
      message: `Only [a-z, A-z, -, '] are allowed`,
    });
    return (
      <BaseButtonsForm.Item
        label={field?.label}
        key={field?.key}
        name={field?.key}
        rules={rules}
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
        />
      </BaseButtonsForm.Item>
    );
  };
  
  export const renderButton = (
    field: Field,
    type?: string,
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
    language_code?: any,
    isValueFilled?: any,
    focused?: any,
    setFocused?: any
  ) => (
    <BaseButtonsForm.Item
      key={field?.key}
      label={field?.label}
      name={field?.key}
      rules={field?.validations?.map((item: any) => {
        if (item?.type === "required") {
          return {
            whitespace: true,
            required: true,
            message: item?.message,
          };
        }
        if (item?.type === "maxLength") {
          return {
            max: parseInt(item?.validation_value),
            message: item?.message,
          };
        }
        return null;
      })}
      style={{
        width: "100%",
      }}
      className={`floating-label-input global-input-box ${
        isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
      }`}
    >
      <Input.TextArea
        autoComplete="off"
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        onFocus={() => setFocused(field?.key)}
        rows={2}
        className="w-full"
        onChange={onChange}
        disabled={field?.is_edit === false}
      />
    </BaseButtonsForm.Item>
  );
  
  const disableDatesForDOB = (currentDate: dayjs.Dayjs) => {
    // Check if the current date is after today minus 18 years
    return currentDate && currentDate.isAfter(dayjs().subtract(18, "years"));
  };
  // Default picker value set to 18 years ago
  const defaultPickerValueForDOB = dayjs().subtract(18, "years");
  
  export const renderDatePicker = (
    field: Field,
    onChange?: (data: any) => void,
    focused?: any,
    setFocused?: any,
    isValueFilled?: any
  ) => (
    <BaseButtonsForm.Item
      key={field?.key}
      name={field?.key}
      label={field?.label}
      className={`floating-label-input  ${
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
        disabledDate={
          field.label?.toLowerCase()?.includes("birth") ||
          field.label.trim() === "Date of Birth" ||
          field.label.trim() === "DOB"
            ? disableDatesForDOB
            : undefined
        }
        defaultPickerValue={
          field.label?.toLowerCase()?.includes("birth") ||
          field.label.trim() === "Date of Birth" ||
          field.label.trim() === "DOB"
            ? defaultPickerValueForDOB
            : undefined
        }
        format={"MM/DD/YYYY"}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        onFocus={() => setFocused(field?.id)}
      />
    </BaseButtonsForm.Item>
  );
  const filteredCountries = (searchValue: string) => {
    return countries
      ? Object.keys(countries)
          .filter(
            (key) =>
              countries[key].name
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1
          )
          .sort((a: any, b: any) => {
            return countries[a]?.name.localeCompare(countries[b]?.name);
          })
      : [];
  };
  
  export const renderSelectRole = (
    field: Field,
    onChange: (data: any, type: string) => void,
    rolesList?: any,
    roleType?: any,
    isValueFilled?: any,
    focused?: any,
    setFocused?: any
  ) => {
    let adminDisabledRoles = ["Client", "Account Manager"];
    let dispatchDisabledRoles = ["Client", "Account Manager", "Admin"];
    let clientDisabledRoles = [
      "Admin",
      "Account Manager",
      "Dispatch",
      "Patrol",
      "Field Agent",
    ];
    let patrolDisabledRoles = ["Admin", "Account Manager", "Dispatch", "Client"];
    let fieldDisabledRoles = [
      "Client",
      "Account Manager",
      "Admin",
      "Dispatch",
      "Patrol",
    ];
    let accountDisabledRoles = ["Admin", "Client"];
  
    const currentRole = rolesList.find((item: any) => item?.id === roleType?.[0]);
  
    const is_disabled = () => {
      return field.key === "location_id" ||
        (field?.key === "type" && rolesList?.some((item) => item?.id === "1")) ||
        field?.is_edit === false
        ? true
        : false;
    };
    const isDisabled = (opt: any) => {
      if (currentRole?.title === "Admin") {
        return adminDisabledRoles?.includes(opt?.title);
      }
      if (currentRole?.title === "Client") {
        return clientDisabledRoles?.includes(opt?.title);
      }
      if (currentRole?.title === "Dispatch") {
        return dispatchDisabledRoles?.includes(opt?.title);
      }
      if (currentRole?.title === "Patrol") {
        return patrolDisabledRoles?.includes(opt?.title);
      }
      if (currentRole?.title === "Field Agent") {
        return fieldDisabledRoles?.includes(opt?.title);
      }
      if (currentRole?.title === "Account Manager") {
        return accountDisabledRoles?.includes(opt?.title);
      }
      return false;
    };
  
    return (
      <BaseButtonsForm.Item
        key={field?.key}
        label={field?.label}
        name={field?.key}
        rules={field?.validations?.map((item: any) => {
          if (item?.required) {
            return {
              ...item,
              message: item?.message,
            };
          }
        })}
        className={`floating-label-input global-input-box ${
          isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
        }`}
      >
        {
          <SelectBox
            allowClear={field.key.includes("type") ? true : false}
            onChange={(e) => onChange(e, "roleType")}
            mode={"multiple"}
            disabled={is_disabled()}
            onFocus={() => setFocused(field?.key)}
            placeholder="Type"
          >
            {rolesList.map((opt: any) => {
              return (
                <SelectBox.Option
                  key={opt?.id || ""}
                  value={opt?.id || ""}
                  disabled={isDisabled(opt)}
                >
                  {opt?.label || ""}
                </SelectBox.Option>
              );
            })}
          </SelectBox>
        }
      </BaseButtonsForm.Item>
    );
  };
  
  export const renderSelect = (
    field: Field,
    onChange?: (data: any) => void,
    focused?: any,
    setFocused?: any,
    isValueFilled?: any,
    globleCodes?: any,
    agentRanks: any,
    locationsList: any,
    stateList: any,
    userRolesList: any,
    branch?: any
  ) => {
    return (
      <BaseButtonsForm.Item
        key={field?.key}
        label={field?.label}
        name={field?.key}
        initialValue={
          branch && field?.key?.includes("branches") ? branch : undefined
        } // Set initial value for branches
        rules={field?.options?.map((item: any) => {
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
          disabled={field?.key?.includes("branches") ? true : false}
        >
          {field?.key?.includes("country")
            ? filteredCountries("")?.map((code: any) => {
                return (
                  <SelectBox.Option
                    key={countries[code].name || ""}
                    value={countries[code].name}
                  >
                    {countries[code].name || ""}
                  </SelectBox.Option>
                );
              })
            : field?.key?.includes("branches")
            ? locationsList?.map((opt: any) => {
                return (
                  <SelectBox.Option key={opt?.title || ""} value={opt?.title}>
                    {opt?.title || ""}
                  </SelectBox.Option>
                );
              })
            : field?.key?.includes("state")
            ? stateList?.map((opt: any) => {
                return (
                  <SelectBox.Option key={opt?.id} value={opt?.code}>
                    {opt?.code || ""}
                  </SelectBox.Option>
                );
              })
            : field?.category || field?.key?.includes("gender")
            ? globleCodes[field?.category]?.map((opt: any) => {
                return (
                  <SelectBox.Option key={opt?.id || ""} value={opt?.value}>
                    {opt?.value || ""}
                  </SelectBox.Option>
                );
              })
            : field?.options.map((opt: any) => {
                return (
                  <SelectBox.Option value={opt.value}>
                    {opt.text}
                  </SelectBox.Option>
                );
              })}
        </SelectBox>
      </BaseButtonsForm.Item>
    );
  };
  
  export const renderRadio = (
    field: Field,
    onChange?: (data: any) => void,
    isEditAgent?: any
  ) => (
    <BaseButtonsForm.Item
      key={field.key}
      label={field.label}
      name={field.key}
      style={{
        marginLeft: "6px",
        padding: 0,
      }}
    >
      <Radio.Group>
        {field?.options.map((opt: any) => {
          return <Radio value={opt.value}>{opt.text}</Radio>;
        })}
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
        key={field?.key}
        label={field?.name}
        name={field?.key}
        rules={
          field?.validations &&
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
  export const PhoneNumberInput = (
    field: Field & { required: boolean },
    onChangePhone?: () => void
  ) => {
    return (
      <BaseButtonsForm.Item
        id={field.key}
        label={field.label}
        key={field.key}
        name={field.key}
        rules={
          field?.required
            ? [
                {
                  required: true,
                  message: `${field.label} field is required`,
                },
              ]
            : field.validations?.map((item: any) => {
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
              })
        }
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
    focused: any;
    setFocused: any;
    isValueFilled: any;
    handleEditor: any;
    editorData: any;
    languageCode: any;
    customRequest: any;
    renderUpload: any;
    onChangePhone: () => void;
    globleCodes: any;
    agentRanks: any;
    locationsList: any;
    stateList: any;
    userRolesList: any;
    roleType: any;
    branch: any;
  }) => {
    const {
      field,
      onChange,
      focused,
      setFocused,
      isValueFilled,
      handleEditor,
      editorData,
      languageCode,
      customRequest,
      renderUpload,
      onChangePhone,
      globleCodes,
      agentRanks,
      locationsList,
      stateList,
      userRolesList,
      roleType,
      branch,
    } = fieldprops;
    switch (field?.text) {
      case "Text Input":
        return (
          <BaseCol
            xl={field.label.length > 80 ? 24 : field.label.length > 30 ? 14 : 8}
            lg={field.label.length > 80 ? 24 : field.label.length > 30 ? 14 : 8}
            md={field.label.length > 80 ? 24 : field.label.length > 30 ? 14 : 8}
            xs={24}
          >
            {renderInput(field, onChange, focused, setFocused, isValueFilled)}
          </BaseCol>
        );
      case "Email":
        return (
          <BaseCol xl={8} lg={8} md={8} xs={24}>
            {renderInput(field, onChange, focused, setFocused, isValueFilled)}
          </BaseCol>
        );
  
      case "Number":
        return (
          <BaseCol xl={8} lg={8} md={8} xs={24}>
            {field.label?.toLowerCase()?.includes("mobile") ||
            field.label?.toLowerCase()?.includes("phone")
              ? PhoneNumberInput(field, onChangePhone)
              : renderInput(field, onChange, focused, setFocused, isValueFilled)}
          </BaseCol>
        );
      case "Date Field":
        return (
          <BaseCol xl={8} lg={8} md={8} xs={24}>
            {renderDatePicker(
              field,
              onChange,
              focused,
              setFocused,
              isValueFilled
            )}
          </BaseCol>
        );
      case "Dropdown":
        return (
          <BaseCol xl={8} lg={8} md={8} xs={24}>
            {field.key.includes("type")
              ? renderSelectRole(
                  field,
                  onChange,
                  userRolesList,
                  roleType,
                  isValueFilled,
                  focused,
                  setFocused
                )
              : renderSelect(
                  field,
                  onChange,
                  focused,
                  setFocused,
                  isValueFilled,
                  globleCodes,
                  agentRanks,
                  locationsList,
                  stateList,
                  userRolesList,
                  branch
                )}
          </BaseCol>
        );
      case "api":
        return (
          <BaseCol xl={8} lg={8} md={8} xs={24}>
            {renderSelect(field, onChange, focused, setFocused, isValueFilled)}
          </BaseCol>
        );
      case "Radio Group":
        return <BaseCol span={8}>{renderRadio(field, onChange)}</BaseCol>;
      case "checkbox":
        return <BaseCol span={8}>{renderCheckbox(field, onChange)}</BaseCol>;
      case "File Upload":
        return <BaseCol span={24}>{renderUpload(field, customRequest)}</BaseCol>;
      case "Text Area":
        return (
          <BaseCol xl={24} lg={24} md={24} xs={24}>
            {renderTextArea(
              field,
              onChange,
              "",
              isValueFilled,
              focused,
              setFocused
            )}
          </BaseCol>
        );
      default:
        return null;
    }
  };
  
  export const renderJobField = (label: string, value: any) => {
    return value ? (
      <Col span={12}>
        <Flex align="center" gap={5}>
          <div style={{ fontWeight: "800", fontSize: "15px" }}>{label}: </div>
          <Text>{value}</Text>
        </Flex>
      </Col>
    ) : null;
  };
  