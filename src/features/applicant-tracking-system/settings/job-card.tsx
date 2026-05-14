import React from "react";

const JobCard = ({
  title,
  job,
  empType,
  address,
  state,
  city,
  experience,
  color,
}: any) => {
  return (
    <div className="job-card">
      <div className="card-header">
        <h4 style={{ color: color }}>{title}</h4>
        <button className="details-button" style={{ backgroundColor: color }}>
          Details
        </button>
      </div>
      <div className="card-body">
        <p>
          <strong>Job:</strong> {job}
        </p>
        <p>
          <strong>Emp type:</strong> {empType}
        </p>
        <p>
          <strong>Street Address:</strong> {address}
        </p>
        <p>
          <strong>State:</strong> {state}
        </p>
        <p>
          <strong>City:</strong> {city}
        </p>
        <p>
          <strong>Total experience:</strong> {experience}
        </p>
      </div>
    </div>
  );
};

export default JobCard;
