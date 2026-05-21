// @ts-nocheck
import {
  BaseButton,
  BaseButtonsForm,
  BaseCol,
  BaseInputBox,
  SelectBox,
} from "lib/citywide-commonmodules";
import React from "react";
import {
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Typography,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { Field } from "utils/types";
import PhoneInput from "react-phone-input-2";
import { Beat_data } from "reference/scheduling/beatView/type";
const { Text } = Typography;
const { countries } = require("countries-list");

const firstNameRegExp = /^[a-zA-Z'-]+$/;
const ssnRegExp = /^[0-9-]+$/;
const onlyAlphabets = /^[a-zA-Z]+$/;
const passwordValidations: any = {
  es: "¡La nueva contraseña de confirmación que ingresó no coincide!",
  en: "The new confirm password that you entered do not match!",
  zh: "您輸入的新確認密碼不符！",
};

const numberRegExp = /^\d*\.?\d*$/;

export const renderInput = (
  field: Field,
  onChange?: (data: any, section: any) => void,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  updateKey?: any,
  section?: any
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

  if (field?.key === "email") {
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
    <>
      <BaseButtonsForm.Item
        label={field.name}
        key={updateKey ? updateKey : field?.key}
        name={updateKey ? updateKey : field?.key}
        rules={field.validations?.map((item: any) => {
          if (item?.type === "required") {
            return {
              required: true,
              message: item.message,
            };
          }
          if (item?.type === "maxLength") {
            return {
              max: parseInt(item?.validation_value),
              message: item?.message,
            };
          }
          if (field.key === "city") {
            return {
              pattern: onlyAlphabets,
              message: "Please enter only alphabets",
            };
          } // uscis_number
        })}
        className={`floating-label-input global-input-box ${
          isValueFilled(updateKey ? updateKey : field?.key) ||
          focused === (updateKey ? updateKey : field?.key)
            ? "focused "
            : ""
        }`}
      >
        <BaseInputBox
          autoComplete="new-password"
          onBlur={(e: any) => {
            if (!e.target.value) {
              setFocused("");
            }
          }}
          onFocus={() => setFocused(updateKey ? updateKey : field?.key)}
          onChange={(evt) => onChange(evt, section)}
          disabled={field?.key === "location_id" ? true : false}
        />
      </BaseButtonsForm.Item>
    </>
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
export const renderUpload = (field: Field, type?: string) => (
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
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => {
  //chaeck box === 1 && field.jey === "expiration_date"
  const disabledDate = (current: any) => {
    if (field.key === "birthdate") {
      return current && current > dayjs().subtract(18, "year");
    }
    const arrOfKeys = [
      "firearm_qualification_expire",
      "drivers_license_expire",
      "guardcard_expire",
      "expiration_date",
    ];

    if (arrOfKeys?.some((role: any) => role === field.key)) {
      // Disable future dates
      return current && current < dayjs().startOf("day");
    }

    return false;
  };

  const defaultDate: any = dayjs().subtract(18, "year");
  //const defaultDate = moment().subtract(18, "years"); // 18
  const today = new Date();
  const eighteenYearsAgo = new Date(today);
  eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

  return (
    <>
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
        rules={field?.validations.slice(0, 1)?.map((item: any) => {
          if (item?.type === "required") {
            return {
              ...item,
              required: true,
              message: item?.message,
            };
          }
        })}
        //initialValue={dayjs('2015-01-01')}
        className={`floating-label-input global-input-box ${
          isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
        }`}
      >
        {field.key === "birthdate" ? (
          <DatePicker
            onBlur={(e: any) => {
              if (!e.target.value) {
                setFocused("");
              }
            }}
            onFocus={() => setFocused(field?.key)}
            //inputReadOnly
            allowClear={false}
            format={"MM/DD/YYYY"}
            defaultPickerValue={dayjs().subtract(18, "year") || null}
            disabledDate={disabledDate}
            disabled={field?.is_edit === false}
            value={dayjs("2015-01-01")}
            onChange={onChange}
          />
        ) : (
          <DatePicker
            onBlur={(e: any) => {
              if (!e.target.value) {
                setFocused("");
              }
            }}
            onFocus={() => setFocused(field?.key)}
            inputReadOnly
            allowClear={true}
            disabled={field?.is_edit === false}
            onChange={onChange}
            format={"MM/DD/YYYY"}
          />
        )}
      </BaseButtonsForm.Item>
    </>
  );
};

export const renderBeatSelect = (
  field: any,
  onChange?: (data: any) => void,
  globleCodes?: any,
  language_code?: any,
  beatsList?: any,
  roleType?: any,
  handleSearch?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => (
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

export const renderSiteSelect = (
  field: any,
  onChange?: (data: any) => void,
  sitesList?: any,
  roleType?: any,
  handleSearch?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  isMultiple?: any
) => (
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
    {isMultiple ? (
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

export const renderExtraForm = (
  field: any,
  onChange?: (data: any) => void,
  globleCodes?: any,
  language_code?: any,
  sitesList?: any,
  roleType?: any,
  handleSearch?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  rolesList?: any,
  client_site?: string[] | string
) => {
  const is_multiple = roleType?.some(
    (role: any) =>
      rolesList?.find((el: any) => el.id === role)?.is_site &&
      rolesList?.find((el: any) => el.id === role)?.is_multiple
  );
  const multipleClientId = is_multiple ? client_site : [];
  switch (field.type) {
    case "api":
      return (
        <>
          {roleType?.some(
            (role: any) => rolesList.find((el: any) => el.id === role)?.is_site
          ) ? (
            <BaseCol className="site-beat-select" span={24}>
              {renderSiteSelect(
                field,
                onChange,
                sitesList,
                roleType,
                handleSearch,
                isValueFilled,
                focused,
                setFocused,
                is_multiple
              )}
            </BaseCol>
          ) : null}
        </>
      );

    default:
      return null;
  }
};

export const renderBeatsForm = (
  field: any,
  onChange?: (data: any) => void,
  globleCodes?: any,
  language_code?: any,
  beatsList?: any,
  roleType?: any,
  handleSearch?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  rolesList?: any,
  beat_id?: any
) => {
  switch (field.type) {
    case "api":
      return (
        <>
          {roleType &&
          roleType?.some(
            (role: any) => rolesList?.find((el: any) => el.id === role)?.is_beat
          ) ? (
            <BaseCol className="site-beat-select" span={24}>
              {renderBeatSelect(
                field,
                onChange,
                globleCodes,
                language_code,
                beatsList,
                roleType,
                handleSearch,
                isValueFilled,
                focused,
                setFocused
              )}
            </BaseCol>
          ) : null}
        </>
      );

    default:
      return null;
  }
};

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

export const renderRankSelect = (
  field: Field,
  onChange?: (data: any) => void,
  agentRanks?: any,
  handleSearch?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any
) => (
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
    <SelectBox
      allowClear={false}
      onChange={onChange}
      showSearch={true}
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
      <>
        {agentRanks?.map((opt: any) => {
          return (
            <SelectBox.Option key={opt?.id} value={opt?.id}>
              {opt?.name || ""}
            </SelectBox.Option>
          );
        })}
      </>
    </SelectBox>
  </BaseButtonsForm.Item>
);
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const renderPassword = (
  field: Field,
  onChange?: (data: any) => void,
  language_code?: any,
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

export const renderConfirmPassword = (
  field: Field,
  onChange?: (data: any) => void,
  language_code?: any,
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

export const renderSSNInput = (
  field: Field,
  onChange?: (data: any) => void,
  language_code?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  citizenship?: any
) => {
  const rule_: any[] = [
    {
      whitespace: true,
      required: true,
      message: field.validations?.find((el: any) => el.type === "required")
        ?.message,
    },
  ];

  rule_.push({
    validator: async (rule: any, value: any) => {
      return new Promise((resolve, reject) => {
        // Length validation
        const trimmedValue = value?.trim();

        const numericSSN = value?.replace(/\D/g, ""); // Remove non-numeric characters
        if (trimmedValue && numericSSN.length !== 9) {
          // SSN without hyphens has 9 digits
          reject("Please enter a valid SSN (XXX-XX-XXXX)");
        } else {
          resolve("");
        }
      });
    },
  });

  const rules =
    field?.validations
      ?.map((item: any) => {
        if (citizenship === 1) {
          return {
            required: true,
            message: item.message,
          };
        }
        return null;
      })
      .filter((rule: null) => rule !== null) || []; // Filter out null rules
  if (field.key === "ssn") {
    rules.push(
      {
        pattern: ssnRegExp,
        message: "Please enter a valid SSN (XXX-XX-XXXX)",
      },
      {
        validator: (rule: any, value: string, callback: Function) => {
          const numericSSN = value.replace(/\D/g, ""); // Remove non-numeric characters
          if (numericSSN.length !== 9) {
            callback("Please enter a valid SSN (XXX-XX-XXXX)");
          } else {
            callback();
          }
        },
      }
    );
  }
  return (
    <>
      <BaseButtonsForm.Item
        label={field.name}
        key={field.key}
        name={field.key}
        rules={rule_}
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
          disabled={field?.is_edit === false}
          onFocus={() => setFocused(field?.key)}
          onChange={onChange}
        />
      </BaseButtonsForm.Item>
    </>
  );
};

// export const renderSelect = (
//   field: Field,
//   onChange?: (data: any) => void,
//   focused?: any,
//   setFocused?: any,
//   isValueFilled?: any,
//   globleCodes?: any,
//   agentRanks: any,
//   locationsList: any,
//   stateList: any,
//   branch?: any
// ) => {
//   return (
//     <BaseButtonsForm.Item
//       key={field?.key}
//       label={field?.label}
//       name={field?.key}
//       initialValue={
//         branch && field?.key?.includes("branches") ? branch : undefined
//       } // Set initial value for branches
//       rules={field?.options?.map((item: any) => {
//         if (item?.type === "required") {
//           item = {
//             ...item,
//             whitespace: true,
//             required: true,
//             message: item?.message,
//           };
//         }
//         return item;
//       })}
//       className={`floating-label-input siteSelect ${
//         isValueFilled(field?.key) || focused === field?.id ? "focused " : ""
//       }`}
//     >
//       <SelectBox
//         onBlur={(e: any) => {
//           if (!e.target.value) {
//             setFocused("");
//           }
//         }}
//         style={{
//           width: "100%",
//           margin: 0,
//           padding: 0,
//         }}
//         onFocus={() => setFocused(field?.id)}
//         disabled={field?.key?.includes("branches") ? true : false}
//       ></SelectBox>
//     </BaseButtonsForm.Item>
//   );
// };
export const renderCountrySelect = (
  field: Field,
  onChange?: (data: any) => void,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  countries?: any,
  searchValue?: any,
  handleCountrySearch?: any
) => {
  const filteredCountries = Object.keys(countries)
    .filter(
      (key) =>
        countries[key].name.toLowerCase().indexOf(searchValue.toLowerCase()) !==
        -1
    )
    .sort((a: any, b: any) => {
      return countries[a]?.name.localeCompare(countries[b]?.name);
    });

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
      <SelectBox
        allowClear={false}
        showSearch={true}
        filterOption={false}
        onSearch={handleCountrySearch}
        onChange={onChange}
        disabled={
          field.key === "location_id" || field?.is_edit === false ? true : false
        }
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        onFocus={() => setFocused(field?.key)}
      >
        {filteredCountries?.map((code: any) => {
          return (
            <SelectBox.Option
              key={countries[code].name || ""}
              value={countries[code].name}
            >
              {countries[code].name || ""}
            </SelectBox.Option>
          );
        })}
      </SelectBox>
    </BaseButtonsForm.Item>
  );
};

// export const renderSelect = ({
//   field,
//   onChange,
//   focused,
//   setFocused,
//   isValueFilled,
//   globleCodes,
//   agentRanks,
//   locationsList,
//   stateList,
// }: {
//   field: Field;
//   onChange?: (data: any, type: string) => void;
//   globleCodes?: any;
//   editKey?: any;
//   isValueFilled?: any;
//   focused?: any;
//   setFocused?: any;
//   locationsList: any;
//   stateList: any;
//   agentRanks: any;
// }) => { console.log(locationsList,"locationsList")
//   console.log(field,"field")
//   return (
//     <BaseButtonsForm.Item
//       key={field?.key}
//       label={field?.name}
//       name={field?.key}
//       rules={
//         field?.validations &&
//         // field.validations.map((rule: any) => ({
//         //   [rule.type]: rule.value ? rule.value : true,
//         //   message: rule.message,
//         // }))
//         field?.validations?.map((item: any) => {
//           if (item?.type === "required") {
//             return {
//               ...item,
//               required: true,
//               message: item?.message,
//             };
//           }
//         })
//       }
//       className={`floating-label-input global-input-box ${
//         isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
//       }`}
//     >
//       {field?.is_multiple ? (
//         <SelectBox
//           allowClear={field.key === "type" ? true : false}
//           showSearch={false}
//           onChange={(e) => (onChange ? onChange(e, field?.key) : {})}
//           mode={"multiple"}
//           disabled={false}
//           onBlur={(e: any) => {
//             if (!e.target.value) {
//               setFocused("");
//             }
//           }}
//           onFocus={() => setFocused(field?.key)}
//         >
//           {field?.type !== "api"
//             ? globleCodes[field.category]?.map((opt: any) => {
//                 return (
//                   <SelectBox.Option key={opt?.labels || ""} value={opt?.id}>
//                     {opt?.value || ""}
//                   </SelectBox.Option>
//                 );
//               })
//             : null}
//         </SelectBox>
//       ) : (
//         <SelectBox
//           allowClear={false}
//           onChange={onChange}
//           disabled={
//             // field.key === "location_id" || field?.is_edit === false
//             // </BaseButtonsForm.Item>  ? true
//             false
//           }
//           onBlur={(e: any) => {
//             if (!e.target.value) {
//               setFocused("");
//             }
//           }}
//           onFocus={() => setFocused(field?.key)}
//         >
//           {field.type !== "api" ? (
//             globleCodes[field.category]?.map((opt: any) => {
//               return (
//                 <SelectBox.Option
//                   key={opt?.labels || ""}
//                   value={field.key === "gender" ? opt?.value : opt?.id}
//                 >
//                   {opt?.value || ""}
//                 </SelectBox.Option>
//               );
//             })
//           ) : (
//             <>
//               {field.key === "location_id"
//                 ? locationsList.map((opt: any) => {
//                     return (
//                       <SelectBox.Option
//                         key={opt?.id || ""}
//                         value={opt?.id + "" || ""}
//                       >
//                         {opt?.title || ""}
//                       </SelectBox.Option>
//                     );
//                   })
//                 : field?.key?.includes("country")
//                 ? filteredCountries("")?.map((code: any) => {
//                     return (
//                       <SelectBox.Option
//                         key={countries[code].name || ""}
//                         value={countries[code].name}
//                       >
//                         {countries[code].name || ""}
//                       </SelectBox.Option>
//                     );
//                   })
//                 : field?.key?.includes("branches")
//                 ? locationsList?.map((opt: any) => {
//                     return (
//                       <SelectBox.Option
//                         key={opt?.title || ""}
//                         value={opt?.title}
//                       >
//                         {opt?.title || ""}
//                       </SelectBox.Option>
//                     );
//                   })
//                 : field?.key?.includes("state")
//                 ? stateList?.map((opt: any) => {
//                     return (
//                       <SelectBox.Option key={opt?.id} value={opt?.code}>
//                         {opt?.code || ""}
//                       </SelectBox.Option>
//                     );
//                   })
//                 : field?.category || field?.key?.includes("gender")
//                 ? globleCodes[field?.category]?.map((opt: any) => {
//                     return (
//                       <SelectBox.Option key={opt?.id || ""} value={opt?.value}>
//                         {opt?.value || ""}
//                       </SelectBox.Option>
//                     );
//                   })
//                 : field?.options.map((opt: any) => {
//                     return (
//                       <SelectBox.Option value={opt.value}>
//                         {opt.text}
//                       </SelectBox.Option>
//                     );
//                   })}
//             </>
//           )}
//         </SelectBox>
//       )}
//     </BaseButtonsForm.Item>
//   );
// };
export const renderSelect = ({
  field,
  onChange,
  focused,
  setFocused,
  isValueFilled,
  globleCodes = {},
  agentRanks = [],
  locationsList = [],
  stateList = [],
}: {
  field: Field;
  onChange?: (data: any, type: string) => void;
  globleCodes?: any;
  isValueFilled?: any;
  focused?: any;
  setFocused?: any;
  locationsList?: any[];
  stateList?: any[];
  agentRanks?: any[];
}) => {
  return (
    <BaseButtonsForm.Item
      key={field?.key}
      label={field?.name}
      name={field?.key}
      rules={
        field?.validations?.map((item: any) =>
          item?.type === "required"
            ? { required: true, message: item?.message }
            : item
        ) || []
      }
      className={`floating-label-input global-input-box ${
        isValueFilled?.(field?.key) || focused === field?.key ? "focused " : ""
      }`}
    >
      <SelectBox
        allowClear={field.key === "type"}
        showSearch={false}
        mode={field?.is_multiple ? "multiple" : undefined}
        disabled={field.key === "location_id" ? true : false}
        onBlur={(e: any) => {
          if (!e.target.value) setFocused?.("");
        }}
        onFocus={() => setFocused?.(field?.key)}
        onChange={(e) => onChange?.(e, field?.key)}
      >
        {field?.type !== "api" ? (
          globleCodes[field.category]?.map((opt: any) => (
            <SelectBox.Option
              key={opt?.id || ""}
              value={field.key === "gender" ? opt?.value : opt?.id}
            >
              {opt?.value || ""}
            </SelectBox.Option>
          ))
        ) : (
          <>
            {field.key === "location_id" &&
              locationsList.map((opt: any) => (
                <SelectBox.Option
                  key={opt?.id || ""}
                  value={String(opt?.id) || ""}
                >
                  {opt?.title || ""}
                </SelectBox.Option>
              ))}

            {field?.key?.includes("country") &&
              filteredCountries("")?.map((code: any) => (
                <SelectBox.Option
                  key={countries[code]?.name || ""}
                  value={countries[code]?.name}
                >
                  {countries[code]?.name || ""}
                </SelectBox.Option>
              ))}

            {field?.key?.includes("branches") &&
              locationsList?.map((opt: any) => (
                <SelectBox.Option key={opt?.title || ""} value={opt?.title}>
                  {opt?.title || ""}
                </SelectBox.Option>
              ))}

            {field?.key?.includes("state") &&
              stateList?.map((opt: any) => (
                <SelectBox.Option key={opt?.id} value={opt?.code}>
                  {opt?.code || ""}
                </SelectBox.Option>
              ))}

            {(field?.category || field?.key?.includes("gender")) &&
              globleCodes[field?.category]?.map((opt: any) => (
                <SelectBox.Option key={opt?.id || ""} value={opt?.value}>
                  {opt?.value || ""}
                </SelectBox.Option>
              ))}

            {field?.options?.map((opt: any) => (
              <SelectBox.Option key={opt?.value} value={opt?.value}>
                {opt?.text}
              </SelectBox.Option>
            ))}
          </>
        )}
      </SelectBox>
    </BaseButtonsForm.Item>
  );
};

export const renderStateSelect = (
  field: any,
  onChange: any,
  language_code: any,
  handleSearch: any,
  stateList: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  clearStateSearch?: any
) => (
  console.log(stateList, "stateList"),
  (
    <BaseButtonsForm.Item
      key={field.key}
      label={field.name}
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
        })
      }
      className={`floating-label-input global-input-box ${
        isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
      }`}
    >
      <SelectBox
        allowClear={false}
        onChange={onChange}
        showSearch={true}
        onMouseDown={() => handleSearch(null, field.key)}
        onSearch={(data) => handleSearch(data, field.key)}
        filterOption={false}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
            handleSearch(null, field.key);
          }
          clearStateSearch();
        }}
        onFocus={() => setFocused(field?.key)}
        disabled={field?.is_edit === false}
      >
        <>
          {stateList?.map((opt: any) => {
            return (
              <SelectBox.Option key={opt?.id} value={opt?.code}>
                {opt?.code || ""}
              </SelectBox.Option>
            );
          })}
        </>
      </SelectBox>
    </BaseButtonsForm.Item>
  )
);

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
    return (field?.key === "type" &&
      rolesList?.some((item) => item?.id === "1")) ||
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
      <SelectBox
        allowClear={field.key === "type" ? true : false}
        onChange={(e) => onChange(e, "roleType")}
        mode={"multiple"}
        disabled={is_disabled()}
        onFocus={() => setFocused(field?.key)}
      >
        {
          <>
            {rolesList?.map((opt: any) => {
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
          </>
        }
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
      label={field.name}
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

export const renderFirstNameInput = (
  field: Field,
  onChange?: (data: any) => void,
  language_code?: any,
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

export const renderInputEmail = (
  field: Field,
  onChange?: (data: any) => void,
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
    />
  </BaseButtonsForm.Item>
);

export const renderNumberInput = (
  field: Field,
  onChange?: (data: any) => void,
  currencySymbol?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  updateKey?: any
) => {
  return (
    <BaseButtonsForm.Item
      label={field?.name + " " + (currencySymbol ? currencySymbol : null)}
      key={updateKey ? updateKey : field?.key}
      name={updateKey ? updateKey : field?.key}
      rules={field?.validations?.map((item: any) => {
        if (item?.type === "required") {
          return {
            required: true,
            message: item?.message,
          };
        }
        if (item?.type === "number") {
          return {
            pattern: numberRegExp,
            message: "Please enter a valid rate",
          };
        }
        return null;
      })}
      className={`floating-label-input global-input-box ${
        isValueFilled(updateKey ? updateKey : field?.key) ||
        focused === (updateKey ? updateKey : field?.key)
          ? "focused "
          : ""
      }`}
    >
      <BaseInputBox
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        onFocus={() => setFocused(updateKey ? updateKey : field?.key)}
        min={0}
        className="CHS-input"
        //max={100}
        //formatter={(value) => `${value}%`}
        // parser={(value) => value!.replace('%', '')}
        onChange={onChange}
        disabled={field?.is_edit === false}
      />
    </BaseButtonsForm.Item>
  );
};

export const renderPermitInput = (
  field: Field,
  onChange?: (data: any) => void,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  updateKey?: any
) => {
  const numberRegExp = /^[1-9]\d*$/;
  const wholeNumberRegExp = /^[0-9]\d*$/;

  const patternN = /^[a-zA-Z0-9#]+$/;
  const requiredErr = field.validations.filter(
    (el: any) => el.type === "required"
  );
  const patternErr = field.validations.filter(
    (el: any) => el.type === "pattern"
  );
  const lengthErr = field.validations.filter(
    (el: any) => el.type === "maxLength"
  );

  return (
    <BaseButtonsForm.Item
      label={field.name}
      key={updateKey ? updateKey : field?.key}
      name={updateKey ? updateKey : field?.key}
      rules={[{ whitespace: true, message: requiredErr[0]?.message }].concat([
        {
          validator: async (rule: any, value: any) => {
            // Length validation

            if (value === undefined || value === null) {
              return Promise.resolve();
            }
            if (value.trim().length === 0) {
              return Promise.resolve();
            }

            if (value.trim().length > lengthErr[0]?.validation_value) {
              throw new Error(lengthErr[0].message);
            }

            // Pattern validation
            if (!patternN.test(value)) {
              throw new Error(patternErr[0].message);
            }
          },
        },
      ])}
      className={`floating-label-input global-input-box ${
        isValueFilled(updateKey ? updateKey : field?.key) ||
        focused === (updateKey ? updateKey : field?.key)
          ? "focused "
          : ""
      }`}
    >
      <BaseInputBox
        onChange={onChange}
        disabled={field?.is_edit === false}
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        onFocus={() => setFocused(updateKey ? updateKey : field?.key)}
      />
    </BaseButtonsForm.Item>
  );
};

// export const renderServiceSelect = (
// field: Field, onChange?: (data: any) => void, serviceList?: any, handleServiceList?: any, isValueFilled?: any, focused?: any, setFocused?: any, stateList?: any[] | undefined) => (
//   <BaseButtonsForm.Item
//     key={field.key}
//     label={field.name}
//     name={field.key}
//     rules={
//       field.validations &&
//       // field.validations.map((rule: any) => ({
//       //   [rule.type]: rule.value ? rule.value : true,
//       //   message: rule.message,
//       // }))
//       field?.validations?.map((item: any) => {
//         if (item?.type === "required") {
//           return {
//             ...item,
//             required: true,
//             message: item?.message,
//           };
//         }
//       })
//     }
//     className={`floating-label-input global-input-box ${
//       isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
//     }`}
//   >
//     <SelectBox
//       allowClear={false}
//       onChange={onChange}
//       disabled={field?.is_edit === false}
//       onBlur={(e: any) => {
//         if (!e.target.value) {
//           setFocused("");
//         }
//       }}
//       onFocus={() => setFocused(field?.key)}
//       showSearch={true}
//       onSearch={(data) => handleServiceList(data, field.key)}
//       filterOption={false}
//     >
//       <>
//         {serviceList?.map((opt: any) => {
//           return (
//             <SelectBox.Option key={opt?.id} value={opt?.id}>
//               {opt?.name || ""}
//             </SelectBox.Option>
//           );
//         })}
//       </>
//     </SelectBox>
//   </BaseButtonsForm.Item>
// );
export const renderServiceSelect = (
  field: Field,
  onChange?: (data: any) => void,
  serviceList?: any,
  handleServiceList?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  stateList?: any[] | undefined,
  updateKey?: any
) => (
  <BaseButtonsForm.Item
    key={updateKey ? updateKey : field?.key}
    label={field.name}
    name={updateKey ? updateKey : field?.key}
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
      })
    }
    className={`floating-label-input global-input-box ${
      isValueFilled(updateKey ? updateKey : field?.key) ||
      focused === (updateKey ? updateKey : field?.key)
        ? "focused "
        : ""
    }`}
  >
    <SelectBox
      allowClear={false}
      onChange={onChange}
      disabled={field?.is_edit === false}
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(updateKey ? updateKey : field?.key)}
      showSearch={true}
      onSearch={(data) => handleServiceList(data, field.key)}
      filterOption={false}
    >
      <>
        {/* Service List ke options */}
        {serviceList?.map((opt: any) => (
          <SelectBox.Option key={opt?.id} value={opt?.id}>
            {opt?.name || ""}
          </SelectBox.Option>
        ))}

        {field?.key?.includes("state") &&
          stateList?.map((opt: any) => (
            <SelectBox.Option key={opt?.id} value={opt?.code}>
              {opt?.code || ""}
            </SelectBox.Option>
          ))}
      </>
    </SelectBox>
  </BaseButtonsForm.Item>
);

export const renderRoleSelect = (
  field: Field,
  onChange?: (data: any) => void,
  agentRanks?: any,
  handleSearch?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  updateKey?: any
) => (
  <BaseButtonsForm.Item
    key={updateKey ? updateKey : field?.key}
    label={field.name}
    name={updateKey ? updateKey : field?.key}
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
      })
    }
    className={`floating-label-input global-input-box ${
      isValueFilled(updateKey ? updateKey : field?.key) ||
      focused === (updateKey ? updateKey : field?.key)
        ? "focused "
        : ""
    }`}
  >
    <SelectBox
      allowClear={false}
      onChange={onChange}
      disabled={field?.is_edit === false}
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(updateKey ? updateKey : field?.key)}
      showSearch={true}
      onSearch={(data) => handleSearch(data, field.key)}
      filterOption={false}
    >
      <>
        {agentRanks?.map((opt: any) => {
          return (
            <SelectBox.Option key={opt?.id} value={opt?.id}>
              {opt?.name || ""}
            </SelectBox.Option>
          );
        })}
      </>
    </SelectBox>
  </BaseButtonsForm.Item>
);

// export const renderPermitSelect = (
// field: Field, onChange?: (data: any) => void, globleCodes?: any, isValueFilled?: any, focused?: any, setFocused?: any, stateList?: any[] | undefined) => ( console.log(stateList,"state"),
//   <BaseButtonsForm.Item
//     key={field.key}
//     label={field.name}
//     name={field.key}
//     rules={
//       field.validations &&
//       field?.validations?.map((item: any) => {
//         if (item?.type === "required") {
//           return {
//             ...item,
//             required: true,
//             message: item?.message,
//           };
//         }
//       })
//     }
//     className={`floating-label-input ${
//       isValueFilled(field?.key) || focused === field?.key ? "focused " : ""
//     }`}
//   >
//     <SelectBox
//       onChange={onChange}
//       disabled={field?.is_edit === false}
//       onBlur={(e: any) => {
//         if (!e.target.value) {
//           setFocused("");
//         }
//       }}
//       onFocus={() => setFocused(field?.key)}
//     >
//       {globleCodes ? (
//         globleCodes[field.category]?.map((opt: any) => {
//           return (
//             <SelectBox.Option key={opt?.labels || ""} value={opt?.value || ""}>
//               {opt?.value || ""}
//             </SelectBox.Option>
//           );
//         })
//       ) : (
//         <SelectBox.Option key={"Select"} value={"select"}>
//           Select
//         </SelectBox.Option>
//       )}
//     </SelectBox>
//   </BaseButtonsForm.Item>
// );

export const renderPermitSelect = (
  field: Field,
  onChange?: (data: any) => void,
  globleCodes?: any,
  isValueFilled?: any,
  focused?: any,
  setFocused?: any,
  stateList?: any[],
  updateKey?: string
) => (
  <BaseButtonsForm.Item
    key={updateKey ? updateKey : field?.key}
    label={field.name}
    name={updateKey ? updateKey : field?.key}
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
      })
    }
    className={`floating-label-input ${
      isValueFilled(updateKey ? updateKey : field?.key) ||
      focused === (updateKey ? updateKey : field?.key)
        ? "focused "
        : ""
    }`}
  >
    <SelectBox
      onChange={onChange}
      disabled={field?.is_edit === false}
      onBlur={(e: any) => {
        if (!e.target.value) {
          setFocused("");
        }
      }}
      onFocus={() => setFocused(updateKey ? updateKey : field?.key)}
    >
      {/* GlobelCodes ke options */}
      {globleCodes && globleCodes[field.category]
        ? globleCodes[field.category]?.map((opt: any) => (
            <SelectBox.Option key={opt?.labels || ""} value={opt?.value || ""}>
              {opt?.value || ""}
            </SelectBox.Option>
          ))
        : null}

      {field?.key?.includes("state") &&
        stateList?.map((opt: any) => (
          <SelectBox.Option key={opt?.id} value={opt?.code}>
            {opt?.code || ""}
          </SelectBox.Option>
        ))}
    </SelectBox>
  </BaseButtonsForm.Item>
);

