// @ts-nocheck
import {
  BaseButton,
  BaseButtonsForm,
} from "@deepak-pahwa/citywide-commonmodules";
import { Col, Flex, Form, List, Row, Spin, Typography } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getCandidateDetail,
  getJobOfferDetail,
  onBoardApllicationApi,
} from "services/api-services/ats-apis";
import {
  CITY_V2,
  DIGITALOCEAN_SPACES_ENDPOINT_ACCESS,
} from "services/api-services/constants";
import { Errornotify, Successnotify } from "utils/notification";
import { employeeOnboard } from "./utils";
import { renderFormOnboarding } from "./utils2";
import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import {
  getBeatsListData,
  getEmployeePreviousBadge,
  getLocationList,
  getRolesData,
  getSitesListData,
} from "services/api-services/commonApi";
import { locationId, serializeDateWithoutUTC } from "utils/common-function";
import useModulePermission from "utils/useModulePermission";
import { formatKey } from "utils/common-function";
import { simplifyFormData } from "../../common-ats-functions/utils";

export default function OnboardingDetailPage() {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [candidate, setCandidate] = useState<any>();
  const [jobOfferDetail, setJobOfferDetail] = useState<any>();
  const [userRolesList, setUserRolesList] = useState<any[]>([]);
  const [beatsList, setBeatsList] = useState<any[]>([]);
  const [sitesList, setSitesList] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const { id, jobId } = useParams();
  const { Title } = Typography;
  const [status, setStatus] = useState<string>("");
  const [notes, setComments] = useState<string>("");
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const first_name = Form.useWatch("first_name", BaseFormMethod) || "";

  const beat_id = Form.useWatch("beat_id", BaseFormMethod);
  const badge_number = Form.useWatch("badge_number", BaseFormMethod);
  const confirm_password = Form.useWatch("confirm_password", BaseFormMethod);
  const [locationsList, setLocationList] = useState<any[]>([]);

  const password = Form.useWatch("password", BaseFormMethod);
  const citizenship = Form.useWatch("citizenship", BaseFormMethod);
  const roleType_ = Form.useWatch("type", BaseFormMethod) || [];
  const client_site = Form.useWatch("client_site", BaseFormMethod) || [];
  const roleType =
    typeof roleType_ === "string" ? roleType_?.split(",") : roleType_;
  const { globleCodes, companyDetails } = useSelector(
    (state: any) => state.auth
  );

  const employeePermission = useModulePermission("admin/employee");

  const short_name = companyDetails?.locations.find(
    (el: any) => el.id == locationId
  )?.short_name;

  const fetchJobOfferDetail = async () => {
    setLoading(true);
    try {
      const response = await getJobOfferDetail(id, jobId).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setJobOfferDetail(response?.data?.data);
        setStatus(response?.data?.data.status);
        setComments(response?.data?.data?.notes);
      }
    } catch (error) {
      console.log(error);
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

  const fetchPreviousEmployee = async () => {
    await getEmployeePreviousBadge(locationId)
      .then((response: any) => {
        const { data } = response?.data;
        if (response?.status === 200) {
          BaseFormMethod.setFieldValue("badge_number", data?.toString());
        }
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchPreviousEmployee();
  }, []);

  useEffect(() => {
    fetchJobOfferDetail();
  }, []);

  const fetchCandidateData = async () => {
    setLoading(true);
    try {
      const response = await getCandidateDetail(id).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setCandidate(response?.data?.data);
        for (const key in [response?.data?.data]) {
          // BaseFormMethod.setFieldValue(key, [response?.data?.data][key]);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCandidateData();
  }, []);

  const simplifiedData = simplifyFormData(candidate?.form_data)
    ?.filter((field: any) => field?.key !== "password")
    ?.map((field: any) => ({
      ...field,
      key:
        field.key === "location_id"
          ? "location"
          : field.key === "beat_id"
          ? "beat"
          : field.key,
    }));
  const getLocationInfo = async (zip: any, addressType: any) => {
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
      if (response?.data.status === "OK") {
        const results = response?.data.results[0];
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

        if (addressType === "residence") {
          BaseFormMethod.setFieldValue("residence_city", city);
          setFocused("residence_city");
          BaseFormMethod.setFieldValue("residence_state", state);
          BaseFormMethod.setFieldValue("residence_country", country);
        } else {
          BaseFormMethod.setFieldValue("mailing_city", city);
          setFocused("mailing_city");
          BaseFormMethod.setFieldValue("mailing_state", state);
          BaseFormMethod.setFieldValue("mailing_country", country);
        }
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("An error occurred while fetching location data");
    }
  };

  const onChange = (e: any, type: string) => {
    if (e?.target?.id === "residence_zip_code") {
      getLocationInfo(e?.target?.value, "residence");
    }

    let site_arr: string[] = [];
    let beat_arr: string[] = [];

    if (type === "roleType") {
      e.forEach((role: string) => {
        if (userRolesList?.find((el: any) => el?.id === role)?.is_site) {
          site_arr?.push(role);
        }

        if (userRolesList?.find((el: any) => el?.id === role)?.is_beat) {
          beat_arr.push(role);
        }
      });

      if (!site_arr?.length) {
        BaseFormMethod.setFieldValue("client_site", null);
      }

      if (!beat_arr?.length) {
        BaseFormMethod.setFieldValue("beat_id", null);
      }
    }
  };
  const handleSearch = (newValue: string, inputKey: any) => {
    if (inputKey === "beat_id") {
      fetchBeatsList(newValue);
    }

    if (inputKey === "client_site") {
      fetchSitesList(newValue);
    }
  };
  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName);
    return !!value;
  };

  const arrayToObject = (array) =>
    array.reduce((acc, item) => {
      if (item.key === "date_of_birth") {
        acc["birthdate"] = item.value ? dayjs(item.value) : "";
      } else if (item.key === "type") {
        acc["type"] = item.init_value ?? [];
      } else {
        acc[item.key] = item.value;
      }
      return acc;
    }, {});

  const handleFillform = () => {
    const form_fill_data = arrayToObject(simplifiedData);
    const findKey = Object.keys(form_fill_data)?.find((item) =>
      item.includes("phone")
    );
    const findBirthDayKey = Object.keys(form_fill_data)?.find((item) =>
      item.includes("birth")
    );
    const findStateKey = Object.keys(form_fill_data)?.find((item) =>
      item.includes("state")
    );
    const findCityKey = Object.keys(form_fill_data)?.find((item) =>
      item.includes("city")
    );
    const findZipKey = Object.keys(form_fill_data)?.find((item) =>
      item.includes("zip")
    );
    const cleanedNumber = form_fill_data?.[findKey]?.replace(/[^0-9]/g, "");
    setPhoneNumber(() => form_fill_data?.[findKey]);
    BaseFormMethod.setFieldsValue({
      ...form_fill_data,
      birthdate: form_fill_data?.[findBirthDayKey]
        ? dayjs(form_fill_data?.[findBirthDayKey])
        : "",
      main_phone: cleanedNumber ?? "",
      residence_state: form_fill_data?.[findStateKey] ?? "",
      residence_city: form_fill_data?.[findCityKey] ?? "",
      residence_zip_code: form_fill_data?.[findZipKey] ?? "",
    });
  };

  const fetchRolesList = async () => {
    await getRolesData(locationId)?.then((result: any) => {
      if (result && result?.status === 200) {
        const rolesList = result?.data?.data || {};
        setUserRolesList((prev) => [...rolesList]);
      }
    });
  };

  const fetchSitesList = async (searchValue: any) => {
    await getSitesListData(locationId, companyDetails?.id, searchValue).then(
      (result: any) => {
        if (result?.status === 200) {
          const data = result?.data?.data;

          let siteModified = data?.sites?.map((item: any) => {
            return {
              ...item,
            };
          });

          setSitesList((prev) => [...siteModified]);
        }
      }
    );
  };

  const fetchBeatsList = async (searchValue: any) => {
    await getBeatsListData(locationId, searchValue).then((result: any) => {
      if (result?.status === 200) {
        const { data } = result?.data || {};

        let beatModified = data?.map((item: any) => {
          return {
            ...item,
          };
        });

        setBeatsList((prev) => [...beatModified]);
      }
    });
  };

  function removeSuffix(str: String, suffix: String) {
    return str?.replace(new RegExp(`_${suffix}$`), "");
  }

  const onChangePhone = (...args: any) => {
    const [values, input_key] = args;
    setPhoneNumber(values[3]);
    BaseFormMethod.setFieldValue(input_key, values[3]);
  };

  const onFinish = async (values: any) => {
    const form_fill_data = arrayToObject(simplifiedData);
    if (!employeePermission?.permission?.create) {
      Errornotify("You don't have permission to onboard applicant!");
      return;
    }
    setLoading(true);
    const keysToBeSplit = [
      "type",
      "gender",
      "beat_id",
      "client_site",
      "location_id",
    ];

    let formated_birth_Date = serializeDateWithoutUTC(values?.birthdate);

    for (const key in values) {
      if (keysToBeSplit?.includes(key) && typeof values?.[key] === "object") {
        values[key] = values?.[key]?.join(",");
      }
      if (!values["beat_id"]) {
        values["beat_id"] = "";
      }
      if (!values["client_site"]) {
        values["client_site"] = "";
      }
      if (key === "main_phone" && phoneNumber) {
        values["main_phone"] = phoneNumber;
      }
    }

    if (!candidate?.form_data) return;
    // Filter only objects related to "driver_license"

    const permitKeys = [
      "driver_license",
      "guard_card",
      "firearms",
      "baton",
      "ecd",
      "oc",
      "other_permit",
    ];

    let permitData: any = [];

    const employeeFields = {};

    Object.values(candidate?.form_data)?.forEach((item: any) => {
      employeeFields[item?.key] = item?.value;
      if (
        item?.element?.includes("reference") ||
        item?.key.includes("reference")
      ) {
        if (item?.key.includes("reference_email_references")) {
          values.reference_email = item.value;
        } else {
          values[item.element] = item.value;
        }
      }

      if (permitKeys?.includes(item?.text)) {
        const permitOriginalKey = permitKeys?.find((permitKey) =>
          item?.text?.includes(permitKey)
        );

        const keyWithoutSuffix = removeSuffix(item.key, permitOriginalKey);

        // Find existing permit entry or create a new one
        let existingPermit = permitData.find(
          (p) => p.permitKey === permitOriginalKey
        );

        if (!existingPermit) {
          existingPermit = { permitKey: permitOriginalKey };
          permitData.push(existingPermit);
        }

        existingPermit[keyWithoutSuffix] = item?.value;
        existingPermit.type = keyWithoutSuffix;
      }
    });

    let payload = {
      ...employeeFields,
      ...values,
      company_id: companyDetails?.id,
      badge_number: BaseFormMethod.getFieldValue("badge_number"),
      birthdate: formated_birth_Date,
      candidate_id: id,
    };

    if (permitData?.length) {
      payload.permit = permitData;
    }

    if (payload?.status) {
      delete payload?.status;
    }
    const response: any = await onBoardApllicationApi(payload).finally(() => {
      setLoading(false);
    });

    if (response.status === 200) {
      Successnotify("Onboarding completed successfully!");
      if (employeePermission?.permission?.edit) {
        window.location.href = `${CITY_V2}admin/edit-employee/${response?.data?.data?.user_id}`;
      } else {
        Errornotify("You don't have permission to update this applicant!");
        return;
      }
    } else {
      response?.data?.err?.errorMessage?.forEach((msg: any) => {
        Errornotify(msg?.message || "Something went wrong!");
      });
    }
  };

  useEffect(() => {
    fetchRolesList();
    fetchSitesList("");
    fetchBeatsList("");
    fetchLocationValues();
  }, []);

  useEffect(() => {
    BaseFormMethod.setFieldValue("location_id", [locationId + ""]);
  }, [locationId]);

  const form_props: any = {
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
    BaseFormMethod,
    handleSearch,
    locationsList,
    onChangePhone,
  };

  const remove_keys = ["upload_cv", "upload", "file_upload"];

  return (
    <div>
      <div className="base-card">
        <Flex justify="space-between" className="page-heading">
          <h1 className="heading-text">
            <a className="backIcon" href={`${CITY_V2}admin/ats/candidates`}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            Onboarding
          </h1>
          <BaseButton
            type="default"
            className="secondary"
            href={`${CITY_V2}admin/ats/candidates`}
          >
            Back
          </BaseButton>
        </Flex>
        <div className="base-card-body">
          {loading ? (
            <div className="center-loader">
              <Spin />
            </div>
          ) : jobOfferDetail ? (
            <>
              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col xs={24} md={12}>
                  <div className="applicant-info">
                    <Flex
                      justify="space-between"
                      className="header page-heading"
                    >
                      <div className="heading-text">Applicant Details</div>
                      <BaseButton loading={loading} onClick={handleFillform}>
                        Fill form
                      </BaseButton>
                    </Flex>

                    <List
                      itemLayout="horizontal"
                      style={{ listStyle: "none !important", padding: 10 }}
                      dataSource={[
                        ...simplifiedData.map((field: any) => ({
                          ...field,
                        })),
                        {
                          key: "resume",
                          label: "CV",
                        },
                      ]}
                      renderItem={(value: any) => {
                        const formattedValue =
                          typeof value?.value === "object" &&
                          !value?.value.file &&
                          value?.value?.blocks?.length
                            ? value?.value?.blocks
                                .map((block: any) => block?.text)
                                .join(" ")
                            : value?.value;
                        return (
                          !remove_keys.includes(value?.key) && (
                            <List.Item>
                              <div
                                className={`${
                                  value?.key === "available_times"
                                    ? "available-times"
                                    : ""
                                } candidate-onboard`}
                                key={value?.id}
                              >
                                <strong className="candidate-label">
                                  {formatKey(
                                    value.key.includes("residence")
                                      ? `Residence ${value?.field_name}`
                                      : value.key.includes("mailing")
                                      ? `Mailing ${value?.field_name}`
                                      : value?.key
                                  )}{" "}
                                  -
                                </strong>
                                {(() => {
                                  if (
                                    value?.key === "date_of_birth" ||
                                    value?.key === "dob" ||
                                    value?.key?.toLowerCase().includes("birth")
                                  ) {
                                    return dayjs(formattedValue).format(
                                      "MM/DD/YYYY"
                                    );
                                  }
                                  if (
                                    value?.key === "available_times" &&
                                    Array.isArray(value?.value)
                                  ) {
                                    return (
                                      <Row
                                        className="list-none c-w-full"
                                        key={value?.id}
                                      >
                                        {value?.value.map(
                                          (shift: any, index: number) => {
                                            const shiftDay =
                                              shift?.shift_day ?? "N/A";
                                            const startTime =
                                              shift?.shift_day_start_time
                                                ? moment
                                                    .utc(
                                                      shift.shift_day_start_time
                                                    )
                                                    .format("HH:mm")
                                                : null;
                                            const endTime =
                                              shift?.shift_day_end_time
                                                ? moment
                                                    .utc(
                                                      shift.shift_day_end_time
                                                    )
                                                    .format("HH:mm")
                                                : "N/A";

                                            return (
                                              <Col
                                                span={12}
                                                key={index}
                                                className="mb-1"
                                              >
                                                <strong>
                                                  {`${shiftDay} `}:
                                                </strong>
                                                <strong
                                                  style={{
                                                    fontWeight: "normal",
                                                  }}
                                                >
                                                  {startTime} - {endTime}
                                                </strong>
                                              </Col>
                                            );
                                          }
                                        )}
                                      </Row>
                                    );
                                  }

                                  if (
                                    value?.key === "resume" &&
                                    candidate?.file
                                  ) {
                                    return (
                                      <div className="resume-view">
                                        {candidate?.file &&
                                        candidate?.file.endsWith(".pdf") ? (
                                          <Worker workerUrl="/pdf.worker.min.js">
                                            <Viewer
                                              initialPage={1}
                                              fileUrl={
                                                candidate?.file
                                                  ? `${DIGITALOCEAN_SPACES_ENDPOINT_ACCESS}${candidate.file}`
                                                  : []
                                              }
                                              defaultScale={0.5}
                                            />
                                          </Worker>
                                        ) : candidate?.file &&
                                          candidate?.file.endsWith(".doc") ? (
                                          <div style={{ paddingLeft: "70px" }}>
                                            <embed
                                              id="embed-id"
                                              type="application/pdf"
                                              onClick={() => {
                                                alert("inner");
                                              }}
                                              src={`${encodeURIComponent(
                                                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS +
                                                  candidate?.file
                                              )}&embedded=true`}
                                              original-url={`${encodeURIComponent(
                                                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS +
                                                  candidate?.file
                                              )}&embedded=true`}
                                              // background-color="4283586137"
                                              style={{
                                                width: "320px",
                                                height: "400px",
                                              }}
                                            />
                                          </div>
                                        ) : candidate?.file &&
                                          candidate?.file.endsWith(".docx") ? (
                                          <div style={{ paddingLeft: "70px" }}>
                                            <embed
                                              id="embed-id"
                                              type="application/pdf"
                                              onClick={() => {
                                                alert("inner");
                                              }}
                                              src={`${encodeURIComponent(
                                                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS +
                                                  candidate?.file
                                              )}&embedded=true`}
                                              original-url={`${encodeURIComponent(
                                                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS +
                                                  candidate?.file
                                              )}&embedded=true`}
                                              // background-color="4283586137"
                                              style={{
                                                width: "320px",
                                                height: "400px",
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    );
                                  }

                                  if (
                                    typeof formattedValue === "object" &&
                                    !value?.value.file
                                  ) {
                                    if (Array.isArray(value?.value)) {
                                      return value?.value.join(", ");
                                    }

                                    if (value?.value?.blocks?.length) {
                                      return value?.value.blocks
                                        .map((block) => block.text)
                                        .join(" ");
                                    }
                                    return value?.value || "N/A";
                                  }

                                  if (value?.key === "location") {
                                    return value?.init_value;
                                  }

                                  return (
                                    (!value?.value?.file && formattedValue) ||
                                    "N/A"
                                  );
                                })()}
                              </div>
                            </List.Item>
                          )
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Form
                    onFinish={onFinish}
                    layout="vertical"
                    className="onboarding-form"
                    form={BaseFormMethod}
                  >
                    <h2 className="form-title">{"Employee Onboard Form"}</h2>
                    <Row gutter={16}>
                      {employeeOnboard?.map((value: any) =>
                        renderFormOnboarding({
                          field: value,
                          ...form_props,
                        })
                      )}
                    </Row>
                    <Flex justify="end" gap={8}>
                      <BaseButton
                        type="primary"
                        loading={loading}
                        htmlType="submit"
                      >
                        On board
                      </BaseButton>
                    </Flex>
                  </Form>
                </Col>
              </Row>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
