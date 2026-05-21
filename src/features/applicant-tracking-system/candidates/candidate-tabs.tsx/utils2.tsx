// @ts-nocheck
import React from "react";
import {
  BaseButton,
  BaseButtonsForm,
  BaseInputBox,
  BaseDatePicker,
  SelectBox,
  BaseRadio,
  BaseCheckbox,
  BaseCol,
} from "lib/ui-commonmodules";
import { Input } from "antd";
import { Field } from "utils/types";
import PhoneInput from "react-phone-input-2";
import { date_format } from "utils/common-function";
import dayjs from "dayjs";

const firstNameRegExp = /^[a-zA-Z'-]+$/;

export const renderFirstNameInput = (
  field: Field,
  onChange?: (data: any) => void,
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
    pattern: firstNameRegExp,
    message: `Only [a-z, A-z, -, '] are allowed`,
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

export const renderInput = (
  field: Field,
  onChange?: (data: any) => void,
  companyDetails?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
) => (
  <BaseButtonsForm.Item
    label={field.name}
    key={field.key}
    name={field.key}
    rules={
      field?.key === "password" || field?.key === "confirm_password"
        ? []
        : field?.validations?.map((item: any) => {
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
    className={`floating-label-input ${
      isValueFilled(field.key) || focused === field.key ? "focused " : ""
    }`}
  >
    <BaseInputBox
      onBlur={(e) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field.key)}
      onChange={onChange}
      placeholder={field.name}
      maxLength={
        field?.key === "email" ? 50 : field?.key === "residence_city" ? 50 : 30
      }
    />
  </BaseButtonsForm.Item>
);

export const renderButton = (
  field: Field,
  type?: string,
  companyDetails?: any
) => (
  <BaseButton
    type="link"
    size="middle"
    style={{
      fontSize: "15px",
    }}
    icon={"+"}
  >
    {field?.label[companyDetails.language_code]}
  </BaseButton>
);

export const renderTextArea = (
  field: Field,
  onChange?: (data: any) => void,
  companyDetails?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.label[companyDetails.language_code]}
    name={field.key}
    rules={field?.validations?.map((item: any) => {
      if (item?.required) {
        return {
          ...item,
          message: item?.message[companyDetails.language_code],
        };
      }
    })}
    style={{
      width: "100%",
    }}
  >
    <Input.TextArea
      placeholder={field.label[companyDetails.language_code]}
      maxLength={8}
      className="w-full"
      onChange={onChange}
    />
  </BaseButtonsForm.Item>
);

export const renderDatePicker = (
  field: Field,
  onChange?: (data: any) => void,
  companyDetails?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any
) => {
  const disabledDate = (current: any) => {
    if (field?.key?.includes("birth")) {
      return current && current > dayjs().subtract(18, "year");
    }
  };
  return (
    <BaseButtonsForm.Item
      key={field?.key}
      name={field?.key}
      label={field?.name}
      rules={field?.validations?.map((item: any) => {
        if (item?.required) {
          return {
            ...item,
            message: item?.message[companyDetails.language_code],
          };
        }
      })}
      className={`floating-label-input ${
        isValueFilled(field.key) || focused === field.key ? "focused " : ""
      }`}
    >
      <BaseDatePicker
        onBlur={(e) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        onFocus={() => setFocused(field.key)}
        onChange={onChange}
        format={date_format ?? "MM/DD/YYYY"}
        placeholder={field.name}
        disabledDate={disabledDate}
        defaultPickerValue={dayjs().subtract(18, "year") || null}
      />
    </BaseButtonsForm.Item>
  );
};

export const renderSelect = ({
  field,
  onChange,
  globleCodes,
  companyDetails,
  focused,
  setFocused,
  isValueFilled,
  locationsList,
}: {
  field?: Field;
  onChange?: (data: any) => void;
  globleCodes?: any;
  companyDetails?: any;
  focused?: any;
  setFocused?: any;
  isValueFilled?: any;
  locationsList?: any;
}) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.name}
    name={field.key}
    rules={
      field.validations &&
      field?.validations?.map((item: any) => {
        if (item?.required) {
          return {
            ...item,
            message: item?.message[companyDetails.language_code],
          };
        }
      })
    }
    className={`floating-label-input ${
      isValueFilled(field.key) || focused === field.key ? "focused " : ""
    }`}
  >
    <SelectBox
      placeholder={field.name}
      onChange={onChange}
      onBlur={(e) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field.key)}
    >
      {field.key === "location_id" ? (
        locationsList.map((opt: any) => {
          return (
            <SelectBox.Option key={opt?.id || ""} value={opt?.id + "" || ""}>
              {opt?.title || ""}
            </SelectBox.Option>
          );
        })
      ) : globleCodes ? (
        globleCodes[field.category]?.map((opt: any) => {
          return (
            <SelectBox.Option key={opt?.labels || ""} value={opt?.value || ""}>
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
  </BaseButtonsForm.Item>
);

export const renderRadio = (
  field: Field,
  onChange?: (data: any) => void,
  companyDetails?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.label[companyDetails.language_code]}
    name={field.key}
    style={{
      marginLeft: "6px",
      padding: 0,
    }}
  >
    <BaseRadio.Group
      className="m-0 p-0"
      optionType="button"
      buttonStyle="solid"
      onChange={onChange}
    >
      {field?.options?.map((opt: any) => (
        <BaseRadio key={opt?.value} value={opt?.value}>
          {opt?.value}
        </BaseRadio>
      ))}
    </BaseRadio.Group>
  </BaseButtonsForm.Item>
);

export const renderCheckbox = (
  field: Field,
  onChange?: (data: any) => void,
  companyDetails?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.label[companyDetails.language_code]}
    name={field.key}
    rules={
      field.validations &&
      field?.validations?.map((item: any) => {
        if (item?.required) {
          return {
            ...item,
            message: item?.message[companyDetails.language_code],
          };
        }
      })
    }
    style={{
      marginLeft: "6px",
      padding: 0,
    }}
  >
    <BaseCheckbox.Group className="m-0 p-0" onChange={onChange}>
      {field?.options?.map((opt: any) => (
        <BaseCheckbox key={opt?.value} value={opt?.value}>
          {opt?.value}
        </BaseCheckbox>
      ))}
    </BaseCheckbox.Group>
  </BaseButtonsForm.Item>
);

export const renderEmailInput = (
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
      { type: "email", message: "Please enter a valid email address!" },
      ...(field?.validations?.map((item: any) => {
        if (item.type === "required") {
          return { required: true, message: item?.message };
        }
        return item;
      }) || []),
    ]}
    className={`floating-label-input ${
      isValueFilled(field.key) || focused === field.key ? "focused " : ""
    }`}
  >
    <BaseInputBox
      onBlur={(e) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(field.key)}
      onChange={onChange}
      type="email"
      placeholder="Enter your email"
    />
  </BaseButtonsForm.Item>
);

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

export const renderPassword = (
  field: Field,
  onChange?: (data: any) => void,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.name}
    name={field.key}
    rules={field?.validations
      ?.map((item: any) => {
        if (item?.type === "required") {
          return {
            ...item,
            required: true,
            message: item?.message,
          };
        }
      })
      .concat([
        {
          validator(_, value: any) {
            if (!value) {
              return Promise.resolve();
            }
            if (passwordRegex.test(value)) {
              return Promise.resolve();
            }
            return Promise.reject(
              "Minimum 8 characters, at least one uppercase, 1 lowercase letter, 1 special char. and 1 number"
            );
          },
        },
      ])}
    className={`floating-label-input global-input-box ${
      isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
    }`}
  >
    <Input.Password
      autoComplete="new-password"
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      disabled={field?.is_edit === false}
      onFocus={() => setFocused(field?.key)}
      className="w-full"
      onChange={onChange}
    />
  </BaseButtonsForm.Item>
);

const passwordValidations: any = {
  es: "¡La nueva contraseña de confirmación que ingresó no coincide!",
  en: "The new confirm password that you entered do not match!",
  zh: "您輸入的新確認密碼不符！",
};

export const renderConfirmPassword = (
  field: Field,
  onChange?: (data: any) => void,
  password?: any,
  confirm_password?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.name}
    name={field.key}
    rules={
      confirm_password?.length > 0
        ? field?.validations
            ?.map((item: any) => {
              if (item?.type === "required") {
                return {
                  ...item,
                  required: true,
                  message: item?.message,
                };
              }
            })
            .concat([
              {
                validator(value: any) {
                  if (password === confirm_password) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(passwordValidations["en"]));
                },
              },
            ])
        : field?.validations?.map((item: any) => {
            if (item?.type === "required") {
              return {
                ...item,
                required: true,
                message: item?.message,
              };
            }
          })
    }
    className={`floating-label-input global-input-box ${
      isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
    }`}
  >
    <Input.Password
      autoComplete="new-password"
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      disabled={field?.is_edit === false}
      onFocus={() => setFocused(field?.key)}
      className="w-full"
      onChange={onChange}
    />
  </BaseButtonsForm.Item>
);