export const renderPermitDatePicker = ({
  field,
  onChange,
  dateFormat,
  isValueFilled,
  focused,
  setFocused,
  resetDate,
  updateKey,
}: {
  field: Field;
  onChange?: (data: any) => void;
  dateFormat?: any;
  isValueFilled?: any;
  focused?: any;
  setFocused?: any;
  resetDate?: any;
  updateKey: any;
}) => {
  const disabledDate = (current: any) => {
    // removed date_of_issue to enable the future date selection
    const arrOfKeys = ["hire_date"];

    if (arrOfKeys?.some((role: any) => role === field.key)) {
      // Disable future dates
      return current && current > dayjs().startOf("day");
    }
    // remove date_of_expiry to enable the future date selection
    const arrOfKeysS = ["effective_end_date"];

    if (arrOfKeysS?.some((role: any) => role === field.key)) {
      // Disable past dates
      return current && current < dayjs().startOf("day");
    }

    return false;
  };
  return (
    <BaseButtonsForm.Item
      key={updateKey ? updateKey : field?.key}
      name={updateKey ? updateKey : field?.key}
      label={field?.name}
      rules={field?.validations?.map((item: any) => {
        if (item?.type === "required") {
          return {
            ...item,
            required: true,
            message: item?.message,
          };
        }
      })}
      className={`floating-label-input global-input-box ${
        isValueFilled(updateKey ? updateKey : field?.key) ||
        focused === (updateKey ? updateKey : field?.key)
          ? "focused"
          : ""
      }`}
    >
      <DatePicker
        onBlur={(e: any) => {
          if (!e.target.value) {
            setFocused("");
          }
        }}
        //defaultValue={field.key === "hire_date" || field.key === "first_date_worked"? hire_Date: null}
        onFocus={() => setFocused(updateKey ? updateKey : field?.key)}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            setTimeout(() => {
              const inputValue = (e.target as HTMLInputElement).value;
              if (!inputValue) {
                resetDate(field?.key);
              }
            }, 0); //setTimeout runs only once and doesn't persist like setInterval doesn't strictly require cleanup.
          }
        }}
        disabledDate={disabledDate}
        onChange={onChange}
        format={"MM/DD/YYYY"}
      />
    </BaseButtonsForm.Item>
  );
};

