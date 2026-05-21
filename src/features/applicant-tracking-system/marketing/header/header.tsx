import React from "react";
import { BaseButton } from "lib/ui-commonmodules";
import { Flex } from "antd";
interface HeaderProps {
  logo: string; // logo passed from the parent
  applied?: any;
  color?: string;
  handelBack?: () => void;
}
const Header: React.FC<HeaderProps> = ({
  logo,
  applied,
  handelBack,
  color,
}) => {
  return (
    <Flex className="header c-w-full" justify="space-between" align="center">
      {logo ? (
        <img
          src={logo}
          className="header-logo"
          style={{ height: "87px" }}
          alt="Dummy project logo"
        />
      ) : (
        ""
      )}
      {applied ? (
        <BaseButton
          style={{ background: color, borderColor: color }}
          key="back"
          onClick={() => {
            handelBack();
          }}
        >
          Back
        </BaseButton>
      ) : (
        ""
      )}
    </Flex>
  );
};

export default Header;
