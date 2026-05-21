import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Modal, Flex, Input, Typography } from "antd";
import {
  BaseButton,
  BaseButtonsForm,
  BaseCard,
  BaseInputBox,
} from "lib/ui-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";

const OfferModal = ({
  openModal,
  success,
  handleReject,
  onChange,
  setShowSuccessModal,
  submitType,
}: {
  openModal: boolean;
  success: boolean;
  handleReject?: () => void;
  onChange?: (evt: any) => void;
  setShowSuccessModal: (evt: boolean) => void;
  submitType: string;
}) => {
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!openModal) {
      setRejectReason("");
    }
  }, [openModal]);

  return (
    <>
      <Modal
        open={openModal}
        width={600}
        onCancel={() => {
          if (submitType === "rejected" || submitType === "accepted") {
            setShowSuccessModal(true);
          } else {
            setShowSuccessModal(false);
          }
        }}
        footer={
          submitType === "rejected" || submitType === "accepted" ? (
            <Flex justify="end" gap={12}>
              <BaseButton
                type="default"
                htmlType="button"
                size="small"
                className="secondary"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Ok
              </BaseButton>
            </Flex>
          ) : (
            <Flex justify="end" gap={12}>
              <BaseButton
                type="default"
                htmlType="button"
                size="small"
                className="secondary"
                onClick={() => {
                  if (success) {
                    window.location.reload();
                  } else {
                    if (handleReject) handleReject();
                  }
                }}
              >
                Submit
              </BaseButton>
            </Flex>
          )
        }
        className="common-modal modal-with-card"
      >
        {submitType === "accepted" ? (
          <BaseButtonsForm.Item style={{ margin: 0, padding: "5%" }}>
            <Flex justify="center">
              <CheckCircleFilled
                style={{
                  fontSize: "60px",
                  color: "green",
                  marginBottom: "20px",
                }}
              />
            </Flex>
            <Flex justify="center">
              <Typography
                style={{
                  fontSize: "20px",
                }}
              >
                Thank you for accepting the offer.
              </Typography>
            </Flex>
          </BaseButtonsForm.Item>
        ) : submitType === "rejected" ? (
          <BaseButtonsForm.Item style={{ margin: 0, padding: "5%" }}>
            <Flex justify="center">
              <CheckCircleFilled
                style={{
                  fontSize: "60px",
                  color: "green",
                  marginBottom: "20px",
                }}
              />
            </Flex>
            <Flex justify="center">
              <Typography
                style={{
                  fontSize: "20px",
                }}
              >
                <h2>Thank You for Your Response</h2>
                <p>
                  We respect your decision and appreciate your time in
                  considering the offer. If you have any further questions or
                  would like to discuss future opportunities, please feel free
                  to contact us. Offer has been rejected!
                </p>
              </Typography>
            </Flex>
          </BaseButtonsForm.Item>
        ) : (
          <BaseCard title={"Reject Offer"}>
            <BaseInputBox.TextArea
              placeholder={"Enter Reason"}
              className="w-full"
              value={rejectReason}
              maxLength={250}
              onChange={(evt: any) => {
                if (onChange) {
                  onChange(evt);
                }
                setRejectReason(evt?.target.value);
              }}
              defaultValue={rejectReason}
              rows={5}
            />
          </BaseCard>
        )}
      </Modal>
    </>
  );
};

export default OfferModal;