export const renderPermitForm = (
  field: any,
  onChange?: (data: any) => void,
  agentRanks?: any,
  handleSearch?: any,
  span?: any,
  globleCodes?: any,
  serviceList?: any,
  handleServiceList?: any,
  dateFormat?: any,
  currencySymbol?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any,
  resetDate?: any,
  groupByData?: any,
  stateList?: any[],
  onChangePhone?: any
) => {
  const updateKey = `${field.key}${
    groupByData?.key ? `_${groupByData?.key}` : ""
  }`;

  switch (field.type) {
    case "text":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {field.key === "permit_number"
            ? renderPermitInput(
                field,
                onChange,
                isValueFilled,
                focused,
                setFocused,
                updateKey
              )
            : field.key === "reference_phone"
            ? PhoneNumberInput(field, onChangePhone)
            : renderInput(
                field,
                onChange,
                isValueFilled,
                focused,
                setFocused,
                updateKey
              )}
        </BaseCol>
      );

    case "number":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {renderNumberInput(
            field,
            onChange,
            currencySymbol,
            isValueFilled,
            focused,
            setFocused,
            updateKey
          )}
        </BaseCol>
      );
    case "date":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {renderPermitDatePicker({
            field,
            onChange,
            dateFormat,
            isValueFilled,
            focused,
            setFocused,
            resetDate,
            updateKey,
          })}
        </BaseCol>
      );
    case "select":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {renderPermitSelect(
            field,
            onChange,
            globleCodes,
            isValueFilled,
            focused,
            setFocused,
            stateList,
            updateKey
          )}
        </BaseCol>
      );
    case "api":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {field.key === "service" ? (
            renderRoleSelect(
              field,
              onChange,
              agentRanks,
              handleSearch,
              isValueFilled,
              focused,
              setFocused,
              updateKey
            )
          ) : (
            <>
              {renderServiceSelect(
                field,
                onChange,
                serviceList,
                handleServiceList,
                isValueFilled,
                focused,
                setFocused,
                stateList,
                updateKey
              )}
            </>
          )}
        </BaseCol>
      );
    case "radio":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {renderRadio(field, onChange, updateKey)}
        </BaseCol>
      );
    case "checkbox":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {renderCheckbox(field, onChange, updateKey)}
        </BaseCol>
      );
    case "textarea":
      return (
        <BaseCol span={24} xl={8} lg={8} md={12} xs={24}>
          {/* {renderTextArea(field, onChange, isValueFilled, focused, setFocused)} */}
        </BaseCol>
      );
    case "button":
      return (
        <BaseCol span={12} xl={8} lg={8} md={12} xs={24}>
          {renderButton(field, "default")}
        </BaseCol>
      );
    default:
      return null;
  }
};