export const renderBeatSelect = ({
  field,
  onChange,
  beatsList,
  handleSearch,
  isValueFilled,
  focused,
  setFocused,
}: {
  field?: any;
  onChange?: (data: any) => void;
  beatsList?: any;
  handleSearch?: any;
  isValueFilled?: any;
  focused?: any;
  setFocused?: any;
}) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.name}
    name={field.key}
    rules={
      field.validations &&
      // field.validations.map((rule: any) => ({
      //   [rule.type]: rule.value ? rule.value : true,
      //   message: rule.message,
      // }))
      field?.validations?.map((item: any) => {
        if (item?.type === "required") {
          return {
            ...item,
            required: true,
            message: item?.message,
          };
        }
      })
    }
    //className="m-0 p-0"

    className={`floating-label-input global-input-box ${
      isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
    }`}
  >
    <SelectBox
      //disabled={editKey ? true : false}
      showSearch
      onChange={onChange}
      mode={"multiple"}
      onMouseDown={() => handleSearch(null, field.key)}
      onSearch={(data) => handleSearch(data, field.key)}
      filterOption={false}
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
          handleSearch(null, field.key);
        }
      }}
      disabled={field?.is_edit === false}
      onFocus={() => setFocused(field?.key)}
    >
      {beatsList.map((opt: any) => {
        return (
          <SelectBox.Option key={opt?.id || ""} value={opt?.id}>
            {opt.beat_id}
          </SelectBox.Option>
        );
      })}
    </SelectBox>
  </BaseButtonsForm.Item>
);

