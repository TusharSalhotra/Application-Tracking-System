// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Button, Col, Flex, Row, Spin, Upload, Form, UploadFile } from "antd";
import { useParams } from "react-router-dom";
import {
  BaseButton,
  BaseButtonsForm,
} from "lib/ui-commonmodules";

import { useSelector } from "react-redux";
import { renderForm } from "./utils";
import useModuleId from "utils/useModuleId";
import {
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Errornotify, Successnotify } from "utils/notification";
import { CITY_V2 } from "services/api-services/constants";
import { locationId } from "utils/common-function";
import { UploadProps } from "antd/lib";
import { UploadChangeParam } from "antd/es/upload";
import { RcFile } from "antd/lib/upload";
import { mockJobs, mockSkills, mockSourceTypes } from "services/mockData";

const mockApplicantForm = {
  key: "candidates",
  fields: [
    {
      id: "first-name",
      type: "text",
      name: "First Name",
      key: "first_name",
      validations: [{ message: "First name is required.", type: "required" }],
    },
    {
      id: "last-name",
      type: "text",
      name: "Last Name",
      key: "last_name",
      validations: [{ message: "Last name is required.", type: "required" }],
    },
    {
      id: "email",
      type: "email",
      name: "Email",
      key: "email",
      validations: [
        { message: "Email is required.", type: "required" },
        { message: "Enter a valid email address.", type: "email" },
      ],
    },
    {
      id: "phone",
      type: "phone",
      name: "Phone Number",
      key: "phone_number",
      validations: [{ message: "Phone number is required.", type: "required" }],
    },
    {
      id: "position",
      type: "api",
      name: "Position Applied For",
      key: "position",
      validations: [{ message: "Position is required.", type: "required" }],
    },
    {
      id: "source-type",
      type: "api",
      name: "Source Type",
      key: "source_type",
      validations: [{ message: "Source type is required.", type: "required" }],
    },
    {
      id: "skill",
      type: "api",
      name: "Skills & Qualification",
      key: "skill",
      is_multiple: true,
      validations: [{ message: "Skill is required.", type: "required" }],
    },
    {
      id: "status",
      type: "select",
      name: "Status",
      key: "status",
      validations: [{ message: "Status is required.", type: "required" }],
      options: [
        { text: "Sourced", value: "sourced" },
        { text: "Screened", value: "screened" },
        { text: "Interview", value: "interview" },
        { text: "Offered", value: "offered" },
        { text: "Onboarding", value: "onboarding" },
      ],
    },
    {
      id: "sourcing-date",
      type: "date",
      name: "Sourcing Date",
      key: "sourcing_date",
      validations: [{ message: "Sourcing date is required.", type: "required" }],
    },
    {
      id: "current-employer",
      type: "text",
      name: "Current Employer",
      key: "current_employer",
    },
    {
      id: "current-role",
      type: "text",
      name: "Current Role",
      key: "current_role",
    },
    {
      id: "notes",
      type: "textarea",
      name: "Notes",
      key: "notes",
    },
    {
      id: "resume",
      type: "upload",
      name: "Resume / CV",
      key: "upload",
    },
  ],
};