export const renderPersonalInfoForm = (
  field: any,
  onChange?: (data: any) => void,
  globleCodes?: any,
  language_code?: any,
  editKey?: any,
  password?: any,
  confirm_password?: any,
  rolesList?: any,
  agentRanks?: any,
  onChangePhone?: any,
  handleSearch?: any,
  roleType?: any,
  BaseFormMethod?: any,
  beatsList?: any,
  sitesList?: any,
  locationsList?: any,
  stateList?: any,
  focused?: any,
  setFocused?: any,
  isValueFilled?: any,
  citizenship?: any,
  countries?: any,
  searchValue?: any,
  handleCountrySearch?: any,
  clearStateSearch?: any,
  beat_id?: Beat_data[],
  client_site?: string[] | string,
  renderUpload?: any,
  companyDetails?: any,
  section?: any
) => {
  switch (field.type) {
    case "text":
      return (
        <BaseCol xxl={4} xl={6} lg={8} md={12} xs={24}>
          {field.key === "social_security_number" &&
            renderSSNInput(
              field,
              onChange,
              language_code,
              isValueFilled,
              focused,
              setFocused
            )}

          {field.key === "first_name" &&
            renderFirstNameInput(
              field,
              onChange,
              language_code,
              isValueFilled,
              focused,
              setFocused
            )}

          {field.key !== "social_security_number" &&
            field.key !== "badge_number" &&
            field.key !== "first_name" &&
            renderInput(
              field,
              onChange,
              isValueFilled,
              focused,
              setFocused,
              "",
              section
            )}
        </BaseCol>
      );
    case "email":
      return (
        <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
          {renderInputEmail(
            field,
            onChange,
            isValueFilled,
            focused,
            setFocused
          )}
        </BaseCol>
      );
    case "date":
      return (
        <>
          <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
            {renderDatePicker(
              field,
              onChange,
              isValueFilled,
              focused,
              setFocused
            )}
          </BaseCol>
        </>
      );
    case "api": {
      return field.key === "beat_id" ? (
        renderBeatsForm(
          field,
          onChange,
          globleCodes,
          language_code,
          beatsList,
          roleType,
          handleSearch,
          isValueFilled,
          focused,
          setFocused,
          rolesList,
          beat_id
        )
      ) : field.key === "client_site" ? (
        renderExtraForm(
          field,
          onChange,
          globleCodes,
          language_code,
          sitesList,
          roleType,
          handleSearch,
          isValueFilled,
          focused,
          setFocused,
          rolesList,
          client_site
        )
      ) : (
        <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
          {field.key === "rank" ? (
            renderRankSelect(
              field,
              onChange,
              agentRanks,
              handleSearch,
              isValueFilled,
              focused,
              setFocused
            )
          ) : (
            <>
              {field.key === "type" ? (
                renderSelectRole(
                  field,
                  onChange,
                  rolesList,
                  roleType,
                  isValueFilled,
                  focused,
                  setFocused
                )
              ) : (
                <>
                  {["residence_state", "mailing_state"].includes(field.key)
                    ? renderStateSelect(
                        field,
                        onChange,
                        language_code,
                        handleSearch,
                        stateList,
                        isValueFilled,
                        focused,
                        setFocused,
                        clearStateSearch
                      )
                    : renderSelect({
                        field,
                        onChange,
                        focused,
                        setFocused,
                        isValueFilled,
                        globleCodes,
                        agentRanks,
                        locationsList,
                        stateList,
                      })}
                </>
              )}
            </>
          )}
        </BaseCol>
      );
    }

    case "select":
      return (
        <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
          {field.key === "mailing_country" || field.key === "residence_country"
            ? renderCountrySelect(
                field,
                onChange,
                isValueFilled,
                focused,
                setFocused,
                countries,
                searchValue,
                handleCountrySearch
              )
            : null}

          {field.key !== "mailing_country" &&
            field.key !== "residence_country" &&
            renderSelect({
              field,
              onChange,
              globleCodes,
              locationsList,
              editKey,
              isValueFilled,
              focused,
              setFocused,
              handleSearch,
              companyDetails,
            })}
        </BaseCol>
      );
    case "radio": //password
      return (
        <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
          {renderRadio(field, onChange, language_code)}
        </BaseCol>
      );
    case "password": //password
      return (
        <>
          {!editKey ? (
            <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
              {renderPassword(
                field,
                onChange,
                language_code,
                isValueFilled,
                focused,
                setFocused
              )}
            </BaseCol>
          ) : null}
        </>
      );
    case "confirm_password": //password
      return (
        <>
          {!editKey ? (
            <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
              {renderConfirmPassword(
                field,
                onChange,
                language_code,
                password,
                confirm_password,
                isValueFilled,
                focused,
                setFocused
              )}
            </BaseCol>
          ) : null}
        </>
      );

    case "checkbox":
      return (
        <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
          {renderCheckbox(field, onChange, language_code)}
        </BaseCol>
      );
    case "phone":
      return (
        <BaseCol span={field?.span} xxl={4} xl={6} lg={8} md={12} xs={24}>
          {PhoneNumberInput(field, onChangePhone)}
        </BaseCol>
      );
    case "textarea":
      return (
        <BaseCol span={field?.span} xl={24} lg={24} md={24} xs={24}>
          {renderTextArea(
            field,
            onChange,
            language_code,
            isValueFilled,
            focused,
            setFocused
          )}
        </BaseCol>
      );
    case "button":
      return (
        <BaseCol span={field?.span} xxl={4} xl={8} lg={8} md={12} xs={24}>
          {renderButton(field, "default", language_code)}
        </BaseCol>
      );
    case "file_upload":
      return <BaseCol span={24}>{renderUpload(field)}</BaseCol>;
    default:
      return null;
  }
};

export const renderJobField = (label: string, value: any) => {
  return value ? (
    <Flex align="center" gap={5} className="job-fields-info">
      <strong>{label}: </strong>
      <span>{value}</span>
    </Flex>
  ) : null;
};
