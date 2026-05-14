import {
  BaseButton,
  BaseButtonsForm,
  BaseRadio,
  Option,
} from "@deepak-pahwa/citywide-commonmodules";
import { Form, Row, Col, Calendar, Select, Input, Radio, Flex } from "antd";
import { useWatch } from "antd/es/form/Form";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { capitalize } from "lodash";
import { interviewmode, meeting_mode, timeSlots } from "./utils";
import dayjs, { Dayjs } from "dayjs";

const InterviewSchedule = ({
  candidateDetail,
  companyDetails,
  onFinish,
  loader,
  formInstance,
  setIsOffLine,
  isOffLine,
  setIsOnline,
  isOnline,
}: any) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [timeSlot, setTimeSlot] = useState<number | null>(null);
  const [fromTimeOptions, setFromTimeOptions] = useState<string[]>([]);
  const [endTime, setEndTime] = useState<string | null>(null);

  const [focused, setFocused] = useState("");
  const isValueFilled = (fieldName: any) => {
    const value = formInstance?.getFieldValue(fieldName); // Replace 'fieldName' with your field name
    return !!value; // Returns true if value is filled, false otherwise
  };
  const from_time = useWatch("from_time", formInstance);
  const time_slots = useWatch("time_slots", formInstance);
  const generateTimeSlots = (
    start: string,
    end: string,
    interval: number
  ): string[] => {
    const startTime = moment(start);
    const endTime = moment(end);
    const slots: string[] = [];

    while (startTime.isBefore(endTime)) {
      slots.push(startTime.format("hh:mm"));
      startTime.add(interval, "minutes");
    }

    return slots;
  };

  const handleTimeSlotChange = (value: string) => {
    const interval = parseInt(value.split(" ")[0], 10); // Extract interval
    setTimeSlot(interval);

    if (companyDetails?.working_hours?.length === 2) {
      const [start, end] = companyDetails.working_hours;
      const slots = generateTimeSlots(start, end, interval);
      setFromTimeOptions(slots);
    }
  };

  const handleFromTimeChange = (value: string) => {
    if (timeSlot) {
      const startTime = moment(value, "hh:mm");
      const calculatedEndTime = startTime
        .add(timeSlot, "minutes")
        .format("hh:mm");
      setEndTime(calculatedEndTime);
    }
  };
  // open Calendar
  const onPanelChange = (value: any, mode: any) => {
    console.log("Panel changed:", value, mode);
  };
  const disabledDate = (current: any) => {
    // Disable dates strictly before today
    const today = dayjs().startOf("day");
    return current && current <= today;
  };
  const handleModeChange = (value: any) => {
    if (value == "offline") {
      setIsOnline(false);
      setIsOffLine(true);
    }
    if (value == "online") {
      setIsOnline(true);
      setIsOffLine(false);
    }
  };
  useEffect(() => {
    if (from_time && time_slots) {
      const timeSelected = time_slots ? Number(time_slots?.split(" ")?.[0]) : 0;
      const updatedTime = moment
        .utc(from_time, "hh:mm")
        .add(timeSelected, "minutes")
        .format("hh:mm");

      formInstance.setFieldsValue({
        end_time: updatedTime,
      });
    }
  }, [from_time, time_slots]);

  const validRange: [Dayjs, Dayjs] = [
    dayjs().startOf("year"),
    dayjs().endOf("year").add(10, "year"),
  ];

  return (
    <div className="schedule-interview-container">
      <div className="schedule-interview-title">
        {capitalize(candidateDetail?.candidate_name ?? "") ||
          `${candidateDetail?.first_name ?? ""} ${candidateDetail?.last_name}`}
      </div>
      <div className="email-interview-schedule">
        Email Id:{" "}
        <a href={`mailto:${candidateDetail?.email ?? ""}`}>
          {candidateDetail?.email}
        </a>
      </div>

      <Form
        layout="vertical"
        className="schedule-interview-form"
        form={formInstance}
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="interview_date"
              rules={[
                {
                  required: true,
                  message: "Please select an interview date",
                },
              ]}
              initialValue={selectedDate}
            >
              <Calendar
                fullscreen={false}
                onPanelChange={onPanelChange}
                disabledDate={disabledDate}
                value={selectedDate}
                validRange={validRange}
                onChange={setSelectedDate}
                className="interview-scheduler"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Row gutter={[16, 16]} className="scheduler-form">
              <Col span={24}>
                <Form.Item
                  className={`floating-label-input ${
                    isValueFilled("time_slots") || focused === "time_slots"
                      ? "focused "
                      : ""
                  }`}
                  name="time_slots"
                  label="Select Time Slot"
                  rules={[
                    {
                      required: true,
                      message: "Please select a time slot",
                    },
                  ]}
                >
                  <Select
                    onBlur={(e: any) => {
                      if (!e.target.value) {
                        setFocused("");
                      }
                    }}
                    onFocus={() => setFocused("time_slots")}
                    defaultValue="Select Time"
                    className="form-input CHS-input"
                    onChange={handleTimeSlotChange}
                  >
                    {timeSlots.map((slot) => (
                      <Option key={slot} value={slot}>
                        {slot}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className={`floating-label-input ${
                    isValueFilled("from_time") || focused === "from_time"
                      ? "focused "
                      : ""
                  }`}
                  label="Start time"
                  name="from_time"
                  rules={[
                    {
                      required: true,
                      message: "Please select the start time",
                    },
                  ]}
                >
                  <Select
                    onChange={handleFromTimeChange}
                    onBlur={(e: any) => {
                      if (!e.target.value) {
                        setFocused("");
                      }
                    }}
                    onFocus={() => setFocused("from_time")}
                    className="CHS-input"
                  >
                    {fromTimeOptions.map((time) => (
                      <Option key={time} value={time}>
                        {time}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className={"floating-label-input focused"}
                  label="End Time"
                  name="end_time"
                  rules={[
                    {
                      required: true,
                      message:
                        "End time will be auto-filled. Please select a start time",
                    },
                  ]}
                >
                  <Select
                    onBlur={(e: any) => {
                      if (!e.target.value) {
                        setFocused("");
                      }
                    }}
                    onFocus={() => setFocused("end_time")}
                    value={endTime}
                    disabled // Disable as it's auto-filled
                  >
                    <Option value={endTime}>{endTime}</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  className={`floating-label-input ${
                    isValueFilled("interview_mode") ||
                    focused === "interview_mode"
                      ? "focused "
                      : ""
                  }`}
                  label="Select Interview Mode"
                  name="interview_mode"
                  rules={[
                    {
                      required: true,
                      message: "Please select an interview mode",
                    },
                  ]}
                >
                  <Select
                    onBlur={(e: any) => {
                      if (!e.target.value) {
                        setFocused("");
                      }
                    }}
                    onFocus={() => setFocused("interview_mode")}
                    defaultValue="Select Mode"
                    className="form-input"
                    onChange={handleModeChange}
                  >
                    {interviewmode.map((time) => (
                      <Option key={time.value} value={time.value}>
                        {time.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {isOffLine && (
                <>
                  <Col span={24}>
                    <Form.Item
                      className={`floating-label-input ${
                        isValueFilled("offline_address") ||
                        focused === "offline_address"
                          ? "focused "
                          : ""
                      }`}
                      label="Enter Offline Address"
                      name="offline_address"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the offline address",
                        },
                      ]}
                    >
                      <Input
                        name="address"
                        onBlur={(e: any) => {
                          if (!e.target.value) {
                            setFocused("");
                          }
                        }}
                        onFocus={() => setFocused("offline_address")}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}

              {isOnline && (
                <>
                  <Col span={24}>
                    <Form.Item
                      className="c-mb-0"
                      label="Choose"
                      name="meeting_mode"
                      rules={[
                        {
                          required: true,
                          message: "Please choose an interview mode",
                        },
                      ]}
                    >
                      <Radio.Group className="radio-group c-mt-0">
                        {meeting_mode.map((mode) => (
                          <BaseRadio key={mode.value} value={mode.value}>
                            {mode.label}
                          </BaseRadio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </>
              )}

              <Col span={24}>
                <Form.Item
                  className={`floating-label-input ${
                    isValueFilled("interviewer_email") ||
                    focused === "interviewer_email"
                      ? "focused "
                      : ""
                  }`}
                  label="Interviewer Email ID"
                  name="interviewer_email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the interviewer email ID",
                    },
                  ]}
                >
                  <Input
                    name="interviewer_email"
                    onBlur={(e: any) => {
                      if (!e.target.value) {
                        setFocused("");
                      }
                    }}
                    onFocus={() => setFocused("interviewer_email")}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  className={`floating-label-input ${
                    isValueFilled("interviewer_name") ||
                    focused === "interviewer_name"
                      ? "focused "
                      : ""
                  }`}
                  label="Interviewer Name"
                  name="interviewer_name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the interviewer name",
                    },
                  ]}
                >
                  <Input
                    name="interviewer_name"
                    onBlur={(e: any) => {
                      if (!e.target.value) {
                        setFocused("");
                      }
                    }}
                    onFocus={() => setFocused("interviewer_name")}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Flex gap={8} justify="flex-end">
                    <BaseButton
                      type="primary"
                      htmlType="submit"
                      loading={loader}
                    >
                      Submit
                    </BaseButton>
                  </Flex>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default InterviewSchedule;
