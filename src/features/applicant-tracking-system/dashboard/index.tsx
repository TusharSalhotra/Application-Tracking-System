// @ts-nocheck
import React, { useEffect, useState, Suspense } from "react";
import { Row, Col } from "antd";
import { applicantDashboard } from "./utils";
import { locationId } from "utils/common-function";
import { useDispatch, useSelector } from "react-redux";
import { getRolesData } from "services/api-services/commonApi";
import { getDashboardData } from "services/api-services/ats-apis";
import { setActiveTab } from "redux/auth/slice";
import Tiles from "./tiles";
import Loader from "components/loader";
import { ColumnGroupBy } from "../common-ats-functions/utils";

// Lazy load components
const ApplicationTrackingSystem = React.lazy(
  () => import("./application-record")
);
const ApplicationConversionRate = React.lazy(
  () => import("./application-conversion")
);
const RetentionRate = React.lazy(() => import("./retention-rate"));
const RecruiterEvaluationTable = React.lazy(
  () => import("./recruiter-evaluation-listing")
);
const VacantPosition = React.lazy(() => import("./vacant-position"));
const OfferAcceptanceRate = React.lazy(() => import("./offer-acceptance"));
const LoadingFallback = () => <Loader />;
const Dashboard: React.FC = () => {
  const dashboardTiles = applicantDashboard;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const { companyDetails } = useSelector((state: any) => state.auth);

  const [userRolesList, setUserRolesList] = useState<any[]>([]);

  const getatsDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getDashboardData(
        companyDetails?.id,
        locationId
      ).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        const { total_candidate, total_jobs } = response.data.data;
        dashboardTiles.forEach((item) => {
          if (item.name === "Applicants") {
            item.count = total_candidate; // New count value
          } else if (item.name === "Job Postings") {
            item.count = total_jobs; // New count value
          }
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchRolesList = async () => {
    await getRolesData(locationId)?.then((result: any) => {
      if (result && result?.status === 200) {
        const rolesList = result?.data?.data || {};
        setUserRolesList((prev) => [...rolesList]);
      }
    });
  };

  useEffect(() => {
    getatsDashboardData();
    fetchRolesList();
    dispatch(setActiveTab(ColumnGroupBy.SOURCED)); // Update Redux state
  }, []);

  return (
    <div className="dashboard">
      <Tiles
        className="c-mb-2"
        dashboardTiles={dashboardTiles}
        loading={loading}
        loader={loader}
      />
      <Suspense fallback={<LoadingFallback />}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={14} lg={14} xl={12} xxl={12}>
            <ApplicationTrackingSystem userRolesList={userRolesList} />
          </Col>
          <Col xs={24} md={10} lg={10} xl={12} xxl={12}>
            <ApplicationConversionRate userRolesList={userRolesList} />
          </Col>

          <Col xs={24} md={12} lg={12}>
            <RetentionRate userRolesList={userRolesList} />
          </Col>
          <Col xs={24} md={12} lg={12}>
            <OfferAcceptanceRate userRolesList={userRolesList} />
          </Col>

          <Col xs={24} md={14} lg={14}>
            <VacantPosition userRolesList={userRolesList} />
          </Col>
          {/* <Col xs={24} md={10} lg={10}>
            <RecruiterEvaluationTable />
          </Col> */}
        </Row>
      </Suspense>
    </div>
  );
};

export default Dashboard;
