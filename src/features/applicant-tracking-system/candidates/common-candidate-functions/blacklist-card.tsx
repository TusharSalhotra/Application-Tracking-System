import React, { useEffect } from "react";
import {
  BaseButton,
  BaseCard,
  BaseRadio,
} from "lib/ui-commonmodules";
import { Flex, Form, Radio, Input } from "antd";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import { useForm } from "antd/es/form/Form";

const BlacklistCard = ({
  statusValue,
  onFinish,
  globleCodes,
  takeReason,
  loader,
  forminstance,
  is_header = true,
  isAction,
  handleCancel,
  isOpen,
  renderCount
}: any) => {
  const blacklist_types = [
    {
      id: "1",
      value: "Over Qualified",
    },
    {
      id: "3",
      value: "Previously Applied",
    },
    {
      id: "4",
      value: "Previously Denied",
    },
    {
      id: "2",
      value: "Under Qualified",
    },
    {
      id:"5",
      value:"Other"
    }
  ];

  useEffect(()=>{
    forminstance.setFieldsValue({
      notes: "",
      reason:""
    })
  }, [isOpen, renderCount])


  return is_header ? (
    <BaseCard title={"Confirm Status"} className="blacklist-card">
      {takeReason && (
        <h3 className="c-mb-2 blacklist-card-heading">
          Please mention the reason for{" "}
          {statusValue === ColumnGroupBy.BLACKLIST ? " blacklist" : " reject"}{" "}
          the applicant{" "}
        </h3>
      )}
      {takeReason && (
        <Form layout="vertical" onFinish={onFinish} form={forminstance}>
          <Form.Item
            name="reason"
            key="reason"
            rules={[
              {
                required: true,
                message: "Please select a qualification status!",
              },
            ]}
            initialValue={""}
          >
            <BaseRadio.Group className="radio-group">
              {globleCodes?.blacklisted_types
                ? globleCodes?.blacklisted_types
                : blacklist_types?.map((option: any) => (
                    <BaseRadio key={option.id} value={option?.value}>
                      {option?.value}
                    </BaseRadio>
                  ))}
            </BaseRadio.Group>
          </Form.Item>

          <Form.Item
            name="notes"
            key="notes"
            label="Notes"
            rules={[
              {
                required: false,
                message: "Please add some comments!",
              },
              {
                max: 250,
                message: "Comments cannot exceed 250 characters!",
              },
            ]}
          >
            <Input.TextArea className="w-full" rows={4} maxLength={250} />
          </Form.Item>
          <Flex justify="end" gap={16} className="c-mt-2">
            <Form.Item className="c-m-0">
              <BaseButton loading={loader} htmlType="submit">
                Submit
              </BaseButton>
            </Form.Item>
          </Flex>
        </Form>
      )}
    </BaseCard>
  ) : (
    <div className="blacklist-card">
      {takeReason && (
        <h3 className="c-mb-2 blacklist-card-heading">
          Please mention the reason for{" "}
          {statusValue === ColumnGroupBy.BLACKLIST ? " blacklist" : " reject"}{" "}
          the applicant{" "}
        </h3>
      )}
      {takeReason && (
        <Form layout="vertical" onFinish={onFinish} form={forminstance}>
          <Form.Item
            name="reason"
            key="reason"
            rules={[
              {
                required: true,
                message: "Please select a qualification status!",
              },
            ]}
            initialValue={""}
          >
            <BaseRadio.Group className="radio-group c-m-0">
              {globleCodes?.blacklisted_types
                ? globleCodes?.blacklisted_types
                : blacklist_types?.map((option: any) => (
                    <BaseRadio key={option.id} value={option?.value}>
                      {option?.value}
                    </BaseRadio>
                  ))}
            </BaseRadio.Group>
          </Form.Item>

          <Form.Item
            name="notes"
            key="notes"
            label="Notes"
            rules={[
              {
                required: false,
                message: "Please add some comments!",
              },
              {
                max: 250,
                message: "Comments cannot exceed 250 characters!",
              },
            ]}
          >
            <Input.TextArea className="w-full" rows={4} maxLength={250} />
          </Form.Item>
          <Form.Item className="c-m-0">
            <Flex justify="end" gap={8} className="c-mt-2">
              <BaseButton loading={loader} htmlType="submit">
                Submit
              </BaseButton>
            </Flex>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default BlacklistCard;
