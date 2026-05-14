import React from "react";
import { BaseButton, BaseRadio } from "@deepak-pahwa/citywide-commonmodules";
import { Row, Col, Form, Radio, Flex } from "antd";
import { ColumnGroupBy } from "../../common-ats-functions/utils";

const SourcedSelection = ({
  statusValue,
  onChange,
  updateCandidateStatus,
  candidate,
}: any) => {
  return (
    <Row gutter={16}>
      <Col span={24}>
        <div className="c-mt-2">
          <strong className="candidate-information c-mb-0">Choose</strong>
        </div>
        <Form>
          <BaseRadio.Group
            onChange={onChange}
            value={statusValue}
            className="radio-group c-mt-4"
          >
            <BaseRadio value={ColumnGroupBy?.SCREENED}>
              Move To Screening
            </BaseRadio>
            {candidate?.status === ColumnGroupBy.BLACKLIST ? (
              <>
                <BaseRadio value={ColumnGroupBy?.SOURCED}>
                  Move To Applicant
                </BaseRadio>
                <BaseRadio value={ColumnGroupBy?.REJECTED}>
                  Reject Applicant
                </BaseRadio>
              </>
            ) : candidate?.status === ColumnGroupBy.REJECTED ? (
              <>
                <BaseRadio value={ColumnGroupBy?.SOURCED}>
                  Move To Applicant
                </BaseRadio>
                <BaseRadio value={ColumnGroupBy?.BLACKLIST}>
                  Blacklist Applicant
                </BaseRadio>
              </>
            ) : (
              <>
                <BaseRadio value={ColumnGroupBy?.REJECTED}>
                  Reject Applicant
                </BaseRadio>
                <BaseRadio value={ColumnGroupBy?.BLACKLIST}>
                  Blacklist Applicant
                </BaseRadio>
              </>
            )}
          </BaseRadio.Group>
          <Flex justify="end" gap={4}>
            <Form.Item wrapperCol={{ span: 24 }} className="c-m-0">
              <BaseButton
                type="primary"
                htmlType="submit"
                onClick={updateCandidateStatus}
              >
                Submit
              </BaseButton>
            </Form.Item>
          </Flex>
        </Form>
      </Col>
    </Row>
  );
};

export default SourcedSelection;
