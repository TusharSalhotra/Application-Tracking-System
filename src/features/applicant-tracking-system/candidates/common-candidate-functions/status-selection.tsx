// @ts-nocheck
import React, { act, useState } from "react";
import {
  BaseButton,
  BaseButtonsForm,
  BaseCard,
  BaseCol,
  BaseRadio,
  BaseRow,
} from "lib/ui-commonmodules";
import { Row, Col, Form, Radio, Flex, Modal } from "antd";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import BlacklistCard from "./blacklist-card";
import { useSelector } from "react-redux";
import { locationId } from "utils/common-function";
import { Errornotify, Successnotify } from "utils/notification";
import {
  handleDeleteCandidate,
  messages,
  messagesTest,
} from "../candidate-tabs.tsx/utils";
import { updateCandidateStatus } from "services/api-services/ats-apis";
import { RadioChangeEvent } from "antd/lib";
import Swal from "sweetalert2";

const StatusSelection = ({
  candidate,
  is_modal = true,
  fetchCandidateDetail,
  setCandidate,
  title,
  isModalOpen,
  setIsModalOpen,
}: any) => {
  const [statusValue, setStatusValue] = useState<any>();
  const [isRejected, setIsRejected] = useState<any>(false);
  const [loader, setLoader] = useState(false); // Initialize loading as true
  const [takeReason, setTakeReason] = useState<Boolean>(false);
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const { globleCodes, companyDetails, activeTab } = useSelector(
    (state: any) => state.auth
  );
  // Render the appropriate Radio options based on candidate status
  const renderStatusOptions = (status: string | undefined) => {
    if (activeTab === ColumnGroupBy.SOURCED) {
      return (
        <>
          <BaseRadio value={ColumnGroupBy?.SCREENED}>
            Move To Screening
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.REJECTED}>Reject Applicant</BaseRadio>
          <BaseRadio value={ColumnGroupBy.BLACKLIST}>
            Blacklist Applicant
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.Archived}>
            Archive Applicant
          </BaseRadio>
          {/* <Radio value={ColumnGroupBy?.SCHEDULE_INTERVIEW}>Move To Interview</Radio> */}
        </>
      );
    } else if (activeTab === ColumnGroupBy.SCREENED) {
      return (
        <>
          <BaseRadio value={ColumnGroupBy.SOURCED}>
            Move To Applicants
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.REJECTED}>Reject Applicant</BaseRadio>
          <BaseRadio value={ColumnGroupBy.BLACKLIST}>
            Blacklist Applicant
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.Archived}>
            Archive Applicant
          </BaseRadio>
          {/* <BaseRadio value={ColumnGroupBy?.SCHEDULE_INTERVIEW}>Move To Interview</BaseRadio> */}
        </>
      );
    } else if (activeTab === ColumnGroupBy.SCHEDULE_INTERVIEW) {
      return (
        <>
          <BaseRadio value={ColumnGroupBy.SOURCED}>
            Move To Applicants
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy?.SCREENED}>
            Move To Screening
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.REJECTED}>Reject Applicant</BaseRadio>
          <BaseRadio value={ColumnGroupBy.BLACKLIST}>
            Blacklist Applicant
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.Archived}>
            Archive Applicant
          </BaseRadio>
        </>
      );
    } else if (activeTab === ColumnGroupBy.OFFERED) {
      return (
        <>
          <BaseRadio value={ColumnGroupBy.SOURCED}>
            Move To Applicants
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy?.SCREENED}>
            Move To Screening
          </BaseRadio>
          {/* <BaseRadio value={ColumnGroupBy.SCHEDULE_INTERVIEW}>Move To Interview</BaseRadio> */}
          <BaseRadio value={ColumnGroupBy.REJECTED}>Reject Applicant</BaseRadio>
          <BaseRadio value={ColumnGroupBy.BLACKLIST}>
            Blacklist Applicant
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.Archived}>
            Archive Applicant
          </BaseRadio>
        </>
      );
    } else if (
      activeTab === ColumnGroupBy.ONBOARDING &&
      status === ColumnGroupBy.PENDING
    ) {
      // for Onboarding
      return (
        <>
          <BaseRadio value={ColumnGroupBy.SOURCED}>
            Move To Applicants
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy?.SCREENED}>
            Move To Screening
          </BaseRadio>
          {/* <BaseRadio value={ColumnGroupBy.SCHEDULE_INTERVIEW}>Move To Interview</BaseRadio> */}
          <BaseRadio value={ColumnGroupBy.REJECTED}>Reject Applicant</BaseRadio>
          <BaseRadio value={ColumnGroupBy.BLACKLIST}>
            Blacklist Applicant
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy.Archived}>
            Archive Applicant
          </BaseRadio>
        </>
      );
    } else if (activeTab === ColumnGroupBy?.REJECTED) {
      if (status === ColumnGroupBy.BLACKLIST) {
        return (
          <>
            <BaseRadio value={ColumnGroupBy.SOURCED}>
              Move To Applicants
            </BaseRadio>
            <BaseRadio value={ColumnGroupBy?.SCREENED}>
              Move To Screening
            </BaseRadio>
            {/* <BaseRadio value={ColumnGroupBy.SCHEDULE_INTERVIEW}>Move To Interview</BaseRadio> */}
            <BaseRadio value={ColumnGroupBy.REJECTED}>
              Reject Applicant
            </BaseRadio>
            <BaseRadio value={ColumnGroupBy.Archived}>
              Archive Applicant
            </BaseRadio>
          </>
        );
      } else if (status === ColumnGroupBy.REJECTED) {
        return (
          <>
            <BaseRadio value={ColumnGroupBy.SOURCED}>
              Move To Applicants
            </BaseRadio>
            <BaseRadio value={ColumnGroupBy?.SCREENED}>
              Move To Screening
            </BaseRadio>
            {/* <BaseRadio value={ColumnGroupBy.SCHEDULE_INTERVIEW}>Move To Interview</BaseRadio> */}
            <BaseRadio value={ColumnGroupBy.BLACKLIST}>
              Blacklist Applicant
            </BaseRadio>
            <BaseRadio value={ColumnGroupBy.Archived}>
              Archive Applicant
            </BaseRadio>
          </>
        );
      }
    } else if (activeTab === ColumnGroupBy.Archived) {
      return (
        <>
          <BaseRadio value={ColumnGroupBy.SOURCED}>
            Move To Applicants
          </BaseRadio>
          <BaseRadio value={ColumnGroupBy?.SCREENED}>
            Move To Screening
          </BaseRadio>
          {/* <BaseRadio value={ColumnGroupBy.SCHEDULE_INTERVIEW}>Move To Interview</BaseRadio> */}
          <BaseRadio value={ColumnGroupBy.REJECTED}>Reject Applicant</BaseRadio>
          <BaseRadio value={ColumnGroupBy.BLACKLIST}>
            Blacklist Applicant
          </BaseRadio>
        </>
      );
    } else {
      return null;
    }
  };

  const rejectApiWithConfirm = async (value: any, status: string) => {
    setLoader(true);
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
    const response = await updateCandidateStatus(candidate.id, object).finally(
      () => {
        setLoader(false);
      }
    );
    if (response?.status === 201 || response?.status === 200) {
      setIsModalOpen(false);
      setIsRejected(false);
      setStatusValue("");
      if (fetchCandidateDetail) {
        fetchCandidateDetail();
      }

      // dispatch(setActiveTab(ColumnGroupBy.SCREENED)); // Update Redux state
      Successnotify(messages[statusValue ? statusValue : status] || "");
    } else {
      response?.data?.err?.errorMessage?.forEach((msg: any) => {
        Errornotify(msg?.message || "Something went wrong!");
      });
    }
  };
  const onFinish = (value: any) => {
    onHandleUpdateCandidateStatus(statusValue, "", value);
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
        const response = await updateCandidateStatus(
          candidate.id,
          object
        ).finally(() => {
          setLoader(false);
        });
        if (response?.status === 201 || response?.status === 200) {
          setIsModalOpen(false);
          setIsRejected(false);
          if (fetchCandidateDetail) {
            fetchCandidateDetail();
          }
          Successnotify(messages[statusValue ? statusValue : status] || "");
        } else {
          response?.data?.err?.errorMessage?.forEach((msg: any) => {
            Errornotify(msg?.message || "Something went wrong!");
          });
        }
      } catch (error) {
        Errornotify("Something went wrong!");
      }
    }
  };
  const onHandleRejected = (value: any) => {
    if (statusValue === ColumnGroupBy.Archived) {
      handleDeleteCandidate(
        candidate?.id,
        fetchCandidateDetail,
        setLoader,
        setIsModalOpen
      );
    } else if (
      statusValue === ColumnGroupBy.SCREENED ||
      statusValue === ColumnGroupBy.SOURCED ||
      statusValue === ColumnGroupBy?.SCHEDULE_INTERVIEW
    ) {
      onHandleUpdateCandidateStatus();
    } else {
      setIsRejected(!isRejected);
      setTakeReason(true);
    }
  };
  const onChange = (e: RadioChangeEvent) => {
    setStatusValue(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCandidate(null); // Reset candidate state
    setStatusValue(""); // Reset status value
    setIsRejected(false); // Reset rejection status
    setTakeReason(false); // Reset take reason state
    BaseFormMethod.resetFields(); // Reset form fields
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      width={800}
      centered
      onClose={() => {
        BaseFormMethod.resetFields();
      }}
      className="common-modal modal-with-card "
    >
      <BaseCard title={title}>
        <div>
          {isRejected ? (
            <BlacklistCard
              statusValue={statusValue}
              onFinish={onFinish}
              globleCodes={globleCodes}
              takeReason={takeReason}
              loader={loader}
              forminstance={BaseFormMethod}
              is_header={false}
              isAction={true}
              handleCancel={() => setIsRejected(false)}
              isOpen={isModalOpen} 
            />
          ) : (
            <>
              <div className="c-mt-2 c-mb-1">
                {is_modal ? (
                  <strong className="candidate-information">
                    {`Select an option to Move ${candidate?.candidate_name} in the following`}
                  </strong>
                ) : (
                  <span className="candidate-information">Choose</span>
                )}
              </div>
              <Form>
                <Radio.Group
                  onChange={onChange}
                  value={statusValue}
                  className="radio-group"
                >
                  {renderStatusOptions(candidate?.intialStatus)}
                </Radio.Group>
                <Flex justify="end" gap={4}>
                  <Form.Item wrapperCol={{ span: 24 }} className="c-m-0">
                    <BaseButton
                      type="primary"
                      htmlType="submit"
                      loading={loader}
                      onClick={onHandleRejected}
                    >
                      Submit
                    </BaseButton>
                  </Form.Item>
                </Flex>
              </Form>
            </>
          )}
        </div>
      </BaseCard>
    </Modal>
  );
};

export default StatusSelection;
