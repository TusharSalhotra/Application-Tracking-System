// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, Flex, Tooltip } from "antd";
import ReactApexChart from "react-apexcharts";
import { capitalize } from "lodash";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import {
  timeRangeOptions,
  TimeRange,
  BarColors,
  TimeRangeSelector,
  AnalyticsType,
  fetchDepartmentAnalytics,
  getTimeLineType,
  getDateRangeType,
} from "./utils";
import { ApexOptions } from "apexcharts";
import CommonNoData from "components/NoData";
import {
  DateRange,
  getCustomDateRange,
  handleRangeChange,
} from "../common-ats-functions/utils";
import { BaseButton } from "lib/citywide-commonmodules";
import { getApplicantAnalyticsData } from "services/api-services/ats-apis";
import { EXPORT_URL } from "services/api-services/constants";
import { Errornotify } from "utils/notification";
import { locationId } from "utils/common-function";

const ApplicationTrackingSystem = ({
  userRolesList,
}: {
  userRolesList: any;
}) => {
  const [timeRange, setTimeRange] = useState(TimeRange.Weekly);
  const [applicationTracking, setApplicationTracking] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<Dayjs[] | null>(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const { companyDetails } = useSelector((state: any) => state.auth);
  const [exportLoader, setExportLoader] = useState<boolean>(false);
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setSelectedRange(null);
  };

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
        AnalyticsType.APPLICATIONTRACKING
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
        AnalyticsType.APPLICATIONTRACKING
      }&is_excel=${true}`;
    }
    setExportLoader(true);
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
        AnalyticsType.APPLICATIONTRACKING,
        setLoading,
        setApplicationTracking
      );
    }
  }, [timeRange, companyDetails?.id]);

  const mappedData =
    applicationTracking?.analytics?.map((detail: any) => ({
      label: capitalize(detail?.candidate_status),
      count: detail?.count,
    })) ?? [];
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      dropShadow: {
        enabled: true,
      },
      toolbar: {
        offsetX: 20,
        offsetY: -30,
        tools: {
          download: false, // Enable the download option
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: true,
        barHeight: "80%",
        isFunnel: true, // Pyramid shape
      },
    },
    colors: BarColors,
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opt: any) {
        const label = mappedData[opt.dataPointIndex]?.label || "N/A";
        const count = mappedData[opt.dataPointIndex]?.count || 0;
        return `${label}: ${count}`;
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ dataPointIndex, w }) {
        const label = mappedData[dataPointIndex]?.label || "N/A";
        const count = mappedData[dataPointIndex]?.count || 0;
        const barColor = w.config.colors[dataPointIndex] || "#000"; // Get the bar color

        return `<div style="display: flex; align-items: center; gap: 8px; padding: 5px; background: #fff; border: 1px solid #ddd; font-size: 12px;">
            <div style="width: 12px; height: 12px; background: ${barColor}; border-radius: 2px;"></div>
            <strong>${label}</strong>: ${count}
          </div>`;
      },
    },
    xaxis: {
      labels: {
        style: {
          cssClass: "tab-incident",
        },
      },
      categories:
        applicationTracking?.analytics?.map(
          (detail: any) =>
            `${capitalize(detail?.candidate_status)}: ${detail.count}`
        ) ?? [],
    },
    yaxis: {
      labels: {
        style: {
          cssClass: "tab-incident",
        },
      },
      max: applicationTracking?.total ?? 50,
    },
    legend: {
      show: true, // Ensure legend is displayed
      position: "bottom", // Position can be 'top', 'bottom', 'left', 'right'
      horizontalAlign: "center", // Align the legend horizontally
      onItemClick: {
        toggleDataSeries: false, // Allow toggling of data series on legend click
      },
      onItemHover: {
        highlightDataSeries: false, // Highlight data series on legend hover
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: "Count",
      data: [36, 32, 28, 24, 20, 16, 12, 10, 7],
    },
  ];

  const is_data_available = applicationTracking?.analytics?.some(
    (item: any) => item?.count
  );

  return (
    <Card
      className="dashboard-card"
      loading={loading}
      title={
        <div className="header-container">
          <div>
            <span className="card-title">Applicant Tracking</span>
          </div>
        </div>
      }
    >
      <Flex
        justify="flex-end"
        align="center"
        gap={10}
        className="chart-filters"
      >
        <TimeRangeSelector
          width="150"
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
                  AnalyticsType.APPLICATIONTRACKING,
                  setLoading,
                  setApplicationTracking,
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

      {is_data_available || selectedRange?.length ? (
        <div>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={300}
          />
        </div>
      ) : (
        <Flex justify="center" align="center" className="c-h-full">
          <CommonNoData />
        </Flex>
      )}
    </Card>
  );
};

export default ApplicationTrackingSystem;
