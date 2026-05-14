import React from "react";
import { Flex, Space, Select, DatePicker } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;
export const funnelChartData = [
  { stage: "New Candidates", count: 340 },
  { stage: "Screening", count: 340 },
  { stage: "Interviewing", count: 150 },
  { stage: "Offering", count: 45 },
  { stage: "Hires", count: 82 },
];

export const pieChartData = [
  { type: "New Hires", value: 82 },
  { type: "Non Hired", value: 18 },
];

export const retentionRate = { total: 10, retained: 5 };

export const recruiterEvaluationData = [
  { name: "James Smith", totalHires: 50, successes: 20 },
  { name: "John Doe", totalHires: 2, successes: 0 },
  { name: "Nelson Wick", totalHires: 10, successes: 3 },
  { name: "Charlie", totalHires: 20, successes: 10 },
];

export const applicantDashboard = [
  {
    name: "Applicants",
    count: 10,
    icon: "calendar-icon",
    color: "#B4E1C5",
  },
  {
    name: "Job Postings",
    count: 5,
    icon: "handshake-icon",
    color: "#FBD786",
  },
  {
    name: "Settings",
    icon: "courses-icon",
    color: "#A7CAF6",
  },
];
export const timeRangeOptions = [
  { value: "Weekly", key: "weekly" },
  { value: "Monthly", key: "monthly" },
  { value: "Custom", key: "custom_date" },
];

export enum TimeRange {
  Weekly = "Weekly",
  Monthly = "Monthly",
  Month = "month",
  Custom = "Custom",
}
export enum AnalyticsType {
  APPLICATIONTRACKING = "application-tracking",
  CONVERSIONRATE = "conversion-rate",
  RETENTION = "retention",
  OFFER = "offer",
  DEPARTMENT = "department",
}
export const BarColors = [
  "#6274E7",
  "#48C9B0",
  "#F39C12",
  "#E74C3C",
  "#8E44AD",
  "#1436A2",
  "#48C9BC",
  "#F39C16",
  "#6274E6",
];

export enum OfferAcceptanceLabels {
  OfferAcceptanceRate = "Offer Acceptance Rate",
  TotalCandidates = "Total Candidate",
}

export const Conversioncolor = ["#F39C12", "#34495E"];

export const RetentionColors = ["#E74C3C", "#F39C12", "#34495E"];

export const Offeracceptance = ["#F39C12", "#48C9B0", "#E74C3C"];

export const Vacantposition = ["#3498DB"];
interface TimeRangeSelectorProps {
  timeRange: string;
  timeRangeOptions: Array<{ key: string; value: string }>;
  userRolesList: Array<{ id: string; title: string }>;
  selectedRange: any;
  handleRangeChange: (value: any) => void;
  handleTimeRangeChange: (value: string) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  timeRangeOptions,
  userRolesList,
  selectedRange,
  handleRangeChange,
  handleTimeRangeChange,
}) => {
  return (
    <Flex gap={4}>
      {timeRange === "Custom" && (
        <Space direction="vertical" size={12}>
          <RangePicker
            picker="month"
            value={selectedRange}
            onChange={handleRangeChange}
            format="MM/YYYY"
            style={{ width: 260 }}
          />
        </Space>
      )}
      <Select
        defaultValue="Weekly"
        value={timeRange}
        onChange={(value: string) => handleTimeRangeChange(value)}
        style={{ width: 150 }}
      >
        {timeRangeOptions.map((option) => (
          <Option key={option.key} value={option.value}>
            {option.value}
          </Option>
        ))}
      </Select>
      {/* <Select defaultValue="All" className="retention-select">
        {userRolesList.map((opt) => (
          <Select.Option key={opt.id} value={opt.id}>
            {opt.title}
          </Select.Option>
        ))}
      </Select> */}
    </Flex>
  );
};

// dashboard common api function
import { getApplicantAnalyticsData } from "services/api-services/ats-apis";
import { getCustomDateRange, DateRange } from "../common-ats-functions/utils";
import { locationId } from "utils/common-function";
import dayjs from "dayjs";

export const fetchDepartmentAnalytics = async (
  timeRange: any,
  companyId: string,
  type: string,
  setLoading: (loading: boolean) => void,
  setAnalyticsData: (data: any) => void,
  startDate?: string,
  endDate?: string
) => {
  setLoading(true);

  let queryParam;
  if (timeRange !== "Custom") {
    const dateObjects: DateRange = getCustomDateRange(timeRange);
    queryParam = `${companyId}/${locationId}?start_date=${dateObjects?.startDate}&end_date=${dateObjects?.endDate}&type=${type}`;
  } else {
    queryParam = `${companyId}/${locationId}?start_date=${startDate}&end_date=${endDate}&type=${type}`;
  }

  try {
    const response = await getApplicantAnalyticsData(queryParam).finally(() =>
      setLoading(false)
    );

    if (response?.status === 201 || response?.status === 200) {
      setAnalyticsData(response?.data?.data);
    }
  } catch (error) {
    console.error("Error fetching department analytics:", error);
  }
};

export function getTimeLineType(startDate: string, endDate: string): string {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const diffInDays = end.diff(start, "day");
  const diffInMonths = end.diff(start, "month");

  const diffInYears = end.diff(start, "year");
  const fractionalYears = end.diff(start, "year", true); // Fractional years

  let timeLineType = "week";

  if (diffInDays <= 7) {
    timeLineType = "week";
  } else if (diffInMonths < 1) {
    timeLineType = "date";
  } else if (diffInMonths >= 1 && diffInYears < 1) {
    timeLineType = "month";
  } else if (diffInYears === 1 && diffInMonths <= 12) {
    timeLineType = "month";
  } else if (fractionalYears > 1) {
    timeLineType = "year";
  }

  return timeLineType;
}

export function getDateRangeType(startDate: string, endDate: string): string {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const diffInDays = end.diff(start, "day");

  const diffInMonths = end.diff(start, "month");

  const diffInYears = end.diff(start, "year");
  const fractionalYears = end.diff(start, "year", true); // Fractional years

  let type = "weekly";

  if (diffInDays <= 7) {
    type = "weekly"; // 1 week or less
  } else if (diffInMonths < 1) {
    type = "weekly"; // Less than 1 month
  } else if (diffInMonths >= 1 && diffInYears < 1) {
    type = "monthly"; // More than 1 month but less than 1 year
  } else if (diffInYears === 1 && diffInMonths <= 12) {
    type = "monthly"; // Exactly 1 year (12 months)
  } else if (fractionalYears > 1) {
    type = "year"; // More than 1 year
  }

  return type;
}
