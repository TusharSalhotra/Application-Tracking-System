import React from "react";
import { Drawer, Space, Button, Flex } from "antd";
import { BaseButton } from "@deepak-pahwa/citywide-commonmodules";

interface CommonDrawerProps {
  title: string;
  placement?: "top" | "right" | "bottom" | "left";
  width?: number | string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  extraButtons?: React.ReactNode; // Optional extra buttons
  className?: string; // Optional custom class name
}

const BaseDrawer: React.FC<CommonDrawerProps> = ({
  title,
  placement = "right",
  width = 500,
  open,
  onClose,
  children,
  extraButtons,
  className,
}) => {
  return (
    <Drawer
      title={title}
      placement={placement}
      width={width}
      onClose={onClose}
      open={open}
      className={`${className} ats-drawer`}
      extra={extraButtons}
    >
      {children}
    </Drawer>
  );
};

export default BaseDrawer;