export const renderSelectRole = ({
  field,
  onChange,
  userRolesList,
  roleType,
  isValueFilled,
  focused,
  setFocused,
}: {
  field: Field;
  onChange: (data: any, type: string) => void;
  userRolesList?: any;
  editKey?: any;
  roleType?: any;
  isValueFilled?: any;
  focused?: any;
  setFocused?: any;
}) => {
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

  const currentRole = userRolesList.find(
    (item: any) => item?.id === roleType?.[0]
  );

  const is_disabled = () => {
    return field.key === "location_id" ||
      (field?.key === "type" &&
        userRolesList?.some((item) => item?.id === "1")) ||
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
      key={field.key}
      label={field.name}
      name={field.key}
      rules={
        field.validations &&
        // field.validations.map((rule: any) => ({
        //   [rule.type]: rule.value ? rule.value : true,
        //   message: rule.message,
        // }))
        field?.validations?.map((item: any) => {
          if (item?.type === "required") {
            return {
              ...item,
              required: true,
              message: item?.message,
            };
          }
        })
      }
      className={`floating-label-input global-input-box ${
        isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
      }`}
    >
      {
        <SelectBox
          allowClear={field.key === "type" ? true : false}
          onChange={(e) => onChange(e, "roleType")}
          mode={"multiple"}
          disabled={is_disabled()}
          onFocus={() => setFocused(field?.key)}
        >
          {
            <>
              {userRolesList.map((opt: any) => {
                return (
                  <SelectBox.Option
                    key={opt?.id || ""}
                    value={opt?.id || ""}
                    disabled={isDisabled(opt)}
                  >
                    {opt?.title || ""}
                  </SelectBox.Option>
                );
              })}
            </>
          }
        </SelectBox>
      }
    </BaseButtonsForm.Item>
  );
};

export const renderBeatsForm = ({
  field,
  onChange,
  globleCodes,
  language_code,
  beatsList,
  roleType,
  handleSearch,
  editKey,
  isValueFilled,
  focused,
  setFocused,
  userRolesList,
  beat_id,
}: {
  field?: any;
  onChange?: (data: any) => void;
  globleCodes?: any;
  language_code?: any;
  beatsList?: any;
  roleType?: any;
  handleSearch?: any;
  editKey?: any;
  isValueFilled?: any;
  focused?: any;
  setFocused?: any;
  userRolesList?: any;
  beat_id?: any;
}) => {
  switch (field.type) {
    case "api":
      return (
        <>
          {roleType &&
          roleType?.some(
            (role: any) =>
              userRolesList?.find((el: any) => el.id === role)?.is_beat
          ) ? (
            <BaseCol className="site-beat-select" span={24}>
              {renderBeatSelect({
                field,
                onChange,
                globleCodes,
                language_code,
                beatsList,
                roleType,
                handleSearch,
                editKey,
                isValueFilled,
                focused,
                setFocused,
              })}
            </BaseCol>
          ) : null}
        </>
      );

    default:
      return null;
  }
};

