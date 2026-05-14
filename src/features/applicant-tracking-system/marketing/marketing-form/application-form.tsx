// @ts-nocheck
import {
  BaseButton,
  BaseButtonsForm,
  BaseCol,
  BaseRow,
} from "@deepak-pahwa/citywide-commonmodules";
import { Checkbox, Flex, Form, Row, Typography } from "antd";
import { convertToRaw, EditorState } from "draft-js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { renderPermitForm, renderPersonalInfoForm } from "./utils";
import { locationId, textTransformed } from "utils/common-function";
import { Field } from "utils/types";
import { UploadFile, UploadProps } from "antd/lib";
import { UploadChangeParam } from "antd/es/upload";
import { RcFile } from "antd/lib/upload";
import { Errornotify, Successnotify } from "utils/notification";
import { getJobRequest, uploadCv } from "services/api-services/ats-apis";
import draftToHtml from "draftjs-to-html";
import { ToastContainer } from "react-toastify";
import FileUploader from "components/FileUploader";
import {
  getAgentRanksList,
  getBeatsListData,
  getLocationList,
  getRolesData,
  getServiceListFromApi,
  getSitesListData,
  getStatesListData,
} from "services/api-services/commonApi";
import { employeeForm } from "../../../applicant-tracking-system/create-job-form/utils";
import getSymbolFromCurrency from "currency-symbol-map";
import { shiftSchedule } from "reference/employee/shiftData";
import { CopyOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import dayjs from "dayjs";
import { renderForm } from "./formBuiderUtils";
const { countries } = require("countries-list");

type Editortype = {
  description: EditorState;
};

interface Shift {
  label: string;
  id: string;
  type: string;
  key: string;
}

interface DaySchedule {
  day: string;
  shifts: {
    DayShift: Shift;
    SwingShift: Shift;
    NightShift: Shift;
  }[];
}

const { Title } = Typography;

const ApplicationForm = ({
  form,
  uuid,
  jobId,
  color,
  branch,
  jobDetails,
}: {
  form: any;
  uuid: string;
  jobId: string;
  color: string;
  branch: any;
  jobDetails: any;
}) => {
  const [focused, setFocused] = useState("");
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [loading, setLoading] = useState(false);
  const { companyDetails, globleCodes } = useSelector(
    (state: any) => state.auth
  );
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList, setFileList] = useState<any>([]);
  const [rawFileList, setRawFileList] = useState<any>([]);
  const [pdfLoader, setPdfLoader] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [editorData, setEditorData] = useState<Editortype[]>([
    {
      description: EditorState.createEmpty(),
    },
  ]);
  const [agentRanks, setAgentRanks] = useState<any[]>([]);
  const [locationsList, setLocationList] = useState<any[]>([
    { title: jobDetails?.[0]?.cl_name, id: jobDetails?.[0]?.job_location_id },
  ]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [userRolesList, setUserRolesList] = useState<any[]>([]);
  const { language_code } = useSelector((state: any) => state?.auth);
  const [beatsList, setBeatsList] = useState<any[]>([]);
  const [sitesList, setSitesList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentlocationCurrency, setCurrentLocationCurrency] = useState<any>(
    []
  );
  const [serviceList, setServiceList] = useState<any>([]);
  const [sameAsAbove, setSameAsAbove] = useState(false);

  const week_day_start = globleCodes["week_days"]?.find(
    ({ id, value }: { id: string; value: string }) =>
      value === companyDetails?.week_day_start ||
      String(id) === String(companyDetails?.week_day_start)
  );

  const is_employee_form_applicable = jobDetails
    ? Number(jobDetails?.[0]?.atsf_is_employee_fields ?? "")
    : "";

  function reorderSchedule(
    schedule: DaySchedule[],
    startDay: string
  ): DaySchedule[] {
    const startIndex = schedule.findIndex((day) => day.day === startDay);
    if (startIndex === -1) return schedule; // Return original if day not found

    return [...schedule.slice(startIndex), ...schedule.slice(0, startIndex)];
  }

  // Example usage:
  const schedule: DaySchedule[] = shiftSchedule;
  const startDay = week_day_start?.value; // Change this dynamically
  const newSchedule = schedule;

  // Extract header element from questions if it exists
  const headerElement = form?.questions?.find(
    (question) => question.static && question.text === "Header"
  );
  let isBadgeInValid = false;
  const editKey = false;

  const beat_id = Form.useWatch("beat_id", BaseFormMethod);
  const badge_number = Form.useWatch("badge_number", BaseFormMethod);
  const confirm_password = Form.useWatch("confirm_password", BaseFormMethod);

  const password = Form.useWatch("password", BaseFormMethod);
  const citizenship = Form.useWatch("citizenship", BaseFormMethod);
  const client_site = Form.useWatch("client_site", BaseFormMethod) || [];

  const location_ids = Form.useWatch("location_id", BaseFormMethod);
  const roleType_ = Form.useWatch("type", BaseFormMethod) || [];
  const roleType =
    typeof roleType_ === "string" ? roleType_?.split(",") : roleType_;
  const dateFormat = companyDetails?.date_format?.toUpperCase();

  const date_of_issue_ = Form.useWatch("date_of_issue", BaseFormMethod);

  // Filter out the header element from the questions array
  const formQuestions = form?.questions?.filter(
    (question: any) => !(question.static && question.text === "Header")
  );

  function resetDate(key: string) {
    if (key === "date_of_issue") {
      BaseFormMethod.setFieldValue("date_of_issue", null);
    } else {
      BaseFormMethod.setFieldValue("date_of_expiry", null);
    }
  }

  const onFinish = async (value: any) => {
    setLoading(true);
    const question_answers: any[] = [];
    formQuestions.forEach((item) => {
      if (
        item?.key?.toLowerCase()?.includes("mobile") ||
        item?.key?.toLowerCase()?.includes("phone")
      ) {
        question_answers.push({
          ...item,
          value: phoneNumber,
          key: item?.new_key,
        });
      } else if (value[item?.key]) {
        question_answers.push({
          ...item,
          value: value[item?.key],
          key: item?.new_key,
        });
      }
    });

    let allFields: any = [];

    let employeePayload: any = [];

    let payload: any = {
      form_data: {},
    };

    let mainShift: any = [];

    let shifts: any = {};

    employeeForm?.forEach((parent) => {
      allFields = [...allFields, ...parent?.fields];
      parent?.fields?.forEach((item: any) => {
        if (item?.fields?.length) {
          allFields = [
            ...allFields,
            ...item?.fields.map((field) => {
              return {
                ...field,
                groupByKey: item?.key,
                groupByName: item?.name,
              };
            }),
          ];
        }
      });
    });

    // available times payload
    Object.keys(value).forEach((key) => {
      if (!key.includes("Shift") && value[key]) {
        // If the key is not a shift key, it's the day name
        // Push the shifts object for the previous day (if any) into mainShift
        if (Object.keys(shifts).length > 0) {
          mainShift.push(shifts);
          shifts = {}; // Reset shifts object for the next day
        }

        shifts = {
          ...shifts,
        };

        if (shiftSchedule?.some((item: any) => item?.day === key)) {
          shifts.shift_day = key; // Set the day for the shifts object
          if (BaseFormMethod.getFieldValue(shifts.shift_day + "_Id")) {
            shifts.id = BaseFormMethod.getFieldValue(shifts.shift_day + "_Id");
          }
        }
      } else {
        // Populate shift times based on the key
        if (key.includes("dayShift") && value[key]?.length > 0) {
          shifts.shift_day_start_time = moment
            .utc()
            .format(`YYYY-MM-DDT${value[key]}:00Z`);
        }
        if (key.includes("nightShift") && value[key]?.length > 0) {
          shifts.shift_night_start_time = value[key]?.[0];
          shifts.shift_night_end_time = value[key]?.[1];
        }
        if (key.includes("swingShift") && value[key]?.length > 0) {
          shifts.shift_day_end_time = moment
            .utc()
            .format(`YYYY-MM-DDT${value[key]}:00Z`);
        }
      }
    });

    const daysArr = newSchedule?.map((item) => item?.day.toLowerCase());

    // employee payload
    Object.keys(value).forEach((key) => {
      if (!daysArr.includes(key.toLowerCase()) && value[key]) {
        const getFieldsData = allFields?.find((field) =>
          key.includes(field?.key)
        );

        if (!getFieldsData) return; // Skip if no matching field found

        const is_day_key = daysArr.some((item) =>
          getFieldsData.key?.includes(item)
        );

        if (is_day_key) return; // Skip if it's a day key

        const mapValues = (list: any[], ids: any[]) =>
          list
            .filter((item) => ids?.includes(String(item?.id)))
            .map((item) =>
              `${item?.site_id || item?.beat_id || ""} ${
                item?.site_name || item?.beat_description || item?.name || ""
              }`.trim()
            )
            .join(",");

        const formatDate = (date: any) =>
          date ? dayjs(date).format("MM/DD/YYYY") : "";

        const getMappedValue = (key: string, val: any) => {
          switch (true) {
            case key.includes("rank"):
              return mapValues(agentRanks, [val]);
            case key.includes("type"):
              const updatedTypeIDs = Array.isArray(val)
                ? val?.map((id: number) => String(id))
                : [];
              return mapValues(userRolesList, updatedTypeIDs);
            case key.includes("location_id"):
              return mapValues(companyDetails?.locations || [], val);
            case key.includes("beat_id"):
              const updatedBeatArr = val?.map((id: number) => String(id));
              return mapValues(beatsList, updatedBeatArr);
            case key.includes("client_site"):
              return mapValues(sitesList, val);
            case key.includes("date"):
              return formatDate(val);
            default:
              return val;
          }
        };

        let formData;

        const exceptKeys = ["reference_type", "email_address_alternate"];

        const hasExceptKeys = exceptKeys.some((checkKey) =>
          key.includes(checkKey)
        );

        if (hasExceptKeys) {
          const keySplit = key?.split("_");

          const init_key = `${keySplit[0]}_${keySplit[1]}`;

          const getFieldsData = allFields?.find((field) =>
            field?.key?.includes(init_key)
          );

          if (!getFieldsData) return; // Skip if no matching field found

          const is_day_key = daysArr.some((item) =>
            getFieldsData.key?.includes(item)
          );

          if (is_day_key) return; // Skip if it's a day key

          formData = {
            value: value[key],
            init_value: value[key],
            key: `${
              getFieldsData?.groupByKey ? getFieldsData?.groupByKey + "_" : ""
            }${key || getFieldsData.key}`,
            groupByKey: key || getFieldsData.key,
            content: getFieldsData.name ?? "",
            element:
              getFieldsData.key === "file" ? "upload" : getFieldsData.key ?? "",
            field_name: getFieldsData.name || getFieldsData.key,
            id: `${getFieldsData.id ?? ""}_${getFieldsData.key ?? ""}`,
            label: getFieldsData.name ?? "",
            text:
              getFieldsData.key === "file" ? "upload" : getFieldsData.key ?? "",
            groupByName: getFieldsData?.groupByName ?? "",
          };
        } else {
          formData = {
            value: getMappedValue(key, value[key]),
            init_value: value[key],
            key: `${
              getFieldsData?.groupByKey ? getFieldsData?.groupByKey + "_" : ""
            }${key || getFieldsData.key}`,
            groupByKey: key || getFieldsData.key,
            content: getFieldsData.name ?? "",
            element:
              getFieldsData.key === "file" ? "upload" : getFieldsData.key ?? "",
            field_name: getFieldsData.name || getFieldsData.key,
            id: `${getFieldsData.id ?? ""}_${getFieldsData.key ?? ""}`,
            label: getFieldsData.name ?? "",
            text:
              getFieldsData.key === "file" ? "upload" : getFieldsData.key ?? "",
            groupByName: getFieldsData?.groupByName ?? "",
          };
        }

        employeePayload.push(formData);
      }
    });

    employeePayload.push({
      label: "Available Times",
      key: "available_times",
      id: "available_times",
      value: mainShift,
    });

    const sourceType = value?.source_type || "Website";
    const statusType = value?.status || "sourced";

    Object.keys(value).forEach((key) => {
      form?.questions?.forEach((field) => {
        if (field?.key === key && field?.text === "Date Field") {
          payload.form_data[key] = moment.utc(value?.key).format("YYYY-MM-DD");
        }
        if (field?.key === key && field?.text === "File Upload") {
          payload.form_data[key] = rawFileList?.[0]?.url;
        }
      });
    });

    const get_value_keys = Object.keys(value);

    const first_name = get_value_keys?.find((item) =>
      item?.includes("first_name")
    );
    const last_name = get_value_keys?.find((item) =>
      item?.includes("last_name")
    );
    const email_name = get_value_keys?.find((item) => item?.includes("email"));

    payload = {
      company_id: jobDetails?.[0]?.job_company_id,
      location_id: Number(jobDetails?.[0]?.job_location_id),
      job_id: jobId,
      first_name: value?.[first_name],
      last_name: value?.[last_name],
      email: value?.[email_name],
      source_type: sourceType,
      status: statusType,
      form_data: is_employee_form_applicable
        ? { ...employeePayload }
        : { ...question_answers },
      file: rawFileList?.[0]?.file_url || "",
      notes: editorData[0]?.description.getCurrentContent().hasText()
        ? draftToHtml(
            convertToRaw(editorData[0]?.description?.getCurrentContent() || {})
          )
        : "",
    };
    const res: any = await getJobRequest(payload).finally(() =>
      setLoading(false)
    );
    if (res?.status === 201 || res?.status === 200) {
      Successnotify("Job applied successfully ");
      // window.location.href = `${CITY_V2}chs-jobs/${uuid}`;
      window.location.href = `/offer-link/${jobId}/${uuid}?applied=true`;
      BaseFormMethod.resetFields();
    } else {
      res?.data?.err?.errorMessage?.forEach((msg: any) => {
        Errornotify(msg?.message || "Something went wrong!");
      });
    }
  };

  const handleEditor = (editorState: any, editorIndex: number) => {
    setEditorData(
      editorData?.map((item: Editortype, index: number) => {
        if (index === editorIndex) {
          BaseFormMethod.setFieldsValue({
            [`Questions_${index}`]: editorState.getCurrentContent().hasText()
              ? editorState
              : undefined,
          });
          item = {
            ...item,
            description: editorState,
          };
        }
        return item;
      })
    );
  };

  const handleCountrySearch = (value: any) => {
    setSearchValue(value);
  };

  const clearStateSearch = () => {
    fetchStatesList("");
  };

  const onChangePhone = (...args: any) => {
    const [values, input_key] = args;
    setPhoneNumber(values[3]);
    BaseFormMethod.setFieldValue(input_key, values[3]);
  };

  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    setLoading(true);

    const files = file || {};
    if (files) {
      const newFileList = Array.from([files]).map((file: any) => ({
        uid: file.name,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
      }));
      setFileList((prevFileList) => [...prevFileList, ...newFileList]);
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("location_id", `${jobDetails?.[0]?.job_location_id}`);
    formData.append("company_id", `${jobDetails?.[0]?.job_company_id}`);
    formData.append("type", "resume");
    formData.append("uuid", uuid);
    try {
      const uploadRes = await uploadCv(formData).finally(() => {
        setLoading(false);
      });
      if (uploadRes?.status === 201 || uploadRes?.status === 200) {
        const newFileList = [
          {
            file_id: uploadRes?.data?.data[0]?.id,
            url: URL.createObjectURL(file),
            file_url: uploadRes?.data?.data[0]?.file_url,
          },
        ];
        setRawFileList((prev: any) => [...prev, ...newFileList]);

        formData.delete("file");
      }
    } catch (error) {
      Errornotify("Upload failed.");
      onError(error);
    }
  };

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isPdf = file?.type === "application/pdf";
    if (!isPdf) {
      Errornotify("You can only upload PDF file!");
    }
    const isLt50M = file.size / 1024 / 1024 <= 50;
    if (!isLt50M) {
      Errornotify("File size must be less than or equal to 50 MB!");
    }
    return isPdf && isLt50M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const getLocationInfo = async (zip: any, section: any) => {
    try {
      const response = {
        data: {
          status: "OK",
          results: [
            {
              address_components: [
                { long_name: "New York", short_name: "NYC", types: ["locality"] },
                { long_name: "New York", short_name: "NY", types: ["administrative_area_level_1"] },
                { long_name: "United States", short_name: "US", types: ["country"] },
              ],
            },
          ],
        },
      };
      if (response.data.status === "OK") {
        const results = response.data.results[0];
        const addressComponents = results.address_components;
        let city = "";
        let state = "";
        let country = "";

        addressComponents.forEach((component: any) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            state = component.short_name;
          } else if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        // for employee fields

        if (is_employee_form_applicable) {
          const city_key = section?.fields?.find((item: any) =>
            item?.key?.toLowerCase()?.includes("city")
          );
          const country_key = section?.fields?.find((item: any) =>
            item?.key?.toLowerCase()?.includes("country")
          );
          const state_key = section?.fields?.find((item: any) =>
            item?.key?.toLowerCase()?.includes("state")
          );

          BaseFormMethod.setFieldsValue({
            [city_key?.key]: city,
            [state_key?.key]: state,
            [country_key?.key]: country,
          });
        } else {
          // Set data as per dynamic form
          const city_key = form?.questions?.find((item: any) =>
            item?.label?.toLowerCase()?.includes("city")
          );
          const country_key = form?.questions?.find((item: any) =>
            item?.label?.toLowerCase()?.includes("country")
          );
          const state_key = form?.questions?.find((item: any) =>
            item?.label?.toLowerCase()?.includes("state")
          );
          BaseFormMethod.setFieldsValue({
            [city_key?.key]: city,
            [state_key?.key]: state,
            [country_key?.key]: country,
          });
        }

        setFocused("residence_city");
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("An error occurred while fetching location data");
    }
  };

  const fetchBeatsList = async (searchValue: any) => {
    const locations = Array.isArray(location_ids)
      ? location_ids?.join(",")
      : location_ids;
    const locationsArr = Array.isArray(location_ids)
      ? location_ids
      : [location_ids];

    const shortNames: any = [];
    locationsArr?.forEach((locationItem: string) => {
      const short_name_obj = companyDetails?.locations.find(
        (el: any) => el?.id == locationItem
      );
      shortNames.push({
        id: short_name_obj?.id,
        short_name: short_name_obj?.short_name,
      });
    });
    await getBeatsListData(locations, searchValue).then((result: any) => {
      if (result?.status === 200) {
        const { data } = result?.data || {};

        let beatModified = data?.map((item: any) => {
          return {
            ...item,
            beat_id: `${item.beat_id} (${
              shortNames.find(
                (el: any) => el?.id === parseInt(item?.location_id)
              )?.short_name
            })`,
          };
        });

        setBeatsList((prev) => [...beatModified]);
      }
    });
  };

  const fetchSitesList = async (searchValue?: any) => {
    const locations = Array.isArray(location_ids)
      ? location_ids?.join(",")
      : location_ids;

    const locationsArr = Array.isArray(location_ids)
      ? location_ids
      : [location_ids];

    const shortNames: any = [];

    locationsArr?.forEach((locationItem: string) => {
      const short_name_obj = companyDetails?.locations?.find(
        (el: any) => el.id == locationItem
      );

      shortNames.push({
        id: short_name_obj?.id,
        short_name: short_name_obj?.short_name,
      });
    });

    await getSitesListData(
      locations,
      companyDetails.id,
      searchValue ?? ""
    ).then((result: any) => {
      if (result?.status === 200) {
        const data = result?.data?.data;

        let siteModified = data?.sites?.map((item: any) => {
          return {
            ...item,
            site_name: `${item.site_name} (${
              shortNames.find(
                (el: any) => el?.id === parseInt(item?.location_id)
              )?.short_name
            })`,
          };
        });

        setSitesList((prev) => [...siteModified]);
      }
    });
  };

  const handleSearch = (newValue: string, inputKey: any) => {
    if (inputKey === "residence_state" || inputKey === "mailing_state") {
      fetchStatesList(newValue);
    }

    if (inputKey === "beat_id") {
      fetchBeatsList(newValue);
    }
    if (inputKey === "rank") {
      fetchRanksList(newValue);
    }
    if (inputKey === "client_site") {
      fetchSitesList(newValue);
    }
    // if (inputKey === "country") {
    //   searchCountry(newValue);
    //
  };

  const onChange = (e: any, section: any) => {
    if (e?.target?.id?.includes("zip")) {
      getLocationInfo(e?.target?.value, section);
    }
    if (
      e?.target?.id?.includes("branch") ||
      e?.target?.id?.includes("location")
    ) {
      fetchRolesList(e?.target?.value);
    }
  };

  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName);
    return !!value;
  };

  const handleRemoveFile = (index: any) => {
    const updatedFileList = fileList.filter(
      (item: any, fileIndex: any) => fileIndex !== index
    );

    const updatedRawFileList = rawFileList.filter(
      (item: any, fileIndex: any) => fileIndex !== index
    );

    setRawFileList(() => [...updatedRawFileList]);
    setFileList(() => [...updatedFileList]);
  };

  const fetchFileUrl = (url: any) => {
    const newFileList = [
      {
        file_id: url,
        file_url: url,
      },
    ];
    setRawFileList(newFileList);

    BaseFormMethod.setFieldsValue({
      file_upload: url,
    });
  };

  const renderUpload = (field: Field) => (
    <Form.Item
      key={"file_upload"}
      label={field?.label}
      name={"file_upload"}
      // rules={[{ required: true, message: "Please upload a PDF/DOC file!" }]}
      style={{
        width: "100%",
      }}
    >
      <FileUploader
        accept=".pdf,.doc"
        title="Upload Resume/CV"
        pdfPath={""}
        fetchFileUrl={fetchFileUrl}
        setLoader={setPdfLoader}
        is_edit={rawFileList?.length ? true : false}
        is_custom_edit={false}
        jobDetails={jobDetails}
      />
    </Form.Item>
  );

  const fetchStatesList = async (searchValue: any) => {
    await getStatesListData(searchValue, locationId).then((result: any) => {
      if (result?.status === 200) {
        const data = result?.data?.data;
        let stateModified = data?.map((item: any) => {
          return {
            ...item,
          };
        });

        setStateList((prev) => [...stateModified]);
      }
    });
  };

  const fetchRolesList = async (location?: string) => {
    await getRolesData(location ? location : locationId)?.then(
      (result: any) => {
        if (result && result?.status === 200) {
          const rolesList = result?.data?.data || {};
          setUserRolesList((prev) => [...rolesList]);
        }
      }
    );
  };

  const fetchRanksList = async (searchValue: any) => {
    const codeResponse: any = await getAgentRanksList(
      locationId,
      1,
      searchValue
    );
    const { data } = codeResponse?.data?.data || {};
    if (data) {
      let ranksModified = data?.map((item: any) => {
        return {
          ...item,
        };
      });
      setAgentRanks(() => [...ranksModified]);
    }
  };

  const fetchLocationValues = async () => {
    const response = await getLocationList();
    if (response?.status === 200) {
      const { locations } = response?.data?.data;
      let locationModified = locations?.map((item: any) => ({
        id: item?.id,
        title: item?.name,
      }));
      setLocationList(() => [...locationModified]);
    }
  };

  const fetchServiceList = async (search: any) => {
    await getServiceListFromApi(locationId, search).then((response: any) => {
      let serviceListModified = response.data.data?.map((item: any) => {
        return {
          ...item,
        };
      });
      setServiceList(() => [...serviceListModified]);
    });
  };

  const handleServiceList = (value: any) => {
    fetchServiceList(value);
  };

  const week_day = week_day_start?.value
    ? week_day_start?.value?.toLowerCase()
    : "";

  const monday_dayshift_ =
    Form.useWatch(`monday_dayShift`, BaseFormMethod) || [];

  const monday_swingShift =
    Form.useWatch(`monday_swingShift`, BaseFormMethod) || [];

  const handleCopyTimeToDays = (evt: any) => {
    if (monday_dayshift_?.length) {
      newSchedule?.forEach((item) => {
        BaseFormMethod?.setFieldsValue({
          [item?.shifts?.[0]?.DayShift?.id]: monday_dayshift_,
          [item?.shifts?.[0]?.SwingShift?.id]: monday_swingShift,
          [item?.day]: true,
        });
      });
    } else {
      newSchedule?.forEach((item) => {
        BaseFormMethod?.setFieldsValue({
          [item?.shifts?.[0]?.DayShift?.id]: "",
          [item?.shifts?.[0]?.SwingShift?.id]: "",
          [item?.day]: false,
        });
      });
    }
  };

  const replicateMailingAddress = async (section: any) => {
    let currentAddress = section?.fields?.find(
      (item: any) => item?.sectionName === "residence_address"
    );
    let mailingAddress = section?.fields?.find(
      (item: any) => item?.sectionName === "mailing_address"
    );

    // Check if both current and mailing address sections exist
    if (currentAddress && mailingAddress) {
      // Iterate through fields of the current address
      for (let index = 0; index < currentAddress.fields.length; index++) {
        const currentField = currentAddress?.fields[index];
        const mailingField = mailingAddress?.fields[index];

        // Check if the mailing field exists and has a key
        if (mailingField && mailingField.key) {
          try {
            // Get the value from the current address field asynchronously
            const valueToSet = await BaseFormMethod.getFieldValue(
              currentField.key
            );

            // Set the value for the corresponding mailing address field asynchronously
            await BaseFormMethod.setFieldValue(mailingField.key, valueToSet);

            BaseFormMethod.validateFields();
            // Optionally, set focus to the mailing field
            setFocused(mailingField.key);
          } catch (error) {
            console.error("Error:", error);
            // Handle error if necessary
          }
        }
      }
    }
  };

  const removeMailingAddress = (section: any) => {
    let mailingAddress = section?.fields?.find(
      (item: any) => item?.sectionName === "mailing_address"
    );
    let data: any = [];
    mailingAddress?.fields?.forEach((currentField: any, index: any) => {
      const mailingFieldKey = mailingAddress?.fields?.[index]?.key;
      if (mailingFieldKey) {
        data.push(mailingFieldKey);
      }
    });
    data && BaseFormMethod.resetFields(data);
  };

  const handleCheckboxChange = (e: any, section: any) => {
    setSameAsAbove(e.target.checked);

    if (e.target.checked) {
      replicateMailingAddress(section);
    } else {
      removeMailingAddress(section);
    }
  };

  const renderTimePicker = (field: any, day: any, prevShiftValue?: any) => {
    const validateDayShift = async (_: any, value: any) => {
      return Promise.resolve();
    };
    const validateTimeRange = async (_: any, value: any) => {
      const previousEndTime = prevShiftValue[1]; // Get the previous end time
      if (!value || !prevShiftValue[1]) {
        return Promise.resolve();
      }

      const startTime = value[0];

      const endTime = value[1];

      // Extract time portions from the moment objects
      const previousEndTimeTime = moment(new Date(previousEndTime)).format(
        "HH:mm"
      );

      const startTimeTime = moment(new Date(startTime)).format("HH:mm");

      // Compare only the time portion of the start time with the previous end time
      if (startTimeTime <= previousEndTimeTime) {
        return Promise.reject(
          "Start time must be greater than the previous end time"
        );
      }
      // Check if the end time is greater than the start time
      if (endTime <= startTime) {
        return Promise.reject("End time must be greater than the start time");
      }

      return Promise.resolve();
    };

    return (
      <Form.Item
        key={field.id}
        name={field.id}
        rules={
          !field?.id?.includes("dayShift") && prevShiftValue?.length > 0
            ? [{ validator: validateTimeRange }]
            : [{ validator: validateDayShift }]
        }
        className="available-table-data"
      >
        <input
          placeholder={"HH:MM"}
          type="time"
          className="c-w-full CHS-input custom-time-input"
        />
      </Form.Item>
    );
  };

  // useEffect(() => {
  //   if (locationId) {
  //     fetchRolesList();
  //   }
  // }, [locationId]);

  // useEffect(() => {
  //   if (locationId) {
  useEffect(() => {
    if (jobDetails?.[0]?.cl_name) {
      setLocationList([
        {
          title: jobDetails?.[0]?.cl_name,
          id: jobDetails?.[0]?.job_location_id,
        },
      ]);
      BaseFormMethod.setFieldsValue({
        branches_branches: jobDetails?.[0]?.cl_name,
      });
      setFocused("branches_branches");
      BaseFormMethod.setFieldsValue({
        location_id: jobDetails?.[0]?.cl_name,
      });
      setFocused("location_id");
    }
  }, [jobDetails]);

  useEffect(() => {
    fetchStatesList("");
  }, []);

  return (
    <Form
      form={BaseFormMethod}
      onFinish={onFinish}
      layout="vertical"
      className="Job-details-form"
    >
      <Flex vertical gap={5} className="c-mb-3 job-application-header">
        <h2>Job Application Form</h2>
        <p>Please fill out the form below to submit your job application!</p>
      </Flex>

      {is_employee_form_applicable ? (
        employeeForm?.map((section: any) => {
          switch (section.key) {
            case "personal_info":
              return (
                <>
                  {section?.fields?.map((item: any) => (
                    <div key={item.sectionName} className="base-card form-card">
                      <Flex justify="space-between" className="primary-heading">
                        {item?.sectionName && (
                          <>{textTransformed(item?.sectionName)}</>
                        )}

                        {item?.sectionName === "mailing_address" && (
                          <div className="same-above-desktop">
                            <Checkbox
                              onChange={(evt: CheckboxChangeEvent) =>
                                handleCheckboxChange(evt, section)
                              }
                              checked={sameAsAbove}
                            >
                              Same as above
                            </Checkbox>
                          </div>
                        )}
                      </Flex>
                      <div className="base-card-body">
                        {item?.sectionName === "mailing_address" && (
                          <div className="same-above-mobile">
                            <Checkbox
                              onChange={handleCheckboxChange}
                              checked={sameAsAbove}
                            >
                              Same as above
                            </Checkbox>
                          </div>
                        )}
                        <BaseRow gutter={16}>
                          {item?.fields?.map((field: any) => (
                            <React.Fragment key={field.key || field.name}>
                              {renderPersonalInfoForm(
                                field,
                                onChange,
                                globleCodes,
                                language_code,
                                editKey,
                                password,
                                confirm_password,
                                userRolesList,
                                agentRanks,
                                onChangePhone,
                                handleSearch,
                                roleType,
                                BaseFormMethod,
                                beatsList,
                                sitesList,
                                locationsList,
                                stateList,
                                focused,
                                setFocused,
                                isValueFilled,
                                citizenship,
                                countries,
                                searchValue,
                                handleCountrySearch,
                                clearStateSearch,
                                beat_id,
                                client_site,
                                renderUpload,
                                companyDetails,
                                item
                              )}
                            </React.Fragment>
                          ))}
                        </BaseRow>
                      </div>
                    </div>
                  ))}
                </>
              );

            case "guard_information":
              return section?.fields?.map((item: any) => (
                <div key={item.name} className="base-card form-card">
                  <Flex justify="space-between" className="primary-heading">
                    {item?.name && <>{textTransformed(item?.name)}</>}
                  </Flex>
                  <div className="base-card-body">
                    <BaseRow gutter={16}>
                      {item?.fields?.length > 0 &&
                        item?.fields?.map((field: any, index: number) => {
                          return (
                            <>
                              {renderPermitForm(
                                field,
                                onChange,
                                agentRanks,
                                handleSearch,
                                12,
                                globleCodes,
                                serviceList,
                                handleServiceList,
                                dateFormat,
                                getSymbolFromCurrency(
                                  currentlocationCurrency || "USD"
                                ),
                                focused,
                                setFocused,
                                isValueFilled,
                                resetDate,
                                item,
                                stateList
                              )}
                            </>
                          );
                        })}
                    </BaseRow>
                  </div>
                </div>
              ));

            case "available_time":
              return (
                <div className="base-card form-card">
                  <div>
                    <Flex justify="space-between" className="primary-heading">
                      {section?.name && <>{textTransformed(section?.name)}</>}
                    </Flex>
                  </div>
                  <div className="base-card-body">
                    <BaseRow gutter={16}>
                      <BaseCol xl={12} lg={12} md={24} xs={24}>
                        <div className="employee-shift-table c-m-0">
                          <div className="employee-shift-data">
                            <Row
                              justify="center"
                              className="shift-table-header"
                              gutter={0}
                            >
                              <BaseCol span={8}>
                                <div className="table-headings">Days</div>
                              </BaseCol>
                              <BaseCol span={12} className="dayTimeShift">
                                <div className="table-headings">
                                  Day Shift time
                                </div>
                              </BaseCol>
                              <BaseCol
                                span={4}
                                className="table-headings c-flex c-justify-end"
                              >
                                <Form.Item
                                  name={"select_all"}
                                  //key={index}
                                  valuePropName="checked"
                                >
                                  <CopyOutlined
                                    // disabled={monday_dayshift_?.length ? false : true}
                                    onClick={handleCopyTimeToDays}
                                    style={{
                                      color: "#fff",
                                    }}
                                  />
                                </Form.Item>
                              </BaseCol>
                            </Row>

                            {newSchedule.map((shiftItem: any, index) => {
                              return (
                                <Row gutter={0} justify="start">
                                  <BaseCol span={8}>
                                    <Form.Item
                                      name={shiftItem.day}
                                      key={index}
                                      valuePropName="checked"
                                      className="available-table-data"
                                    >
                                      <Checkbox onChange={onChange}>
                                        {shiftItem.day}
                                      </Checkbox>
                                    </Form.Item>
                                  </BaseCol>

                                  {shiftItem?.shifts.map(
                                    (item: any, index: any) => {
                                      return (
                                        <>
                                          <BaseCol
                                            span={8}
                                            key={index}
                                            className="dayTimeShift"
                                          >
                                            {renderTimePicker(
                                              item.DayShift,
                                              shiftItem?.day
                                            )}
                                          </BaseCol>
                                          <BaseCol
                                            span={8}
                                            key={index}
                                            className="dayTimeShift"
                                          >
                                            {renderTimePicker(
                                              item.SwingShift,
                                              shiftItem?.day
                                            )}
                                          </BaseCol>
                                        </>
                                      );
                                    }
                                  )}
                                </Row>
                              );
                            })}
                          </div>
                        </div>
                      </BaseCol>
                    </BaseRow>
                  </div>
                </div>
              );

            case "references":
              return (
                <div className="base-card form-card">
                  <div>
                    <Flex justify="space-between" className="primary-heading">
                      {section?.name && <>{textTransformed(section?.name)}</>}
                    </Flex>
                  </div>
                  <div className="base-card-body">
                    <BaseRow gutter={16}>
                      {section?.fields?.length > 0 &&
                        section?.fields?.map((field: any, index: number) => {
                          return (
                            <>
                              {renderPermitForm(
                                field,
                                onChange,
                                agentRanks,
                                handleSearch,
                                12,
                                globleCodes,
                                serviceList,
                                handleServiceList,
                                dateFormat,
                                getSymbolFromCurrency(
                                  currentlocationCurrency || "USD"
                                ),
                                focused,
                                setFocused,
                                isValueFilled,
                                resetDate,
                                section,
                                [],
                                onChangePhone
                              )}
                            </>
                          );
                        })}
                    </BaseRow>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })
      ) : (
        <div className="base-card form-card">
          <div className="base-card-body">
            <Row gutter={[16, 16]}>
              {formQuestions?.map((question: any) =>
                renderForm({
                  field: question,
                  onChange: onChange,
                  focused: focused,
                  setFocused: setFocused,
                  isValueFilled: isValueFilled,
                  handleEditor: handleEditor,
                  languageCode: companyDetails?.language_code,
                  editorData: editorData,
                  customRequest: handleUpload,
                  renderUpload,
                  onChangePhone,
                  globleCodes,
                  agentRanks,
                  locationsList,
                  stateList,
                  userRolesList,
                  roleType,
                  branch,
                })
              )}
            </Row>
          </div>
        </div>
      )}

      <Flex justify="end" gap={8} className="c-mt-2">
        <BaseButton
          type="primary"
          loading={loading}
          htmlType="submit"
        >
          Apply
        </BaseButton>
      </Flex>
      <ToastContainer
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Form>
  );
};

export default ApplicationForm;
