import React, { useEffect, useState } from "react";
import { Flex, Radio, Spin, Col, Row, Input, Typography } from "antd";
import { BaseButton } from "lib/ui-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import {
  getCandidateDetail,
  getJobOfferDetail,
  updateOfferStatus,
} from "services/api-services/ats-apis";
import { useLocation, useParams } from "react-router-dom";
const { TextArea } = Input;
import dayjs from "dayjs";
import { Errornotify, Successnotify } from "utils/notification";
import CandidateInfo from "./screened-detail";
import { setActiveTab } from "redux/auth/slice";
import { useDispatch } from "react-redux";
import { CandidateStatus, statusVal, statusValues } from "./utils";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import { simplifyFormData } from "../../common-ats-functions/utils";
import { EditOutlined } from "@ant-design/icons";

export default function JobOfferDetailPage() {
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<any>();
  const [jobOfferDetail, setJobOfferDetail] = useState<any>();
  const { id, jobId } = useParams();
  const [status, setStatus] = useState<string>("");
  const [notes, setComments] = useState<string>("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [showJobOfferStatus, setShowJobOfferStatus] = useState(false); // Step 1: State to track visibility

  const dispatch = useDispatch();
  const location = useLocation(); // Gets the full URL including the query string
  const params = new URLSearchParams(location.search); // Parse query string
  const offer = params.has("offer");
  const fetchJobOfferDetail = async () => {
    setLoading(true);
    try {
      const response = await getJobOfferDetail(id, jobId).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        const { data } = response || {};
        const { data: jobData } = data || {};
        if (jobData) {
          setJobOfferDetail(jobData);
          setStatus(jobData.status);
          setComments(jobData.notes);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = (e: any) => {
    setStatus(e.target.value);
  };

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
        const candidateData = response?.data?.data;
        setCandidate(candidateData);
        if (candidateData?.status === CandidateStatus.RE_OFFERED) {
          setStatus("offered");
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCandidateData();
  }, []);

  const onHandleJobStatus = async () => {
    setStatusLoading(true);

    const obj = {
      status: status,
      notes: notes,
    };
    const res: any = await updateOfferStatus(id, obj).finally(() => {
      setStatusLoading(false);
    });
    if (res?.status === 201 || res?.status === 200) {
      Successnotify("Applicant status updated successfully");
      setShowJobOfferStatus(false);
      fetchCandidateData();
      fetchJobOfferDetail();

      if (status === CandidateStatus.ACCEPTED) {
        window.location.href = `${CITY_V2}admin/ats/onboarding-detail/${id}`;
        dispatch(setActiveTab(ColumnGroupBy.ONBOARDING));
      }
    } else {
      Errornotify("Something went wrong!");
    }
  };
  const simplifiedData = simplifyFormData(candidate?.form_data);

  const currentStatusValues =
    candidate?.status === "re-offered" ? statusVal : statusValues;
  const handleEditNotes = () => {
    setShowJobOfferStatus(true);
  };
  return (
    <div>
      <div className="base-card">
        <Flex justify="space-between" className="page-heading">
          <h1 className="heading-text">
            <a className="backIcon" href={`${CITY_V2}admin/ats/candidates`}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            Job Offer Detail
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
              <div className="candidate-details">
                <Row>
                  <Col span={24} sm={12} md={8} lg={6}>
                    <div className="candidate-information">
                      <strong> Job Offer Sent At </strong>
                      <span>
                        {jobOfferDetail?.offer_sent_at
                          ? dayjs
                              .utc(jobOfferDetail.offer_sent_at)
                              .format("MM/DD/YYYY")
                          : null}
                      </span>
                    </div>
                  </Col>
                  <Col span={24} sm={12} md={8} lg={6}>
                    <div className="candidate-information">
                      <strong>Job Offer Expire At</strong>
                      <span>
                        {jobOfferDetail?.offer_expire_at
                          ? dayjs
                              .utc(jobOfferDetail.offer_expire_at)
                              .format("MM/DD/YYYY")
                          : null}
                      </span>
                    </div>
                  </Col>
                  <Col span={24} sm={12} md={8} lg={6}>
                    <div className="candidate-information">
                      <strong>Message </strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: jobOfferDetail?.message ?? "",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={24} sm={12} md={8} lg={6}>
                    <div className="candidate-information">
                      <strong>Status </strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: jobOfferDetail?.status ?? "",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={24} sm={12} md={8} lg={6}>
                    <div className="candidate-information">
                      <Flex gap={8}>
                        <strong>Notes </strong>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: jobOfferDetail?.notes ?? "",
                          }}
                        />
                        <span>
                          <EditOutlined onClick={handleEditNotes} />
                        </span>
                      </Flex>
                    </div>
                  </Col>
                  {showJobOfferStatus && (
                    <Col span={24}>
                      <strong className="candidate-information">
                        Offer status
                      </strong>

                      <Radio.Group
                        value={status}
                        onChange={handleStatusChange}
                        style={{ marginTop: 10 }}
                      >
                        {currentStatusValues.map((statusItem: any) => (
                          <Radio
                            key={statusItem.value}
                            value={statusItem.value}
                          >
                            {statusItem.label}
                          </Radio>
                        ))}
                      </Radio.Group>
                      <TextArea
                        value={notes}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Add comments or notes..."
                        rows={4}
                        style={{ marginTop: 10 }}
                        maxLength={250}
                      />
                      <Flex gap={8} justify="flex-end">
                        <BaseButton
                          type="primary"
                          style={{ marginTop: 10 }}
                          onClick={() => {
                            onHandleJobStatus();
                          }}
                          loading={statusLoading}
                        >
                          Update Status
                        </BaseButton>
                      </Flex>
                    </Col>
                  )}
                </Row>
              </div>

              <div className="candidate-details  c-mt-2">
                <CandidateInfo
                  candidate={candidate}
                  simplifiedData={simplifiedData}
                  offer={offer}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
