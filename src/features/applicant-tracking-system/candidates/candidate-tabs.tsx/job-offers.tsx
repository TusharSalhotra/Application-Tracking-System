// @ts-nocheck
import React, { useState } from "react";

import { Card, Col, Flex, Form, Row, Tooltip } from "antd";
import {
  AsyncTable,
  BaseButton,
  BaseButtonsForm,
} from "@deepak-pahwa/citywide-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import { handleGlobalSearch, Actions } from "../../common-ats-functions/utils";
import {
  deleteJobPost,
  updateCandidateStatus,
} from "services/api-services/ats-apis";
import Swal from "sweetalert2";
import { Errornotify, Successnotify } from "utils/notification";
import { CalendarOutlined, RedoOutlined } from "@ant-design/icons";
import { CandidateStatus, renderForm, sendOffer } from "./utils";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import BaseDrawer from "components/Drower";
import { useSelector } from "react-redux";
import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState } from "draft-js";
import {
  date_format,
  locationId,
  Move_Forward_Icon,
  View_Icon,
} from "utils/common-function";
import dayjs from "dayjs";
import StatusSelection from "../common-candidate-functions/status-selection";
const JobOffers = ({
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
  const [focused, setFocused] = useState("");
  const [isEditBasicInfo, setIsEditBasicInfo] = useState<any>();
  const [open, setOpen] = useState(false);
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [selectdFiles, setSelectedFiles] = useState([]);
  const [candidateId, setCandidateId] = useState<any>();
  const [loader, setLoader] = useState(false); // Initialize loading as true
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidate, setCandidate] = useState<any>(); // Initialize loading as true
  const [editorData, setEditorData] = useState<Editortype[]>([
    {
      question: EditorState.createEmpty(),
    },
  ]);
  const { globleCodes, companyDetails } = useSelector(
    (state: any) => state.auth
  );
  const handleClick = (type: string, item?: any) => {
    if (type === Actions.VIEW) {
      window.location.href = `${CITY_V2}admin/ats/job-offer-detail/${item?.id}/${item?.jobId}?offer`;
    }
    if (type === Actions.OFFER) {
      BaseFormMethod.setFieldsValue({
        candidate_name: item?.candidate_name,
        candidate_email: item?.email ? item?.email?.trim() : "",
      });

      setOpen(true);
      setCandidateId(item?.id);
    }
    if (type === Actions.ONBOARDING) {
      window.location.href = `${CITY_V2}admin/ats/onboarding-detail/${item?.id}`;
      // handleDeleteJobPost();
    }
    if (type === Actions.ISDELETE) {
      setIsModalOpen(true);
      setCandidate(item);
    }
  };

  const finalColumns = columns?.filter(
    (col: any) => col?.group_by === `${ColumnGroupBy.OFFER}`
  );
  finalColumns?.push({
    title: "Actions",
    key: "action",
    render: (value: any, item: any) => (
      <div style={{ display: "flex", gap: "8px" }}>
        {View_Icon(handleClick, item)}
        {item?.offer_status !== CandidateStatus.ACCEPTED && (
          <Tooltip title="Resend Offer">
            <div
              className="table-actions"
              onClick={() => handleClick(Actions.OFFER, item)}
            >
              <RedoOutlined />
            </div>
          </Tooltip>
        )}
        {item?.offer_status != "rejected" && (
          <>
            {item?.offer_status === "accepted" && (
              <Tooltip title="Onboarding">
                <div
                  className="table-actions"
                  onClick={() => handleClick(Actions.ONBOARDING, item)}
                >
                  <CalendarOutlined />
                </div>
              </Tooltip>
            )}
          </>
        )}
        {Move_Forward_Icon(handleClick, item)}
      </div>
    ),
  });
  const onClose = () => {
    setOpen(false);
    BaseFormMethod.resetFields();
    setEditorData([
      {
        question: EditorState.createEmpty(), // Reset editor to empty state
      },
    ]);
  };
  const onHandleSendOffer = async (value: any) => {
    setLoader(true);
    const formattedDate = value.offer_expire_date
      ? dayjs(value.offer_expire_date).format(date_format)
      : "";
    const obj = {
      status: "re-offered",
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
        setLoader(false);
      }
    );
    if (response?.status === 201 || response?.status === 200) {
      setEditorData([
        {
          question: EditorState.createEmpty(), // Reset to an empty editor state
        },
      ]);
      BaseFormMethod.resetFields();
      Successnotify("Offer sent successfully");
      setOpen(false);
      fetchCandidateDetail();
    }
  };
  const onSelectFiles = (files: any) => {
    setSelectedFiles(() => files);
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
          loading={loading}
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
        title="Resend Offer"
        placement={"right"}
        width={1000}
        open={open}
        onClose={onClose}
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
                open,
              })
            )}
          </Row>
          <Row gutter={16}>
            <Col span="24">
              <Form.Item>
                <Flex gap={8} justify="flex-end">
                  <BaseButton htmlType="submit" loading={loader}>
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

export default JobOffers;
