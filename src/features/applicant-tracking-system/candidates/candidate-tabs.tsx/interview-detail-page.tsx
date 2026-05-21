// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Spin,
  Flex,
  Form,
  Radio,
  Input,
  Row,
  Col,
  Space,
  Card,
  Typography,
} from "antd";
import { BaseButton } from "lib/citywide-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import {
  getCandidateDetail,
  getInterviewDetail,
  updateCandidateStatus,
  updateInterviewStatus,
} from "services/api-services/ats-apis";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { capitalize } from "lodash";
import { BaseButtonsForm } from "lib/citywide-commonmodules";
import { date_format, locationId } from "utils/common-function";
import { interviewStatuses, renderForm, sendOffer } from "./utils";
import { Errornotify, Successnotify } from "utils/notification";
import BaseDrawer from "components/Drower";
import CandidateInfo from "./screened-detail";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
const { TextArea } = Input;
import dayjs from "dayjs"; // Import dayjs
import { simplifyFormData } from "../../common-ats-functions/utils";
import { EditOutlined } from "@ant-design/icons";

export default function InterviewDetailPage() {
  const [loading, setLoading] = useState(true);
  const [candidateInterviewDetail, setCandidateInterviewDetail] =
    useState<any>();
  const { id } = useParams();
  const [selectdFiles, setSelectedFiles] = useState([]);
  const [focused, setFocused] = useState("");
  const [submitForm, setSubmitForm] = useState(false);
  const [candidate, setCandidate] = useState<any>();
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [open, setOpen] = useState(false);
  const [isEditBasicInfo, setIsEditBasicInfo] = useState<any>();
  const [interviewStatus, setInterviewOffer] = useState<any>();
  const [editStatus, setEditStatus] = useState<any>(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [notes, setNotes] = useState<any>();
  const [showInterviewStatus, setShowInterviewStatus] = useState(false); // Step 1: State to track visibility
  const [editorData, setEditorData] = useState<Editortype[]>([
    {
      question: EditorState.createEmpty(),
    },
  ]);
  const { globleCodes, companyDetails } = useSelector(
    (state: any) => state.auth
  );
  const fetchCandidateInterviewData = async () => {
    setLoading(true);
    try {
      const response = await getInterviewDetail(id).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        const interviewData = response?.data?.data;
        if (!interviewData?.notes) {
          setShowInterviewStatus(true);
        }
        setCandidateInterviewDetail(interviewData);
        if (["re-scheduled", "scheduled"].includes(interviewData?.status)) {
          setInterviewOffer("scheduled");
        } else {
          setInterviewOffer(interviewData.status);
        }
        setNotes(interviewData?.notes);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCandidateInterviewData();
  }, []);

  const fetchCandidateData = async () => {
    setLoading(true);
    try {
      const response = await getCandidateDetail(id).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        const applicant_data = response?.data?.data;

        BaseFormMethod.setFieldsValue({
          candidate_name: `${applicant_data?.first_name ?? ""} ${
            applicant_data?.last_name ?? ""
          } `,
          candidate_email: applicant_data?.email ?? "",
        });

        setCandidate(response?.data?.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCandidateData();
  }, []);
  const simplifiedData = simplifyFormData(candidate?.form_data);

  const handleOpenDrawer = () => {
    setOpen(true);
    BaseFormMethod.setFieldsValue({
      candidate_name: `${candidate?.first_name ?? ""} ${
        candidate?.last_name ?? ""
      } `,
      candidate_email: candidate?.email ?? "",
    });
  };

  const onSelectFiles = (files: any) => {
    setSelectedFiles(() => files);
  };

  const onHandleSendOffer = async (value: any) => {
    setSubmitForm(true);
    const formattedDate = value.offer_expire_date
      ? dayjs(value.offer_expire_date).format(date_format)
      : "";
    const obj = {
      status: "offered",
      company_id: companyDetails?.id,
      location_id: Number(locationId),
      file: selectdFiles,
      ...value,
      offer_expire_at: formattedDate,
      message: draftToHtml(
        convertToRaw(editorData[0]?.question?.getCurrentContent())
      ),
    };
    const response = await updateCandidateStatus(id, obj).finally(() => {});
    if (response?.status === 201 || response?.status === 200) {
      setSubmitForm(false);
      Successnotify("Offer sent successfully");
      window.location.href = `${CITY_V2}admin/ats/job-offer-detail/${id}/${candidate?.job_id}`;
      setOpen(false);
    }
  };

  const onClose = () => {
    setOpen(false);
    setSelectedFiles([]);
    BaseFormMethod.resetFields();
    setEditorData([{ question: EditorState.createEmpty() }]);
  };

  const onChange = (evt: any) => {};
  const handleSearch = (newValue: string) => {};
  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName);
    return !!value;
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
            question: editorState,
          };
        }
        return item;
      })
    );
  };

  const onHandleSubmitInterview = async (value: any) => {
    setStatusLoading(true);
    const obj = {
      status: interviewStatus,
      notes: interviewStatus != "schedule-interview" ? notes : " ",
    };
    const res: any = await updateInterviewStatus(id, obj).finally(() => {
      setStatusLoading(false);
    });
    if (res?.status === 201 || res?.status === 200) {
      Successnotify("Applicant interview status updated successfully");
      setShowInterviewStatus(false);
      setEditStatus(false);
      fetchCandidateInterviewData();
      fetchCandidateData();
    } else {
      Errornotify("Something went wrong!");
    }
  };

  const onStatusChange = (value: any) => {
    setInterviewOffer(value.target.value);
  };

  const onEditStatus = () => {
    setEditStatus(true);
  };
  const handleEditNotes = () => {
    setShowInterviewStatus(true);
  };

  return (
    <div>
      <div className="base-card">
        <Flex justify="space-between" className="page-heading">
          <h1 className="heading-text">
            <a className="backIcon" href={`${CITY_V2}admin/ats/candidates`}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            Interview details
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
          ) : candidateInterviewDetail ? (
            <>
              {candidateInterviewDetail ? (
                <div className="candidate-details">
                  <Row>
                    <Col span={24}>
                      <h3 className="sub-heading-text c-mb-4">Interviewer details</h3>
                    </Col>
                    <Col span={24} sm={12} md={8} lg={6}>
                      <div className="candidate-information">
                        <strong> Position </strong>
                        <span>{candidateInterviewDetail?.job_title}</span>
                      </div>
                    </Col>
                    <Col span={24} sm={12} md={8} lg={6}>
                      <div className="candidate-information">
                        <strong> Date/Time </strong>
                        <span>
                          {candidateInterviewDetail?.interview_date
                            ? dayjs(
                                candidateInterviewDetail?.interview_date
                              ).format("MM/DD/YYYY")
                            : null}
                          , <Space></Space>
                          {candidateInterviewDetail?.from_time
                            ? dayjs(
                                candidateInterviewDetail?.from_time,
                                "HH:mm:ss"
                              ).format("HH:mm")
                            : null}
                          -
                          {candidateInterviewDetail?.end_time
                            ? dayjs(
                                candidateInterviewDetail?.end_time,
                                "HH:mm:ss"
                              ).format("HH:mm")
                            : null}
                          ({candidateInterviewDetail?.time_slots})
                        </span>
                      </div>
                    </Col>
                    <Col span={24} sm={12} md={8} lg={6}>
                      <div className="candidate-information">
                        <strong>Meeting Mode </strong>
                        <span className="status-completed">
                          {candidateInterviewDetail?.interview_mode
                            ? capitalize(
                                candidateInterviewDetail?.interview_mode
                              )
                            : ""}
                        </span>
                      </div>
                    </Col>
                    {candidateInterviewDetail?.interview_mode === "online" ? (
                      <Col span={24} sm={12} md={8} lg={6}>
                        <div className="candidate-information">
                          <strong> Meeting Link </strong>
                          <a
                            className="CHS-link"
                            target="_blank"
                            href={candidateInterviewDetail?.link}
                          >
                            {candidateInterviewDetail?.link}
                          </a>
                        </div>
                      </Col>
                    ) : null}
                    <Col span={24} sm={12} md={8} lg={6}>
                      <div className="candidate-information">
                        <strong>Interviewer </strong>
                        <span>
                          {candidateInterviewDetail?.interviewer_name}
                        </span>
                      </div>
                    </Col>
                    <Col span={24} sm={12} md={8} lg={6}>
                      <div className="candidate-information">
                        <strong>Interviewee </strong>
                        <span>
                          {candidateInterviewDetail?.candidate_name}
                        </span>
                      </div>
                    </Col>
                    {candidateInterviewDetail.status ? (
                      <Col span={24} sm={12} md={8} lg={6}>
                        <div className="candidate-information">
                          <strong>Status </strong>
                          <span>{candidateInterviewDetail?.status}</span>
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}
                    {candidateInterviewDetail.notes ? (
                      <Col span={24} sm={12} md={8} lg={6}>
                        <div className="candidate-information">
                          <strong>Notes </strong>
                          <span>{candidateInterviewDetail?.notes}</span>
                          <span>
                            <EditOutlined onClick={handleEditNotes} />
                          </span>
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}
                    {showInterviewStatus && (
                      <Col span={24}>
                        <strong className="candidate-information">
                          Interview status
                        </strong>

                        <Form
                          onFinish={onHandleSubmitInterview}
                          className="c-mt-1"
                        >
                          <Row gutter={16}>
                            <Col span={24}>
                              <Radio.Group
                                onChange={onStatusChange}
                                value={interviewStatus}
                              >
                                {interviewStatuses.map((status) => (
                                  <Radio
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </Radio>
                                ))}
                              </Radio.Group>
                              {/* <EditOutlined onClick={onEditStatus} /> */}
                            </Col>

                            <>
                              <Col span={24}>
                                <TextArea
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder="Type your notes here..."
                                  rows={4}
                                  className="question-textarea c-mt-3"
                                />
                              </Col>
                              <Col span={24}>
                                <Flex justify="end">
                                  <BaseButton
                                    className="c-mt-2"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={!interviewStatus}
                                    loading={statusLoading}
                                  >
                                    Update Status
                                  </BaseButton>
                                </Flex>
                              </Col>
                            </>
                          </Row>
                        </Form>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div className="candidate-details  c-mt-2">
                        <CandidateInfo
                          showHeading={true}
                          candidate={candidate}
                          simplifiedData={simplifiedData}
                        />
                      </div>
                    </Col>
                  </Row>
                  {candidateInterviewDetail?.status === "cleared" && (
                    <Flex gap={8} justify="flex-end" className="c-mt-2">
                      <BaseButton type="primary" onClick={() => setOpen(true)}>
                        Send offer
                      </BaseButton>
                    </Flex>
                  )}
                </div>
              ) : null}
            </>
          ) : null}

          <BaseDrawer
            title="Send Offer"
            placement={"right"}
            width={1000}
            open={open}
            onClose={onClose}
          >
            <Card>
              <BaseButtonsForm
                onFinish={onHandleSendOffer}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                form={BaseFormMethod}
              >
                <Row gutter={16}>
                  {sendOffer?.form[0]?.fields?.map((field: any) =>
                    renderForm({
                      field: field,
                      onChange: onChange,
                      handleSearch: handleSearch,
                      globleCodes: globleCodes,
                      languageCode: companyDetails?.language_code,
                      isEditAgent: isEditBasicInfo,
                      focused: focused,
                      setFocused: setFocused,
                      isValueFilled: isValueFilled,
                      activityCode: undefined,
                      handleEditor: handleEditor,
                      editorData,
                      onSelectFiles,
                      open
                    })
                  )}
                </Row>
                <Row gutter={16}>
                  <Col span="24">
                    <Form.Item>
                      <Flex gap={8} justify="flex-end">
                        <BaseButton loading={submitForm} htmlType="submit">
                          Submit
                        </BaseButton>
                      </Flex>
                    </Form.Item>
                  </Col>
                </Row>
              </BaseButtonsForm>
            </Card>
          </BaseDrawer>
        </div>
      </div>
    </div>
  );
}
