// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobPosting } from "services/api-services/ats-apis";
import Header from "./header/header";
import {
  BaseButton,
  BaseCol,
  BaseRow,
  SelectBox,
} from "@deepak-pahwa/citywide-commonmodules";

import { Spin, Layout, Typography, Row, Col, Button } from "antd";
const { Footer } = Layout;
const { Text } = Typography;
const Marketing = () => {
  const [viewLoader, setViewLoader] = useState<boolean>(false);
  const [jopPosting, setJobPosting] = useState<any>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<any>();
  const [logo, setLogo] = useState<any>();
  const { id } = useParams();
  const color = jopPosting.color;
  const fetchJobPosting = async () => {
    setViewLoader(true);

    const queryData = `/${id}?location_id=${selectedLocationId ?? ""}`;

    try {
      const response = await getJobPosting(queryData).finally(() => {
        setViewLoader(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setJobPosting(response?.data?.data);
        setLogo(response?.data?.data.logo);
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    }
  };
  const navigate = useNavigate();
  const handleApplyJob = (jobId: string) => {
    navigate(`/apply-job/${jobId}/${id}`);
  };
  const handleLocationChange = (value: any) => {
    setSelectedLocationId(value);
  };
  useEffect(() => {
    // if (selectedLocationId) {
    setViewLoader(true);
    fetchJobPosting();
    // }
  }, [selectedLocationId]);

  return (
    <>
      <div>
        <Header logo={logo} />
      </div>

      <div
        className="marketing"
        style={{ backgroundColor: "white", padding: "16px" }}
      >
        <BaseRow gutter={8} style={{ marginBottom: "16px" }}>
          <BaseCol xs={24} sm={12} md={8} lg={6}>
            <SelectBox
              placeholder="Select Branches"
              className="select-options CHS-select"
              onChange={handleLocationChange}
              value={selectedLocationId}
              allowClear
            >
              {jopPosting?.location_list?.map((location: any) => (
                <SelectBox.Option key={location.id} value={location.id}>
                  {location.name}
                </SelectBox.Option>
              ))}
            </SelectBox>
          </BaseCol>
        </BaseRow>

        <h2>Current Openings</h2>

        {viewLoader ? (
          <div className="center-loader-schedule">
            <Spin />
          </div>
        ) : (
          <div className="cards-container">
            {jopPosting?.result?.length ? (
              jopPosting.result.map((job: any, index: any) => {
                const jobDetails = [
                  { label: "Job", value: job?.job_title || "N/A" },
                  {
                    label: "Emp type",
                    value: job?.job_employment_type || "N/A",
                  },
                  {
                    label: "Required skills",
                    value: job?.job_required_skill?.join(", ") || "N/A",
                  },
                  {
                    label: "No of Openings",
                    value: job?.job_number_opening || "N/A",
                  },
                  { label: "Department", value: job?.job_department || "N/A" },
                  {
                    label: "Salary Range",
                    value: job?.job_salary_range || "N/A",
                  },
                  {
                    label: "Total experience",
                    value: job?.job_experience || "N/A",
                  },
                  { label: "Location", value: job?.cl_name || "N/A" },
                ];

                return (
                  <div className="job-card" key={job.job_id || index}>
                    <div className="card-header">
                      <h3 style={{ color: color }}>
                        {job?.job_title || "Untitled Job"}
                      </h3>
                      <BaseButton
                        style={{
                          backgroundColor: color,
                          borderColor: color,
                          boxShadow: "none",
                        }}
                        onClick={() => handleApplyJob(job.job_id)}
                      >
                        Apply
                      </BaseButton>
                    </div>
                    <div className="card-body">
                      {jobDetails.map((detail, idx) => (
                        <p key={idx}>
                          <strong>{detail.label}:</strong> {detail.value}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="center-loader-schedule">
                <p>No jobs available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          color: "#000",
          padding: "10px 0",
        }}
      >
        <Text>
          © {new Date().getFullYear()} Dummy ATS Demo. All Rights Reserved.
        </Text>
      </Footer>
    </>
  );
};

export default Marketing;
