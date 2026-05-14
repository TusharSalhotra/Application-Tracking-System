// @ts-nocheck
// job-form.tsx
import React, { useEffect, useState } from "react";
import ApplicationForm from "./application-form";
import JobDetails from "./job-details";
import { BaseButton } from "@deepak-pahwa/citywide-commonmodules";
import { getJobPostingDetails } from "services/api-services/ats-apis";
import { useParams } from "react-router-dom";
import Header from "../header/header";
import { Spin, Row, Col, Layout, Typography, Flex } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const JobForm: React.FC = () => {
  const [jopPostingDetails, setJobPostingDetails] = useState<any>([]);
  const [jobDetails, setJobDetails] = useState<any>([]);
  const [viewLoader, setViewLoader] = useState<boolean>(false);
  const [logo, setLogo] = useState<any>();
  const [color, setColor] = useState<any>();

  const { jobId, id } = useParams();
  const convertToSnakeCase = (str) => {
    return str ? str?.trim()?.toLowerCase()?.replace(/\s+/g, "_") : "";
  };

  const fetchJobPostingDetails = async () => {
    setViewLoader(true);
    const queryData = `?uuid=${id}&job_id=${jobId}`;

    try {
      const response = await getJobPostingDetails(queryData).finally(() => {
        setViewLoader(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setJobDetails(response?.data?.data?.result);
        setLogo(response?.data?.data.logo);
        setColor(response?.data?.data.color);
        const updatedQuestions = response?.data?.data?.form?.questions.map(
          (obj) => ({
            ...obj,
            new_key: convertToSnakeCase(obj?.label ?? ""),
            key: `${convertToSnakeCase(obj?.label ?? "")}_${obj?.id}`,
            validations: obj?.required
              ? [{ required: true, message: `${obj?.label} is required` }]
              : [],
          })
        );

        setJobPostingDetails({
          ...response?.data?.data,
          form: {
            ...response?.data?.data?.form,
            questions: updatedQuestions,
          },
        });
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchJobPostingDetails();
  }, [jobId, id]);

  const { form } = jopPostingDetails;

  return (
    <Flex vertical justify="space-between" className="job-form-page">
      <div className="job-form">
        <div className="">
          {viewLoader ? (
            <div className="center-loader-schedule">
              <Spin />
            </div>
          ) : (
            <>
              <JobDetails logo={logo} color={color} jobDetails={jobDetails} />
              <ApplicationForm
                form={form}
                uuid={id}
                jobId={jobId}
                color={color}
                branch={jobDetails[0]?.cl_name}
                jobDetails={jobDetails}
              />
            </>
          )}
        </div>
      </div>

      <Footer className="CHS-public-footer">
        <Text>
          © {new Date().getFullYear()} Dummy ATS Demo. All Rights Reserved.
        </Text>
      </Footer>
    </Flex>
  );
};

export default JobForm;
