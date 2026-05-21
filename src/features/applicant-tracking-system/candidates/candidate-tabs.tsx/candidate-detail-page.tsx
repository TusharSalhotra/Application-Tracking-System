// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Progress, Flex, Col, Row, Spin, Modal } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import {
  BaseButton,
  BaseButtonsForm,
  BaseCard,
} from "lib/citywide-commonmodules";
import {
  CITY_V2,
  DIGITALOCEAN_SPACES_ENDPOINT_ACCESS,
} from "services/api-services/constants";
import {
  getCandidateDetail,
  updateCandidateStatus,
} from "services/api-services/ats-apis";
import { useParams } from "react-router-dom";
import { RadioChangeEvent } from "antd/lib";
import { locationId } from "utils/common-function";
import { useDispatch, useSelector } from "react-redux";
import { messages, messagesTest, submitInterviewDetails } from "./utils";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import Swal from "sweetalert2";
import { Errornotify, Successnotify } from "utils/notification";
import { setActiveTab } from "redux/auth/slice";
import BaseDrawer from "components/Drower";
import InterviewSchedule from "./schedule-interview-page";
import CandidateInfo from "./screened-detail";
import SourcedSelection from "../common-candidate-functions/sourced-selection";
import ScreenedSelection from "../common-candidate-functions/screened-selection";
import BlacklistCard from "../common-candidate-functions/blacklist-card";

import { simplifyFormData } from "../../common-ats-functions/utils";

