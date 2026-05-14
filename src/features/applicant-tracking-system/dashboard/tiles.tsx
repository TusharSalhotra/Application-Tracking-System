import React, { useMemo } from "react";
import { Card, Col, Row, Skeleton } from "antd";
import CreditCard from "../../../assets/Images/jobPosting.svg";
import Cpu from "../../../assets/Images/settings.svg";
import help_center from "../../../assets/Images/help_center.svg";
import Handshake from "../../../assets/Images/Candidates.svg";
import { CITY_V2 } from "services/api-services/constants";

interface TileProps {
  dashboardTiles: any[];
  loading: boolean;
  loader: boolean;
  className?: string;
}

const imageMapping: { [key: string]: string } = {
  Applicants: Handshake,
  "Job Postings": CreditCard,
  Settings: Cpu,
  Default: help_center,
};

const linkMapping: { [key: string]: string } = {
  Applicants: `${CITY_V2}admin/ats/candidates`,
  "Job Postings": `${CITY_V2}admin/ats/job-posting`,
  Settings: `${CITY_V2}admin/ats/settings`,
};

export default function Tiles({
  dashboardTiles,
  loading,
  loader,
  className,
}: TileProps) {
  // Memoize functions to get images and links
  const getImage = useMemo(
    () => (name: string) => imageMapping[name] || imageMapping.Default,
    []
  );

  const getLink = useMemo(() => (name: string) => linkMapping[name] || "#", []);

  // Memoize the cards to avoid re-computation
  const cards = useMemo(
    () =>
      dashboardTiles.map((item: any, index: number) => (
        <Col key={index} xxl={8} xl={12} lg={12} md={24} xs={24}>
          <Card
            bordered={false}
            className="dashboard-widgets dashboard-stats"
            style={{ backgroundColor: item.color }}
          >
            {loading ? (
              <div className="c-flex card-content">
                <div className="card-img">
                  <img src={getImage(item.name)} alt="loading" />
                </div>
                <div className="card-text">
                  <Skeleton
                    className="title-card-1 c-m-0"
                    paragraph={{
                      rows: 1,
                      width: 50,
                      className: "descriptive-skeleton",
                    }}
                    active
                  />
                </div>
              </div>
            ) : (
              <div className="c-flex card-content">
                <div className="card-img">
                  <img src={getImage(item.name)} alt={item.name} />
                </div>
                <a href={getLink(item.name)} className="card-text">
                  <h4>{item?.name}</h4>
                  <span className="count">{item.count}</span>
                </a>
              </div>
            )}
          </Card>
        </Col>
      )),
    [dashboardTiles, loading, loader, getImage, getLink]
  );

  return (
    <Row className={`wadges-row ${className}`} gutter={[16, 16]}>
      {cards}
    </Row>
  );
}
