// @ts-nocheck
import React from "react";
import { Card, Select, Table } from "antd";

const RecruiterEvaluationTable: React.FC = () => {
  const recruiterData = [
    { name: "James Smith", totalHires: 50, successes: 20, rate: "40%" },
    { name: "John Doe", totalHires: 2, successes: 0, rate: "0%" },
    { name: "Nelson Wick", totalHires: 10, successes: 3, rate: "30%" },
    { name: "Charlie", totalHires: 20, successes: 10, rate: "50%" },
  ];

  const columns = [
    { title: "Recruiter Name", dataIndex: "name", key: "name" },
    { title: "Total Hires", dataIndex: "totalHires", key: "totalHires" },
    { title: "Successes", dataIndex: "successes", key: "successes" },
    { title: "Success Rate (%)", dataIndex: "rate", key: "rate" },
  ];

  return (
    <Card
      title={
        <div className="header-container">
          <div>
            <span className="card-title">Recruiter Evaluation Table</span>
          </div>
          <div>
            <Select defaultValue="Patrol Officer" className="retention-select">
              <Option value="Patrol Officer">Patrol Officer</Option>
              <Option value="Manager">Manager</Option>
            </Select>
          </div>
        </div>
      }
      className="custom-evaluation-table-card"
    >
      <Table dataSource={recruiterData} columns={columns} pagination={false} />
    </Card>
  );
};

export default RecruiterEvaluationTable;
