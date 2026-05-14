import React, { useState } from "react";
import { Row, Col, Typography, Divider, Flex, Tooltip } from "antd";
import { renderJobField } from "./utils";
import Header from "../header/header";
import { ArrowLeftOutlined } from "@ant-design/icons";
const _ = require("lodash");

const JobDetails = ({ jobDetails, color, logo }: any) => {
  const handelBack = () => {
    window.history.back();
  };
  return (
    <>
      {jobDetails?.map((job: any, index: number) => {
        const skills = job?.job_required_skill?.join(", ");
        const jobFields = [
          // { label: "Employment Type", value: job?.job_title },
          { label: "Location", value: job?.cl_name },
          { label: "Department", value: job?.job_department },
          { label: "Required Experience", value: job?.job_experience },
          { label: "Job Type", value: job?.job_job_mode },
          { label: "Required Skills", value: skills },
          { label: "Salary Range", value: job?.job_salary_range },
        ];
        return (
          <div
            key={index}
            className="job-details"
          >
            {/* <Header logo={logo} applied={true} handelBack={handelBack} /> */}
            {/* base-card job-details */}
            <div className="">
              {job?.job_description && (
                <Flex
                  justify="space-between"
                  className="c-w-full job-form-head"
                >
                  <div className="job-description-title-wrap">
                    <h3 className="job-description-title">
                      <Tooltip title="Back">
                        <div className="go-back" onClick={handelBack}>
                          <ArrowLeftOutlined />
                        </div>
                      </Tooltip>
                      {job?.job_title}
                    </h3>
                    <pre
                      className="job-description"
                      dangerouslySetInnerHTML={{
                        __html: job?.job_description,
                      }}
                    />
                  </div>
                  <img
                    src={logo}
                    className="header-logo"
                    style={{ height: "60px" }}
                    alt="Dummy project logo"
                  />
                </Flex>
              )}
              <Row gutter={[10, 10]}>
                {jobFields.map((field, idx) => (
                  <Col
                    span={12}
                    xxl={6}
                    xl={8}
                    lg={8}
                    md={12}
                    xs={24}
                    key={idx}
                  >
                    {renderJobField(field.label, field.value)}
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default JobDetails;
