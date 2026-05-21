import React, { useState, useEffect } from "react";
import { Card, Col, Flex, Row, Form, Tooltip } from "antd";
import {
  renderForm,
  drower,
  sendOffer,
  submitInterviewDetails,
  CandidateStatus,
} from "./utils";
import {
  AsyncTable,
  BaseButton,
  BaseButtonsForm,
} from "lib/citywide-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import {
  CalendarOutlined,
  CalendarTwoTone,
  IdcardOutlined,
  IdcardTwoTone,
} from "@ant-design/icons";
import {
  deleteJobPost,
  updateCandidateStatus,
} from "services/api-services/ats-apis";
import Swal from "sweetalert2";
import { Errornotify, Successnotify } from "utils/notification";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import { useSelector } from "react-redux";
import {
  locationId,
  Move_Forward_Icon,
  View_Icon,
} from "utils/common-function";

import { convertToRaw, EditorState } from "draft-js";
import BaseDrawer from "components/Drower";
import draftToHtml from "draftjs-to-html";
import InterviewSchedule from "./schedule-interview-page";
import dayjs from "dayjs";
import { handleGlobalSearch, Actions } from "../../common-ats-functions/utils";
import { useParams } from "react-router-dom";
import StatusSelection from "../common-candidate-functions/status-selection";
const Screened = ({
  columns,
  candidateData,
  loading,
  globalSearch,
  tableParams,
  paginationCount,
  setGlobalSearch,
  handleTableChange,
  setDefaultCurrent,
  fetchCandidateDetail,
  defaultCurrent,
}: {
  columns: any;
  candidateData: any;
  loading: any;
  globalSearch: any;
  tableParams: any;
  paginationCount: any;
  setGlobalSearch: any;
  handleTableChange: any;
  setDefaultCurrent: any;
  fetchCandidateDetail: any;
  defaultCurrent: number;
}) => {
  const [searchText, setSearchText] = useState("");
  const [openFilter, setIsOpenFilter] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [openOffer, setOpenOffer] = useState(false);
  const [interviewForm, setInterviewForm] = useState<any>([]);
  const [candidateDetail, SetCandidateDetail] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [candidateId, setCandidateId] = useState<any>();
  const [isEditBasicInfo, setIsEditBasicInfo] = useState<any>();
  const [focused, setFocused] = useState("");
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [selectdFiles, setSelectedFiles] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState();
  const [isOffLine, setIsOffLine] = useState(false);
  const [offerloader, setOfferLoader] = useState(false); // Initialize loading as true
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidate, setCandidate] = useState<any>(); // Initialize loading as true

  const { id } = useParams();

  const [isOnline, setIsOnline] = useState(false);
  type Editortype = {
    question: EditorState;
  };

  const { globleCodes, companyDetails } = useSelector(
    (state: any) => state.auth
  );
  const handleDeleteJobPost = async (jobPostId?: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will Reject or Blacklist the applicant",
      showCancelButton: true,
      confirmButtonText: "Blacklist",
      cancelButtonText: "Reject",
      reverseButtons: false,
      customClass: {
        cancelButton: "red-cancel-button",
      },
    });

    if (result.isConfirmed) {
      const res: any = await deleteJobPost(jobPostId);
      if (res?.status === 201 || res?.status === 200) {
        // fetchJobPosting();
        Successnotify("Payroll deleted successfully");
      } else {
        Errornotify("Something went wrong!");
      }
    }
  };

  const handelCandidatestatus = async (jobPostId?: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "To move the applicant to job offer status",
      showCancelButton: true,
      confirmButtonText: "Blacklist",
      cancelButtonText: "Reject",
      reverseButtons: false,
      customClass: {
        cancelButton: "red-cancel-button",
      },
    });
    if (result.isConfirmed) {
      const res: any = await deleteJobPost(jobPostId);
      if (res?.status === 201 || res?.status === 200) {
        // fetchJobPosting();
        Successnotify("Payroll deleted successfully");
      } else {
        Errornotify("Something went wrong!");
      }
    }
  };
  const handleClick = (type: string, item?: any) => {
    if (type === Actions.VIEW) {
      window.location.href = `${CITY_V2}admin/ats/interview-detail/${item?.id}`;
    }
    if (type === Actions.REJECT) {
      handleDeleteJobPost();
    }
    if (type === Actions.REJECT) {
      handelCandidatestatus();
    }
    if (type === Actions.SCHEDULE) {
      setOpen(true);
      SetCandidateDetail(item);
    }
    if (type === Actions.OFFER) {
      BaseFormMethod.setFieldsValue({
        candidate_name: item?.candidate_name,
        candidate_email: item?.email ? item?.email?.trim() : "",
      });

      setSelectedApplicant(item);
      setOpenOffer(true);
      setCandidateId(item?.id);
    }
    if (type === Actions.ISDELETE) {
      setIsModalOpen(true);
      setCandidate(item);
    }
  };

  const [editorData, setEditorData] = useState<Editortype[]>([
    {
      question: EditorState.createEmpty(),
    },
  ]);

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

  const onSelectFiles = (files: any) => {
    setSelectedFiles(() => files);
  };
  const onChangePhone = () => {};

  const finalColumns = columns?.filter(
    (col: any) => col?.group_by === `${ColumnGroupBy.INTERVIEW}`
  );
  finalColumns?.push({
    title: "Actions",
    key: "action",
    render: (value: any, item: any) => {
      return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {View_Icon(handleClick, item)}
          {[
            CandidateStatus.NOT_CLEARED,
            CandidateStatus.SCHEDULED,
            CandidateStatus.RE_SCHEDULED,
          ].includes(item?.interview_status) && (
            <Tooltip title="Reschedule Interview">
              <div
                className="table-actions"
                onClick={() => handleClick(Actions.SCHEDULE, item)}
              >
                <CalendarOutlined />
              </div>
            </Tooltip>
          )}
          {item?.interview_status === CandidateStatus.CLEARED ? (
            <Tooltip title="Send Offer">
              <div
                className="table-actions"
                onClick={() => handleClick(Actions.OFFER, item)}
              >
                <IdcardOutlined />
              </div>
            </Tooltip>
          ) : null}
          {Move_Forward_Icon(handleClick, item)}
        </div>
      );
    },
  });

  const onChange = (evt: any) => {};
  const handleSearch = (newValue: string) => {};

  //send offer payload

  const onHandleSendOffer = async (value: any) => {
    setOfferLoader(true);
    const formattedDate = value.offer_expire_date
      ? dayjs(value.offer_expire_date).toISOString()
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
    const response = await updateCandidateStatus(candidateId, obj).finally(
      () => {
        setOfferLoader(false);
      }
    );
    if (response?.status === 201 || response?.status === 200) {
      BaseFormMethod.resetFields();
      setEditorData([
        {
          question: EditorState.createEmpty(), // Reset to an empty editor state
        },
      ]);
      Successnotify("Offer sent successfully");
      setOpenOffer(false);
      fetchCandidateDetail();
    }
  };
  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName);
    return !!value;
  };

  useEffect(() => {
    setInterviewForm(drower);
  }, [drower, sendOffer]);
  useEffect(() => {
    if (open) {
      BaseFormMethod.resetFields(); // Reset form fields when drawer is closed
      setIsOffLine(false); // Reset form fields when drawer is closed
      setIsOnline(false);
    }
  }, [open]);
  return (
    <Card className="employee-card base-card">
      <div className="base-card-body">
        <AsyncTable
          isFilter={false}
          handleFilter={() => setIsOpenFilter(!openFilter)}
          globalSearch={{ title: "Search" }}
          searchText={searchText}
          setSearchText={setSearchText}
          columnData={columns?.length > 0 ? finalColumns : []}
          tableData={candidateData}
          loading={loading} // Pass loading state to AsyncTable
          globalSearchValue={globalSearch}
          totalRecords={paginationCount}
          rowsPerPage={tableParams?.pageSize ? tableParams?.pageSize : 10}
          handleSelect={handleTableChange}
          handleGlobalSearch={(evt: any) =>
            handleGlobalSearch(evt, setDefaultCurrent, setGlobalSearch)
          }
          className="async-table"
          defaultCurrent={defaultCurrent}
        />
      </div>
      <BaseDrawer
        title="Reschedule Interview"
        open={open}
        onClose={() => {
          setOpen(false);
          BaseFormMethod.resetFields();
          setIsOffLine(false); // Reset form fields when drawer is closed
          setIsOnline(false);
        }}
        width={1000}
      >
        <InterviewSchedule
          candidateDetail={candidateDetail}
          companyDetails={companyDetails}
          onFinish={(value: any) =>
            submitInterviewDetails(
              value,
              setLoader,
              candidateDetail,
              companyDetails,
              setOpen,
              fetchCandidateDetail,
              "re-schedule-interview",
              id,
              BaseFormMethod
            )
          }
          loader={loader}
          formInstance={BaseFormMethod} // Pass form instance here
          setIsOffLine={setIsOffLine}
          isOffLine={isOffLine}
          setIsOnline={setIsOnline}
          isOnline={isOnline}
        />
      </BaseDrawer>
      <BaseDrawer
        title="Send Offer"
        placement={"right"}
        width={1000}
        open={openOffer}
        onClose={() => {
          setOpenOffer(false);
          BaseFormMethod.resetFields();
          setEditorData([
            {
              question: EditorState.createEmpty(), // Reset editor to empty state
            },
          ]);
        }}
      >
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
                onChangePhone,
                open: openOffer,
              })
            )}
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <Form.Item>
                <Flex gap={8} justify="flex-end">
                  <BaseButton htmlType="submit" loading={offerloader}>
                    Submit
                  </BaseButton>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </BaseButtonsForm>
      </BaseDrawer>
      <StatusSelection
        globleCodes
        candidate={candidate}
        is_modal={true}
        fetchCandidateDetail={fetchCandidateDetail}
        setCandidate={setCandidate}
        title={"Move Applicant"}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Card>
  );
};

export default Screened;