export default function CandidateDetail() {
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false); // Initialize loading as true
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [candidate, setCandidate] = useState<any>(); // Initialize loading as true
  const { id } = useParams();
  const [statusValue, setStatusValue] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [isOffLine, setIsOffLine] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [takeReason, setTakeReason] = useState<Boolean>(false);
  const [renderCount, setRenderCount] = useState(0)
  const { globleCodes, companyDetails } = useSelector(
    (state: any) => state.auth
  );
  const dispatch = useDispatch();

  const [isRejected, setIsRejected] = useState<any>(false);

  const fetchCandidateData = async () => {
    setLoading(true);
    try {
      const response = await getCandidateDetail(id).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setCandidate(response?.data?.data);
        setStatusValue(
          response?.data?.data?.status === ColumnGroupBy.SOURCED
            ? ColumnGroupBy?.SCREENED
            : ""
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCandidateData();
  }, []);

  const onHandleRejected = (value: any) => {
    if (
      statusValue === ColumnGroupBy.SCREENED ||
      statusValue === ColumnGroupBy.SOURCED ||
      statusValue === ColumnGroupBy?.SCHEDULE_INTERVIEW
    ) {
      onHandleUpdateCandidateStatus();
    } else {
      setRenderCount(renderCount + 1)
      setIsRejected(!isRejected);
      setTakeReason(true);
    }
  };
  const onhandelScheduleInterview = () => {
    setOpen(true);
  };
  const onFinish = (value: any) => {
    onHandleUpdateCandidateStatus(statusValue, "", value);
  };

  const rejectApiWithConfirm = async (value: any, status: string) => {
    setLoader(true);
    try {
      const obj = {
        status: statusValue ? statusValue : status,
        company_id: companyDetails?.id,
        location_id: locationId,
      };
      const blacklistObj = {
        ...value,
        status: statusValue ? statusValue : status,
        company_id: companyDetails?.id,
        location_id: locationId,
      };
      const object = statusValue != ColumnGroupBy.SCREENED ? blacklistObj : obj;
      const response = await updateCandidateStatus(id, object).finally(() => {
        setLoader(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        fetchCandidateData();
        setIsRejected(false);
        setStatusValue("");
        dispatch(setActiveTab(ColumnGroupBy.SCREENED)); // Update Redux state
        Successnotify(messages[statusValue ? statusValue : status] || "");
      }
    } catch (error) {
      Errornotify("Something went wrong!");
    }
  };

  const onHandleUpdateCandidateStatus = async (
    status?: any,
    type?: any,
    value?: any
  ) => {
    if (
      status != ColumnGroupBy.BLACKLIST &&
      status != ColumnGroupBy.REJECTED &&
      !isRejected
    ) {
      const result = await Swal.fire({
        title: "Are You Sure?",
        text: messagesTest[statusValue ? statusValue : status] || "",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        reverseButtons: false,
        customClass: {
          cancelButton: "red-cancel-button",
        },
      });
      if (result.isConfirmed) {
        rejectApiWithConfirm(value, status || ColumnGroupBy.REJECTED);
      }
    } else if (isRejected) {
      rejectApiWithConfirm(value, status || ColumnGroupBy.REJECTED);
    } else {
      setLoader(true);
      try {
        const obj = {
          ...value,
          status: statusValue ? statusValue : status,
          company_id: companyDetails?.id,
          location_id: locationId,
        };
        const blacklistObj = {
          ...value,
          status: status,
          company_id: companyDetails?.id,
          location_id: locationId,
        };
        const object =
          statusValue != ColumnGroupBy.SCREENED ? blacklistObj : obj;
        const response = await updateCandidateStatus(id, object).finally(() => {
          setLoader(false);
        });
        if (response?.status === 201 || response?.status === 200) {
          fetchCandidateData();
          setIsRejected(false);
          Successnotify(messages[statusValue ? statusValue : status] || "");
        }
      } catch (error) {
        Errornotify("Something went wrong!");
      }
    }
  };

  const onChange = (e: RadioChangeEvent) => {
    setStatusValue(e.target.value);
  };
  const onHandleChange = (value?: any) => {
    setStatusValue(value);
    setTakeReason(true);
  };

  const simplifiedData = simplifyFormData(candidate?.form_data);

  return (
    <div>
      <div className="base-card">
        <Flex justify="space-between" className="page-heading">
          <h1 className="heading-text">
            <a className="backIcon" href={`${CITY_V2}admin/ats/candidates`}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            Applicant Details 
          </h1>
          <BaseButton
            type="default"
            className="secondary"
            onClick={() => {
              window.location.href = `${CITY_V2}admin/ats/candidates`;
            }}
          >
            Back
          </BaseButton>
        </Flex>

        <div className="base-card-body">
          {loading ? (
            <div className="center-loader">
              <Spin />
            </div>
          ) : candidate ? (
            <div className="candidate-details">
              <CandidateInfo
                candidate={candidate}
                simplifiedData={simplifiedData}
              />

              {candidate?.status === ColumnGroupBy.SOURCED ||
              candidate?.status === ColumnGroupBy.BLACKLIST ||
              candidate?.status === ColumnGroupBy.REJECTED ? (
                <div>
                  <SourcedSelection
                    statusValue={statusValue}
                    onChange={onChange}
                    updateCandidateStatus={onHandleRejected}
                    globleCodes
                    candidate={candidate}
                  />
                </div>
              ) : (
                ""
              )}
              {candidate?.status === ColumnGroupBy.SCREENED ? (
                <ScreenedSelection
                  onHandleRejected={onHandleRejected}
                  onhandelScheduleInterview={onhandelScheduleInterview}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <Row gutter={16}>
              <Col span={24}>
                <strong>No Data Found.</strong>
              </Col>
            </Row>
          )}
          <Modal
            open={isRejected}
            onCancel={onHandleRejected}
            className="common-modal modal-with-card blacklist-modal"
            width={800}
            closeIcon
            centered
            onClose={() => {
              BaseFormMethod.resetFields();
            }}
            footer={null}
          >
            <BlacklistCard
              statusValue={statusValue}
              onFinish={onFinish}
              globleCodes={globleCodes}
              takeReason={takeReason}
              loader={loader}
              forminstance={BaseFormMethod}
              isOpen={isRejected}
              renderCount={renderCount}
            />
          </Modal>
          <BaseDrawer
            title="Schedule Interview"
            open={open}
            onClose={() => {
              setOpen(false);
              BaseFormMethod.resetFields(); // Reset form fields when drawer is closed
            }}
            width={1000}
          >
            <InterviewSchedule
              candidateDetail={candidate}
              companyDetails={companyDetails}
              onFinish={(value: any) =>
                submitInterviewDetails(
                  value,
                  setLoader,
                  candidate,
                  companyDetails,
                  setOpen,
                  fetchCandidateData,
                  "schedule-interview",
                  id
                )
              }
              loader={loader}
              formInstance={BaseFormMethod}
              setIsOffLine={setIsOffLine}
              isOffLine={isOffLine}
              setIsOnline={setIsOnline}
              isOnline={isOnline}
            />
          </BaseDrawer>
        </div>
      </div>
    </div>
  );
}
