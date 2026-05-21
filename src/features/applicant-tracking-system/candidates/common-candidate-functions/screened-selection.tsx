import React from "react";
import { BaseButton } from "lib/citywide-commonmodules";
import { Row, Col, Flex } from "antd";

const ScreenedSelection = ({
  onHandleRejected,
  onhandelScheduleInterview,
}: any) => {
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Flex justify="flex-end" gap={4}>
          {/* Added gap with inline CSS */}
          <BaseButton className="secondary" onClick={onHandleRejected}>
            Rejected
          </BaseButton>
          <BaseButton onClick={onhandelScheduleInterview}>
            Schedule Interview
          </BaseButton>
        </Flex>
      </Col>
    </Row>
  );
};

export default ScreenedSelection;
