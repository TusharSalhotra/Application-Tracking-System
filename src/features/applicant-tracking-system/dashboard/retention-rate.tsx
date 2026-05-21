// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, Flex, Tooltip } from "antd";
import ReactApexChart from "react-apexcharts";
import {
  TimeRange,
  timeRangeOptions,
  TimeRangeSelector,
  RetentionColors,
  AnalyticsType,
  fetchDepartmentAnalytics,
  getDateRangeType,
  getTimeLineType,
} from "./utils";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import {
  DateRange,
  getCustomDateRange,
  handleRangeChange,
} from "../common-ats-functions/utils";
import CommonNoData from "components/NoData";
import { colors } from "reference/analytics/colors";
import { BaseButton } from "lib/ui-commonmodules";
import { locationId } from "utils/common-function";
import { getApplicantAnalyticsData } from "services/api-services/ats-apis";
import { EXPORT_URL } from "services/api-services/constants";
import { Errornotify } from "utils/notification";

const RetentionRate = ({ userRolesList }: { userRolesList: any }) => {
  const defaultEndDate = dayjs(); // Current date
  const defaultStartDate = defaultEndDate.subtract(1, TimeRange.Month);
  const [startDate, setStartDate] = useState<string | Dayjs>(defaultStartDate);
  const [endDate, setEndDate] = useState<string | Dayjs>(defaultEndDate);
  const [timeRange, setTimeRange] = useState(TimeRange.Weekly);
  const [selectedRange, setSelectedRange] = useState<Dayjs[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [retentionData, setRetentionRate] = useState<any>();
  const { companyDetails } = useSelector((state: any) => state.auth);
  const [exportLoader,setExportLoader]=useState<boolean>(false)
  const handleSaveExcel = async () => {
    let queryParam;
    let filterType;
    const dateObjects: DateRange = getCustomDateRange(timeRange);
    let timeLineType;

    if (!startDate && !endDate) {
      filterType = getDateRangeType(
        dateObjects?.startDate ?? "",
        dateObjects?.endDate ?? ""
      );
      timeLineType = getTimeLineType(
        dateObjects?.startDate ?? "",
        dateObjects?.endDate ?? ""
      );
    } else {
      filterType = getDateRangeType(startDate, endDate);
      timeLineType = getTimeLineType(startDate, endDate);
    }

    if (timeRange === TimeRange.Monthly) {
      filterType = "weekly";
    }

    if (timeRange !== TimeRange.Custom) {
      const dateObjects: DateRange = getCustomDateRange(timeRange);
      queryParam = `${companyDetails?.id ?? ""}/${locationId}?start_date=${
        dateObjects?.startDate
      }&end_date=${dateObjects?.endDate}&type=${
        AnalyticsType.RETENTION
      }&is_excel=${true}`;
    }

    if (timeRange === TimeRange.Custom) {
      let startDate_ = startDate;
      let endDate_ = endDate;
      if (typeof startDate !== "string") {
        startDate_ = startDate?.format("YYYY-MM-DD");
      }
      if (typeof endDate !== "string") {
        endDate_ = endDate?.format("YYYY-MM-DD");
      }

      queryParam = `${
        companyDetails?.id ?? ""
      }/${locationId}?start_date=${startDate_}&end_date=${endDate_}&type=${
        AnalyticsType.RETENTION
      }&is_excel=${true}`;
    }
    setExportLoader(true)
    const reqRes = await getApplicantAnalyticsData(queryParam).finally(() =>
      setExportLoader(false)
    );
    if (reqRes?.status === 200 || reqRes?.status === 201) {
      const a = document.createElement("a");
      a.href = `${EXPORT_URL}${reqRes?.data?.data}`;
      a.download = "comment.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(`${EXPORT_URL}${reqRes?.data?.data}`);
      document.body.removeChild(a);
    } else {
      reqRes?.data?.err?.errorMessage?.forEach((msg: any) => {
        Errornotify(msg?.message || "Something went wrong!");
      });
    }
  };
  useEffect(() => {
    if (timeRange != TimeRange.Custom) {
      fetchDepartmentAnalytics(
        timeRange,
        companyDetails?.id,
        AnalyticsType.RETENTION,
        setLoading,
        setRetentionRate
      );
    }
  }, [timeRange, startDate, endDate]);

  const handleTimeRangeChange = (value: string, type: any) => {
    setTimeRange(value);
    setSelectedRange(null);
  };
  const options = {
    chart: {
      toolbar: {
        offsetX: 20,
        offsetY: -30,
        show: true,
        tools: {
          download: false, // Enable the download option
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
              color: "#E74C3C",
            },
            total: {
              show: true,
              color: "#E74C3C",
            },
          },
        },
      },
      radialBar: {
        hollow: {
          size: "70%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "16px",
          },
          value: {
            fontSize: "16px",
            show: true,
          },
        },
      },
    },
    colors: RetentionColors,
    labels: ["Retained Candidate", "Total Candidate"],
    legend: {
      show: true,
      position: "bottom", // Position of the legend (can be 'top', 'right', 'left', or 'bottom')
      formatter: function (seriesName: string, opts: any) {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName}: ${value}`; // Display the count next to the legend
      },
      labels: {
        colors: RetentionColors,
      },
    },
  };

  const series = [
    retentionData?.retained_candidates ?? 0,
    retentionData?.total_candidates ?? 0,
  ]; // Retention percentage
  return (
    <Card
      loading={loading}
      title={
        <div className="header-container">
          <div>
            <span className="card-title">Retention Rate</span>
          </div>
        </div>
      }
      className="custom-retention-rate-card dashboard-card"
    >
      <Flex justify="flex-end" gap={10} className="chart-filters">
        <TimeRangeSelector
          width="260"
          timeRange={timeRange}
          timeRangeOptions={timeRangeOptions}
          userRolesList={userRolesList}
          selectedRange={selectedRange}
          handleRangeChange={(value) =>
            handleRangeChange(
              value,
              (startDate, endDate) => {
                setStartDate(startDate);
                setEndDate(endDate);
                fetchDepartmentAnalytics(
                  timeRange,
                  companyDetails?.id,
                  AnalyticsType.RETENTION,
                  setLoading,
                  setRetentionRate,
                  startDate,
                  endDate
                );
              },
              setSelectedRange
            )
          }
          handleTimeRangeChange={handleTimeRangeChange}
        />
        <Tooltip title="Export">
          <BaseButton
            loading={exportLoader}
            className="export-icon"
            onClick={() => handleSaveExcel()}
          >
            <i className="fa-solid fa-upload "></i>
          </BaseButton>
        </Tooltip>
      </Flex>
      {retentionData?.retained_candidates || retentionData?.total_candidates ? (
        <>
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={300}
          />
        </>
      ) : (
        <Flex justify="center" align="center" className="c-h-full">
          <CommonNoData />
        </Flex>
      )}
    </Card>
  );
};

export default RetentionRate;