const AddCandidate = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const { globleCodes, companyDetails, commonForm } = useSelector(
    (state: any) => state.auth
  );
  const module_id = useModuleId("admin/ats/dashboard");
  const [tableParams, setTableParams] = useState<any>({});
  const [mendatory, setMendatory] = useState<any>(false);
  const [focused, setFocused] = useState("");
  const [imageUrl, setImageUrl] = useState<string>();
  const [rawFileList, setRawFileList] = useState<any>([]);
  const [fileList, setFileList] = useState<any>([]);
  const [globalSearch, setGlobalSearch] = useState<any>("");
  const [isEditBasicInfo, setIsEditBasicInfo] = useState<any>();
  const [loader, setLoader] = useState(false);
  const [jopPosting, setJobPosting] = useState<any>([]);
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [gridContent, setGridContent] = useState<any>([]);
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [Position, setPosition] = useState<any>("");
  const [Status, setStatus] = useState<any>();
  const [sourceType, setSourceType] = useState<any>();

  const url = new URL(window.location.href);
  const idValue = url.searchParams.get("id") || 13;

  const fetchGridData = async () => {
    setGridContent(mockApplicantForm);
  };

  const onChange = (evt: any, value: any) => {
    const isCheckBox = evt?.target?.type === "checkbox";
    if (isCheckBox) {
      setMendatory(evt.target.checked);
    }
    if (value?.key == "position") {
      setPosition(value?.children);
    }
    if (value?.key == "status") {
      setStatus(evt);
    }
  };

  const onChangePhone = (...args: any) => {
    const [values, input_key] = args;
    setPhoneNumber(values[3]);
    BaseFormMethod.setFieldValue(input_key, values[3]);
  };
  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName);
    return !!value;
  };
  const handelBack = () => {
    window.history.back();
  };

  useEffect(() => {
    fetchGridData();
  }, [module_id]);
  const beforeUpload = (file: any) => {
    const isPdf =
      file?.type === "application/pdf" || file?.type === "application/msword";
    if (!isPdf) {
      Errornotify("You can only upload PDF/doc file!");
    }
    const isLt15M = file.size / 1024 / 1024 <= 15;
    if (!isLt15M) {
      Errornotify("Image must smaller than 15MB!");
    }
    return isPdf && isLt15M;
  };

  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadLoading(true);

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
    try {
      const fileUrl = URL.createObjectURL(file);
      setRawFileList((prev: any) => [
        ...prev,
        {
          file_id: `mock-file-${Date.now()}`,
          url: fileUrl,
          file_url: fileUrl,
        },
      ]);
      onSuccess?.({}, new XMLHttpRequest());
    } catch (error) {
      Errornotify("Upload failed.");
      onError?.(error);
    } finally {
      setUploadLoading(false);
    }
  };
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
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

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      // setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url: any) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const renderUpload = (field: any) => (
    <Form.Item
      key={field?.key}
      label={field?.label}
      name={field?.key}
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
      style={{
        width: "100%",
      }}
    >
      <Upload
        name="avatar"
        customRequest={handleUpload}
        className="file-uploader-job"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        fileList={fileList}
        accept=".pdf,.doc"
      >
        {fileList?.length > 0 ? (
          fileList.map((file: any, index: any) => (
            <div className="uploaded-document">
              Uploaded document:
              {file?.url ? (
                <>
                  <CloseOutlined
                    className="cancel-icon"
                    disabled
                    onClick={(event: any) => {
                      event.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  />
                  <embed
                    id="embed-id"
                    type="application/pdf"
                    src={`${file?.url}`}
                    original-url={`${file?.url}`}
                    background-color="4283586137"
                    style={{ width: "100%" }}
                  ></embed>
                </>
              ) : (
                <embed
                  src={file?.url}
                  // alt="Uploaded"
                  style={{ width: "100%" }}
                  type={
                    file?.type === "application/pdf"
                      ? "application/pdf"
                      : "application/msword"
                  }
                />
              )}
            </div>
          ))
        ) : (
          <BaseButton className="c-w-full" icon={<UploadOutlined />}>
            Upload Resume/CV
          </BaseButton>
        )}
      </Upload>
    </Form.Item>
  );

  const fetchJobPosting = async () => {
    setJobPosting(mockJobs);
  };

  const onFinish = async (value: any) => {
    const fileUrl = rawFileList?.[0]?.file_url || "";
    const result = Object.entries(value)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => {
        if (key === "position") {
          return { key, value: Position };
        } else if (key === "status") {
          return { key, value: Status };
        } else if (key === "upload") {
          return { key, value: fileUrl };
        } else {
          return { key, value };
        }
      });
    const question_answers: any[] = [];
    result.forEach((item) => {
      question_answers.push({
        ...item,
      });
    });

    setLoading(true);
    const obj = {
      company_id: companyDetails?.id,
      location_id: Number(locationId),
      first_name: value?.first_name,
      last_name: value?.last_name,
      email: value?.email,
      phone: phoneNumber,
      file: fileUrl,
      job_id: value?.position,
      source_type: value?.source_type?.toString(),
      status: value?.status || Status,
      form_data: {
        ...question_answers,
      },
    };

    const savedApplicants = JSON.parse(
      localStorage.getItem("mock-applicants") || "[]"
    );
    localStorage.setItem(
      "mock-applicants",
      JSON.stringify([
        ...savedApplicants,
        {
          id: `cand-${Date.now()}`,
          uuid: `cand-${Date.now()}`,
          ...obj,
          full_name: `${value?.first_name || ""} ${value?.last_name || ""}`.trim(),
          phone: phoneNumber,
          position: Position,
          created_at: new Date().toISOString(),
        },
      ])
    );
    setLoading(false);
    Successnotify("Applicant added successfully ");
    window.location.href = `${CITY_V2}admin/ats/candidates`;
    BaseFormMethod.resetFields();
  };
  useEffect(() => {
    fetchJobPosting();
  }, []);
  const handleSearch = (newValue: string, inputKey: any) => {
    // fetchSites(newValue);
    if (inputKey === "source_type") {
      fetchSourceType(newValue);
    }
    if (inputKey === "skill") {
      fetchSkillQualifications(newValue);
    }
  };
  const fetchSourceType = async (searchValue: string) => {
    const value = String(searchValue || "").toLowerCase();
    setSourceType(
      mockSourceTypes.filter((item) => item.name.toLowerCase().includes(value))
    );
  };

  useEffect(() => {
    fetchSourceType("");
  }, [locationId]);

  const [skillType, setSkillType] = useState<any>();
  const fetchSkillQualifications = async (searchValue: string) => {
    const value = String(searchValue || "").toLowerCase();
    setSkillType(
      mockSkills.filter((item) => item.name.toLowerCase().includes(value))
    );
  };

  useEffect(() => {
    fetchSkillQualifications("");
  }, [locationId]);

  return (
    <div className="base-card">
      <div className="page-heading">
        <h1 className="heading-text">
          <a className="backIcon" href={`${CITY_V2}admin/ats/candidates`}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </a>
          {id ? "Update Applicant" : " Add New Applicant"}
        </h1>
        <BaseButton type="default" className="secondary" onClick={handelBack}>
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
                    {gridContent?.fields?.map((field: any) =>
                      renderForm(
                        field,
                        onChange,
                        handleSearch,
                        globleCodes,
                        companyDetails?.language_code,
                        isEditBasicInfo,
                        [],
                        mendatory,
                        focused,
                        setFocused,
                        isValueFilled,
                        handleUpload,
                        renderUpload,
                        jopPosting,
                        onChangePhone,
                        sourceType,
                        skillType
                      )
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
                    >
                      Clear
                    </BaseButton>
                  )}

                  <BaseButton
                    type="primary"
                    htmlType="submit"
                    disabled={uploadLoading}
                  >
                    {!loader ? (
                      <span> {id ? "Update" : "Save"}</span>
                    ) : (
                      <p className="button-loader">
                        <Spin indicator={<LoadingOutlined spin />} />
                      </p>
                    )}
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

export default AddCandidate;
