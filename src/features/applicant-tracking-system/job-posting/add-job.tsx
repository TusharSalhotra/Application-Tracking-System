// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Col, Flex, Row, Spin } from "antd";
import { useParams } from "react-router-dom";
import {
  BaseButton,
  BaseButtonsForm,
} from "@deepak-pahwa/citywide-commonmodules";

import { useSelector } from "react-redux";
import { renderForm } from "./utils";
import useModuleId from "utils/useModuleId";
import {
  addJobPost,
  getJobById,
  getLocation,
  updateJobPost,
  getFormBuilderApi,
} from "services/api-services/ats-apis";
import { Errornotify, Successnotify } from "utils/notification";
import { CITY_V2 } from "services/api-services/constants";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { getFormFields } from "services/api-services/commonApi";
import { locationId } from "utils/common-function";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import htmlToDraft from "html-to-draftjs";
import dayjs from "dayjs";
import {
  getDepartments,
  getEmploymentTypeList,
  getSkillQualifications,
} from "services/api-services/ats-settings/api-services";

type Editortype = {
  description: EditorState;
};
const AddJobPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const module_id = useModuleId("admin/ats/dashboard");
  const [focused, setFocused] = useState("");
  const [isEditBasicInfo, setIsEditBasicInfo] = useState<any>();
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [gridContent, setGridContent] = useState<any>([]);
  const [location, setLocation] = useState<any>([]);
  const [jobForm, setJobForm] = useState<any>([]);

  const [editorData, setEditorData] = useState<Editortype[]>([
    {
      description: EditorState.createEmpty(),
    },
  ]);
  const { globleCodes, companyDetails } = useSelector(
    (state: any) => state.auth
  );
  const currencyCode = companyDetails?.currency_code || "";

  const getCurrencySymbol = (currencyCode: string): string => {
    try {
      return (
        new Intl.NumberFormat("en", {
          style: "currency",
          currency: currencyCode,
        })
          .formatToParts(1)
          .find((part) => part.type === "currency")?.value || ""
      );
    } catch (error) {
      console.error("Invalid currency code:", currencyCode);
      return "";
    }
  };
  const currencySymbol = getCurrencySymbol(currencyCode);

  const fetchLocations = async (searchValue?: string) => {
    const queryParam = `?company_id=${companyDetails?.id}&search=${
      searchValue || ""
    }`;
    try {
      const response = await getLocation(queryParam);
      if (response?.status === 201 || response?.status === 200) {
        setLocation(response || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const fetchJobForms = async (searchValue: string) => {
    const queryParam = `/${companyDetails?.id}/${locationId}&search=${
      searchValue || ""
    }&pageSize=${1000}`;
    try {
      const response = await getFormBuilderApi(queryParam);
      if (response?.status === 201 || response?.status === 200) {
        setJobForm(response || "");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchGridData = async () => {
    const params = module_id || "";
    const type = "Add";
    if (!loading) setLoading(true);
    if (params) {
      const columnRes: any = await getFormFields(
        params,
        type,
        companyDetails?.language_code || "en"
      ).finally(() => {
        setLoading(false);
      });
      if (columnRes?.status === 200 || columnRes?.status === 201) {
        setGridContent(columnRes?.data?.data?.form);
      }
    }
  };

  const fetchDataById = async () => {
    const data: any = await getJobById(id).finally(() => {
      setLoading(false);
    });
    if (data?.status === 200 || data?.status === 201) {
      const contentBlock = htmlToDraft(data?.data?.data?.description);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);

        BaseFormMethod.setFieldsValue({
          ...data?.data?.data,
          [`Questions_0`]: editorState.getCurrentContent().hasText()
            ? editorState
            : undefined,
          setting_form_id: Number(data?.data?.data?.setting_form_id),
          application_end_date: dayjs(data?.data?.data.application_end_date),
          number_opening: `${data?.data?.data?.number_opening}`,
          location_id: Number(data?.data?.data?.location_id),
        });
        setEditorData([
          {
            description: editorState,
          },
        ]);
      }
    }
  };

  const onFinish = async (value: any) => {
    setLoader(true);
    if (id) {
      const formattedDate = value?.application_end_date
        ? new Date(value.application_end_date).toISOString().split("T")[0]
        : "";

      const obj = {
        ...value,
        id: Number(id),
        company_id: companyDetails?.id,
        location_id: value?.location_id
          ? value?.location_id
          : Number(locationId),
        setting_form_id: value?.setting_form_id,

        number_opening: Number(value.number_opening),
        application_end_date: formattedDate,
        description: draftToHtml(
          convertToRaw(editorData[0]?.description?.getCurrentContent())
        ),
      };

      if (obj.Questions_0) {
        delete obj.Questions_0;
      }

      obj.description = draftToHtml(
        convertToRaw(editorData[0]?.description?.getCurrentContent() || {})
      );
      const res: any = await updateJobPost(obj).finally(() => setLoader(false));
      if (res?.status === 201 || res?.status === 200) {
        BaseFormMethod.resetFields();
        window.location.href = `${CITY_V2}admin/ats/job-posting`;
        Successnotify("Job post Updated successfully ");
      } else {
        res?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
    } else {
      const formattedDate = value?.application_end_date
        ? new Date(value.application_end_date).toISOString().split("T")[0]
        : "";

      const obj = {
        ...value,
        location_id: value?.location_id
          ? [value?.location_id]
          : [Number(locationId)],
        company_id: companyDetails?.id,
        setting_form_id: value?.setting_form_id,
        number_opening: Number(value.number_opening),
        application_end_date: formattedDate,
        description: draftToHtml(
          convertToRaw(editorData[0]?.description?.getCurrentContent())
        ),
      };

      obj.description = draftToHtml(
        convertToRaw(editorData[0]?.description?.getCurrentContent() || {})
      );
      const res: any = await addJobPost(obj).finally(() => setLoader(false));
      if (res?.status === 201 || res?.status === 200) {
        BaseFormMethod.resetFields();
        window.location.href = `${CITY_V2}admin/ats/job-posting`;
        Successnotify("Job post added successfully ");
      } else {
        res?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
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

  const onChange = (evt: any) => {};

  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName);
    return !!value;
  };

  useEffect(() => {
    fetchGridData();
    fetchLocations();
    fetchJobForms();
  }, [module_id]);

  useEffect(() => {
    if (id) {
      fetchDataById();
    }
  }, [id]);

  const handleReset = () => {
    BaseFormMethod.resetFields(); // Reset all fields in the form
    setEditorData([
      {
        description: EditorState.createEmpty(), // Reset to an empty editor state
      },
    ]);
  };

  const handleSearch = (newValue: string, inputKey: any) => {
    if (inputKey === "department") {
      fetchDepartments(newValue);
    }
    if (inputKey === "employment_type") {
      fetchEmploymentList(newValue);
    }
    if (inputKey === "required_skill") {
      fetchSkillQualifications(newValue);
    }
    if (inputKey === "setting_form_id") {
      fetchJobForms(newValue);
    }
  };
  const getArray = (type: string) => {
    switch (type) {
      case "department":
        return Departments;
      case "employment_type":
        return employmentList;
      case "required_skill": //employement_type employment_type
        return skillType;

      default:
        return [];
    }
  };
  const [Departments, setDepartments] = useState<any>();
  const fetchDepartments = async (searchValue: string) => {
    const queryData = `?pageSize=${1000}&company_id=${
      companyDetails?.id
    }&location_id=${locationId}&search=${searchValue || ""}`;
    let department: any = await getDepartments(queryData);
    const { data } = department?.data.data;
    let departments = data?.map((item: any) => ({
      id: item?.id?.toString(),
      name: item?.name,
    }));
    setDepartments(departments);
  };

  useEffect(() => {
    fetchDepartments("");
  }, [locationId]);
  const [employmentList, setEmploymentList] = useState<any>();
  const fetchEmploymentList = async (searchValue: string) => {
    const queryData = `?pageSize=${1000}&company_id=${
      companyDetails?.id
    }&location_id=${locationId}&search=${searchValue || ""}`;
    let employment: any = await getEmploymentTypeList(queryData);
    const { data } = employment?.data?.data;
    let employment_types = data?.map((item: any) => ({
      id: item?.id?.toString(),
      name: item?.name,
    }));
    setEmploymentList(employment_types);
  };

  useEffect(() => {
    fetchEmploymentList("");
  }, [locationId]);

  const [skillType, setSkillType] = useState<any>();
  const fetchSkillQualifications = async (searchValue: string) => {
    const queryData = `?pageSize=${1000}&company_id=${
      companyDetails?.id
    }&location_id=${locationId}&search=${searchValue || ""}`;
    let skills: any = await getSkillQualifications(queryData);
    const { data } = skills?.data.data;
    let skills_list = data?.map((item: any) => ({
      id: item?.id?.toString(),
      name: item?.name,
    }));
    setSkillType(skills_list);
  };

  useEffect(() => {
    fetchSkillQualifications("");
  }, [locationId]);

  return (
    <div className="base-card">
      <div className="page-heading">
        <h1 className="heading-text">
          <a className="backIcon" href={`${CITY_V2}admin/ats/job-posting`}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </a>
          {id ? "Update Job" : " Add New Job"}
        </h1>
        <BaseButton
          type="default"
          className="secondary"
          href={`${CITY_V2}admin/ats/job-posting`}
        >
          Back
        </BaseButton>
      </div>
      {loading ? (
        <div className="center-loader">
          <Spin />
        </div>
      ) : (
        <div className="base-card-body">
          <Row>
            <Col span={24}>
              <BaseButtonsForm
                onFinish={onFinish}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                form={BaseFormMethod}
              >
                <div className="form-container">
                  <Row gutter={16}>
                    {gridContent[0]?.fields?.map((field: any) =>
                      renderForm({
                        field: field,
                        onChange: onChange,
                        handleSearch: handleSearch,
                        handleEditor: handleEditor,
                        editorData: editorData,
                        globleCodes: globleCodes,
                        languageCode: companyDetails?.language_code,
                        isEditAgent: isEditBasicInfo,
                        focused: focused,
                        setFocused: setFocused,
                        isValueFilled: isValueFilled,
                        activityCode: undefined,
                        location: location,
                        jobForm: jobForm,
                        id: id,
                        currencySymbol: currencySymbol,
                        skillType,
                        arrayOfData: getArray(field.key),
                      })
                    )}
                  </Row>
                </div>
                <Flex justify="end" gap={8}>
                  {id ? (
                    ""
                  ) : (
                    <BaseButton
                      type="primary"
                      htmlType="reset"
                      className="common-btn secondary"
                      onClick={handleReset}
                    >
                      Clear
                    </BaseButton>
                  )}

                  <BaseButton
                    type="primary"
                    htmlType="submit"
                    loading={loader}
                    disabled={loader}
                  >
                    <span> {id ? "Update" : "Save"}</span>
                  </BaseButton>
                </Flex>
              </BaseButtonsForm>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default AddJobPost;
