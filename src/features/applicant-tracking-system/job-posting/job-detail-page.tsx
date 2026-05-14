import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "services/api-services/ats-apis";

const JobDetails = () => {
  const [loading, setLoading] = useState(false);
  const [jobDetail, setJobDetails] = useState<any>({});
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      fetchDataById()
    }
  }, [id])

  const fetchDataById = async () => {
    setLoading(true)
    const data: any = await getJobById(id).finally(() => {
      setLoading(false)  });
    if (data?.status === 200 || data?.status === 201) {
      setJobDetails(data?.data?.data)
    }
  }
  return (
    <>
      {loading ? (
        <div className="center-loader">
          <Spin />
        </div>
      ) : (
        <div className="info">
          <h3 className="text-lg font-semibold">{jobDetail?.title}</h3>
          <div className="topic">
            <span>Location : </span>
            <strong>{jobDetail?.location_name}</strong>
          </div>
          <div className="time">
            <span>Department : </span>
            <strong>{jobDetail?.department}</strong>
          </div>
          <div className="meeting-mode">
            <span>Employment Type : </span>
            <strong>{jobDetail?.employment_type}</strong>
          </div>
          <div className="host">
            <span>Required experience : </span>
            <strong>{jobDetail?.experience}</strong>
          </div>
          <div className="participant">
            <span>Job type : </span>
            <strong>{jobDetail?.job_mode}</strong>
          </div>
          <div className="participant">
            <span>Required skills : </span>
            <strong>{jobDetail?.required_skill?.map((value: any, index: any) => `${value} ${index != jobDetail?.required_skill?.length - 1 ? "," : ""}`)}</strong>
          </div>
        </div>
      )}
    </>)
};

export default JobDetails;