export const renderSiteSelect = ({
  field,
  onChange,
  sitesList,
  handleSearch,
  isValueFilled,
  focused,
  setFocused,
  is_multiple,
}: {
  field?: any;
  onChange?: (data: any) => void;
  sitesList?: any;
  handleSearch?: any;
  isValueFilled?: any;
  focused?: any;
  setFocused?: any;
  is_multiple?: any;
}) => (
  <BaseButtonsForm.Item
    key={field.key}
    label={field.name}
    name={field.key}
    rules={field?.validations?.map((item: any) => {
      if (item?.type === "required") {
        return {
          ...item,
          required: true,
          message: item?.message,
        };
      }
    })}
    className={`floating-label-input m-0 p-0 ${
      isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
    }`}
  >
    {is_multiple ? (
      <SelectBox
        onChange={onChange}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
            handleSearch(null, field.key);
          }
        }}
        onMouseDown={() => handleSearch(null, field.key)}
        onFocus={() => setFocused(field?.key)}
        mode={"multiple"}
        showSearch
        onSearch={(data) => handleSearch(data, field.key)}
        filterOption={false}
        disabled={field?.is_edit === false}
      >
        {sitesList.map((opt: any) => {
          return (
            <SelectBox.Option
              disabled={opt?.patrol_site_disabled}
              key={opt?.id || opt?.site_name || opt?.site_id}
              value={opt?.id}
            >
              {opt?.site_name || ""}
            </SelectBox.Option>
          );
        })}
      </SelectBox>
    ) : (
      <SelectBox
        onChange={onChange}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
            handleSearch(null, field.key);
          }
        }}
        onFocus={() => setFocused(field?.key)}
        //disabled={editKey ? true : false}
        showSearch
        onMouseDown={() => handleSearch(null, field.key)}
        onSearch={(data) => handleSearch(data, field.key)}
        filterOption={false}
        disabled={field?.is_edit === false}
      >
        {sitesList.map((opt: any) => {
          return (
            <SelectBox.Option key={opt?.id || ""} value={opt?.id}>
              {opt?.site_name || ""}
            </SelectBox.Option>
          );
        })}
      </SelectBox>
    )}
  </BaseButtonsForm.Item>
);

export const renderExtraForm = ({
  field,
  onChange,
  sitesList,
  roleType,
  editKey,
  handleSearch,
  isValueFilled,
  focused,
  setFocused,
  userRolesList,
  client_site,
}: {
  field?: any;
  onChange?: (data: any) => void;
  sitesList?: any;
  roleType?: any;
  editKey?: any;
  handleSearch?: any;
  isValueFilled?: any;
  focused?: any;
  setFocused?: any;
  userRolesList?: any;
  client_site?: string[] | string;
}) => {
  const is_multiple = roleType?.some(
    (role: any) =>
      userRolesList?.find((el: any) => el.id === role)?.is_site &&
      userRolesList?.find((el: any) => el.id === role)?.is_multiple
  );

  const multipleClientId = is_multiple ? client_site : [];
  switch (field.type) {
    case "api":
      return (
        <>
          {roleType?.some(
            (role: any) =>
              userRolesList.find((el: any) => el.id === role)?.is_site
          ) ? (
            <BaseCol className="site-beat-select" span={24}>
              {renderSiteSelect({
                field,
                onChange,
                sitesList,
                roleType,
                editKey,
                handleSearch,
                isValueFilled,
                focused,
                setFocused,
                is_multiple,
              })}
            </BaseCol>
          ) : null}
        </>
      );

    default:
      return null;
  }
};

