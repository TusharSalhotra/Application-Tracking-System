// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, Flex, Tooltip } from "antd";
import ReactApexChart from "react-apexcharts";
import {
  TimeRange,
  timeRangeOptions,
  TimeRangeSelector,
  Vacantposition,
  AnalyticsType,
  fetchDepartmentAnalytics,
  getDateRangeType,
  getTimeLineType,
} from "./utils";
import { useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import {
  DateRange,
  getCustomDateRange,
  handleRangeChange,
} from "../common-ats-functions/utils";
import { title } from "process";
import { text } from "stream/consumers";
import CommonNoData from "components/NoData";
import { BaseButton } from "lib/ui-commonmodules";
import { locationId } from "utils/common-function";
import { getApplicantAnalyticsData } from "services/api-services/ats-apis";
import { EXPORT_URL } from "services/api-services/constants";
import { Errornotify } from "utils/notification";

const VacantPosition = ({ userRolesList }: { userRolesList: any }) => {
  const [vacantPosition, setVacantPosition] = useState<any>();
  const [loading, setLoading] = useState(false);
  const defaultEndDate = dayjs(); // Current date
  const defaultStartDate = defaultEndDate.subtract(1, TimeRange.Month);
  const [startDate, setStartDate] = useState<string | Dayjs>(defaultStartDate);
  const [endDate, setEndDate] = useState<string | Dayjs>(defaultEndDate);
  const [timeRange, setTimeRange] = useState(TimeRange.Weekly);
  const [selectedRange, setSelectedRange] = useState<Dayjs[] | null>(null);
  const { companyDetails } = useSelector((state: any) => state.auth);
  const [exportLoader, setExportLoader] = useState<boolean>(false);
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
        AnalyticsType.DEPARTMENT
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
        AnalyticsType.DEPARTMENT
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
        AnalyticsType.DEPARTMENT,
        setLoading,
        setVacantPosition
      );
    }
  }, [timeRange, startDate, endDate]);

  const handleTimeRangeChange = (value: string, type: string) => {
    setTimeRange(value);
    setSelectedRange(null);
  };

  const options = {
    chart: {
      type: "bar",
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
        columnWidth: "20%", // Adjust the width as a percentage or set a fixed value
      },
    },
    colors: Vacantposition,
    xaxis: {
      labels: {
        style: {
          cssClass: "tab-incident",
        },
      },
      categories:
        vacantPosition?.data?.map((val: any) => val?.jobs_department) ?? [],
    },
    yaxis: {
      labels: {
        style: {
          cssClass: "tab-incident",
        },
      },
      min: 0,
      max: vacantPosition?.total_count > 10 ? vacantPosition?.total_count : 10,
      title: {
        text: "Total Vacant position",
        style: {
          cssClass: "tab-incident",
        },
      },
    },
  };

  const series = [
    {
      name: "Vacant Positions",
      data: vacantPosition?.data?.map((val: any) => val?.count) ?? [],
    },
  ];

  return (
    <Card
      loading={loading}
      title={
        <>
          <div className="header-container">
            <div>
              <span className="card-title">Vacant Position Per Department</span>
            </div>
          </div>
        </>
      }
    >
      <Flex justify="flex-end" gap={10} className="chart-filters">
        <TimeRangeSelector
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
                  AnalyticsType.DEPARTMENT,
                  setLoading,
                  setVacantPosition,
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
      {vacantPosition?.data?.length ? (
        <>
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
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

export default VacantPosition;
