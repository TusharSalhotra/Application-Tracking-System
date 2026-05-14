import React, { useState } from "react";
import { Modal, Button } from "antd";
import { BaseButton, BaseCard } from "@deepak-pahwa/citywide-commonmodules";

interface ButtonProps {
  label: string;
  handler: () => void;
}

interface AtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  primaryButton: ButtonProps;
  secondaryButton: ButtonProps;
}

const AtsModal: React.FC<AtsModalProps> = ({
  isOpen,
  onClose,
  message,
  primaryButton,
  secondaryButton,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      onClose();
      setConfirmLoading(false);
    }, 2000);
  };

  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onClose}
      footer={null} // Remove default footer to use custom buttons
      className="common-modal ats-modal"
      closeIcon
      closable
      centered
    ><BaseCard title="">
      <p>{message}</p>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
        <BaseButton className="secondary" onClick={secondaryButton.handler}>
          {secondaryButton.label}
        </BaseButton>
        <BaseButton onClick={primaryButton.handler}>
          {primaryButton.label}
        </BaseButton>
      </div>
      </BaseCard>
    </Modal>
  );
};

export default AtsModal;