export const renderBadgeInput = (
  field: Field,
  onChange?: (data: any) => void,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => {
  return (
    <BaseButtonsForm.Item
      label={field.name}
      key={field.key}
      name={field.key}
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
      className={`floating-label-input ${
        isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
      }`}
    >
      <BaseInputBox
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        onFocus={() => setFocused(field?.key)}
        autoComplete="off"
        maxLength={8}
        disabled={field?.is_edit === false}
        onChange={onChange}
      />
    </BaseButtonsForm.Item>
  );
};

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

export const renderFormOnboarding = (renderProps: {
  field: any;
  onChange?: (data: any) => void;
  globleCodes?: any;
  companyDetails?: any;
  focused: boolean;
  setFocused: any;
  isValueFilled: any;
  userRolesList: any;
  beatsList: any;
  sitesList: any;
  beat_id: any;
  badge_number: any;
  confirm_password: any;
  password: any;
  citizenship: any;
  roleType_: any;
  client_site: any;
  roleType: any;
  BaseFormMethod: any;
  handleSearch: any;
  locationsList: any;
  onChangePhone: any;
}) => {
  const {
    field,
    onChange,
    globleCodes,
    companyDetails,
    focused,
    setFocused,
    isValueFilled,
    userRolesList,
    beatsList,
    sitesList,
    beat_id,
    badge_number,
    confirm_password,
    password,
    citizenship,
    roleType_,
    client_site,
    roleType,
    handleSearch,
    locationsList,
    onChangePhone,
  } = renderProps;

  switch (field.type) {
    case "text":
      return (
        <BaseCol span={12}>
          {field.key === "first_name"
            ? renderFirstNameInput(
                field,
                onChange,
                isValueFilled,
                focused,
                setFocused
              )
            : field.key === "badge_number"
            ? renderBadgeInput(
                field,
                onChange,
                isValueFilled,
                focused,
                setFocused
              )
            : renderInput(
                field,
                onChange,
                companyDetails,
                focused,
                setFocused,
                isValueFilled
              )}
        </BaseCol>
      );
    case "date":
      return (
        <BaseCol span={12}>
          {renderDatePicker(
            field,
            onChange,
            companyDetails,
            focused,
            setFocused,
            isValueFilled
          )}
        </BaseCol>
      );
    case "email":
      return (
        <BaseCol xl={12} lg={12} md={12} xs={24}>
          {renderEmailInput(
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
        <BaseCol span={12}>
          {renderSelect({
            field,
            onChange,
            globleCodes,
            companyDetails,
            focused,
            setFocused,
            isValueFilled,
            locationsList,
          })}
        </BaseCol>
      );

    case "phone":
      return (
        <BaseCol xxl={12} xl={12} lg={12} md={12} xs={24}>
          {PhoneNumberInput(field, onChangePhone)}
        </BaseCol>
      );
    case "api":
      return field.key === "beat_id" ? (
        renderBeatsForm({
          field,
          onChange,
          globleCodes,
          beatsList,
          roleType,
          handleSearch,
          isValueFilled,
          focused,
          setFocused,
          userRolesList,
          beat_id,
        })
      ) : field.key === "client_site" ? (
        renderExtraForm({
          field,
          onChange,
          globleCodes,
          sitesList,
          roleType,
          isValueFilled,
          focused,
          setFocused,
          userRolesList,
          client_site,
          handleSearch,
        })
      ) : field.key === "type" ? (
        <BaseCol span={12}>
          {renderSelectRole({
            field,
            onChange,
            userRolesList,
            roleType,
            isValueFilled,
            focused,
            setFocused,
          })}
        </BaseCol>
      ) : (
        <BaseCol span={12}>
          {renderSelect({
            field,
            onChange,
            globleCodes,
            companyDetails,
            focused,
            setFocused,
            isValueFilled,
            locationsList,
          })}
        </BaseCol>
      );
    case "radio":
      return (
        <BaseCol span={12}>
          {/* {renderRadio(field, onChange, companyDetails)} */}
        </BaseCol>
      );
    case "checkbox":
      return (
        <BaseCol span={12}>
          {/* {renderCheckbox(field, onChange, companyDetails)} */}
        </BaseCol>
      );
    case "textarea":
      return (
        <BaseCol span={24}>
          {/* {renderTextArea(field, onChange, companyDetails)} */}
        </BaseCol>
      );
    case "button":
      return (
        <BaseCol span={12}>
          {/* {renderButton(field, "default", companyDetails)} */}
        </BaseCol>
      );

    case "password": //password
      return (
        <>
          <BaseCol span={field?.span} xxl={12} xl={12} lg={12} md={12} xs={24}>
            {renderPassword(
              field,
              onChange,
              isValueFilled,
              focused,
              setFocused
            )}
          </BaseCol>
        </>
      );
    case "confirm_password": //password
      return (
        <>
          <BaseCol span={field?.span} xxl={12} xl={12} lg={12} md={12} xs={24}>
            {renderConfirmPassword(
              field,
              onChange,
              password,
              confirm_password,
              isValueFilled,
              focused,
              setFocused
            )}
          </BaseCol>
        </>
      );
    default:
      return null;
  }
};
