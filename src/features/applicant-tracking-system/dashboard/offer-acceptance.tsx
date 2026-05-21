// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, Flex, Tooltip } from "antd";
import ReactApexChart from "react-apexcharts";
import {
  TimeRange,
  timeRangeOptions,
  TimeRangeSelector,
  Offeracceptance,
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
import { ApexOptions } from "apexcharts";
import CommonNoData from "components/NoData";
import { BaseButton } from "lib/citywide-commonmodules";
import { locationId } from "utils/common-function";
import { getApplicantAnalyticsData } from "services/api-services/ats-apis";
import { EXPORT_URL } from "services/api-services/constants";
import { Errornotify } from "utils/notification";

const OfferAcceptanceRate = ({ userRolesList }: { userRolesList: any }) => {
  const defaultEndDate = dayjs(); // Current date
  const defaultStartDate = defaultEndDate.subtract(1, TimeRange.Month);
  const [startDate, setStartDate] = useState<string | Dayjs>(defaultStartDate);
  const [endDate, setEndDate] = useState<string | Dayjs>(defaultEndDate);
  const [timeRange, setTimeRange] = useState(TimeRange.Weekly);
  const [selectedRange, setSelectedRange] = useState<Dayjs[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [offerRate, setOfferRate] = useState<any>([]);
  const [exportLoader, setExportLoader] = useState<boolean>(false);

  const handleTimeRangeChange = (value: string, type: any) => {
    setTimeRange(value);
    setSelectedRange(null);
  };
  const { companyDetails } = useSelector((state: any) => state.auth);

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
        AnalyticsType.OFFER
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
        AnalyticsType.OFFER
      }&is_excel=${true}`;
    }

    setExportLoader(true);
    const reqRes = await getApplicantAnalyticsData(queryParam);

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
    setExportLoader(false);
  };

  useEffect(() => {
    if (timeRange != TimeRange.Custom) {
      fetchDepartmentAnalytics(
        timeRange,
        companyDetails?.id,
        AnalyticsType.OFFER,
        setLoading,
        setOfferRate
      );
    }
  }, [timeRange, startDate, endDate]);

  const options: ApexOptions = {
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
              color: "#48C9B0",
            },
            total: {
              show: true,
              color: "#48C9B0",
            },
          },
        },
      },
    },
    colors: Offeracceptance,
    labels: ["Total Offers", "Accepted Offers", "Rejected Offers"],
    legend: {
      show: true,
      position: "bottom", // Position of the legend (can be 'top', 'right', 'left', or 'bottom')
      formatter: function (seriesName: string, opts: any) {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName}: ${value}`; // Display the count next to the legend
      },
      labels: {
        colors: Offeracceptance,
      },
    },
  };

  const series = [
    offerRate?.total_candidates ?? 0,
    offerRate?.accepted_candidates ?? 0,
    offerRate?.rejected_candidates ?? 0,
  ]; // Retention percentage

  const is_data_available =
    offerRate?.total_candidates ||
    offerRate?.offer_accept_rate ||
    offerRate?.offer_reject_rate;
  return (
    <Card
      loading={loading}
      title={
        <div className="header-container">
          <div>
            <span className="card-title">Offer Acceptance Rate</span>
          </div>
        </div>
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
                  AnalyticsType.OFFER,
                  setLoading,
                  setOfferRate,
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
      {offerRate?.total_candidates ||
      offerRate?.offer_accept_rate ||
      offerRate?.offer_reject_rate ? (
        <>
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={300}
          />
        </>
      ) : (
        <Flex justify="center" align="center">
          <CommonNoData />
        </Flex>
      )}
    </Card>
  );
};

export default OfferAcceptanceRate;
