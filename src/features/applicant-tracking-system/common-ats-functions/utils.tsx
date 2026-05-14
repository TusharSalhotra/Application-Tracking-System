import dayjs from "dayjs";
import { Errornotify } from "utils/notification";
import { TimeRange } from "../dashboard/utils";

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

/**
 * Returns a date range based on the specified type.
 * @param {string} type - The type of date range (e.g., "Weekly", "Monthly").
 * @returns {DateRange} - An object containing formatted start and end dates.
 */
export const getCustomDateRange = (type: string): DateRange => {
  const endDate = dayjs(); // Current date
  let startDate;

  switch (type) {
    case "Weekly":
      startDate = endDate.subtract(6, "days");
      break;
    case "Monthly":
      startDate = endDate.subtract(1, "month");
      break;
    default:
      return { startDate: null, endDate: null };
  }

  return {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
  };
};

export const handleRangeChange = (
dates: dayjs.Dayjs[] | null, fetchAnalytics: (startDate: string, endDate: string) => void, setSelectedRange: (dates: dayjs.Dayjs[] | null) => void, setStartDate: unknown, setEndDate: unknown) => {
  if (dates && dates.length === 2) {
    const startYear = dates[0].year();
    const endYear = dates[1].year();
    const startDate = dates[0].startOf(TimeRange.Month).format("YYYY-MM-DD");
    const endDate = dates[1].endOf(TimeRange.Month).format("YYYY-MM-DD");

    if (startYear !== endYear) {
      Errornotify("Please select a range within the same year.");
      return;
    }

    fetchAnalytics(startDate, endDate);
  }
  setSelectedRange(dates);
};
export { TimeRange };

export const handleGlobalSearch = (
  event: React.ChangeEvent<HTMLInputElement>,
  setDefaultCurrent: (page: number) => void,
  setGlobalSearch: (value: string) => void
) => {
  setDefaultCurrent(1);
  const searchValue = event?.target.value;
  const onlySpacesRegex = /^\s*$/;

  if (onlySpacesRegex.test(searchValue)) {
    setGlobalSearch("");
  } else {
    setGlobalSearch(searchValue);
  }
};

//Enums for Action key
export enum Actions {
  VIEW = "view",
  REJECT = "reject",
  SCHEDULE = "schedule",
  OFFER = "offer",
  EDIT = "edit",
  ONBOARDING = "onboarding",
  CALENDAR = "calendar",
  ISDELETE = "isDelete",
}
// grid filter keys
export enum ColumnGroupBy {
  SCREENED = "screened",
  SOURCED = "sourced",
  INTERVIEW = "interview",
  SCHEDULE_INTERVIEW = "schedule-interview",
  ONBOARDING = "on-board",
  PENDING = "pending",
  OFFER = "offer",
  OFFERED = "offered",
  BLACKLIST = "blacklisted",
  REJECTED = "rejected",
  Archived = "archived",
  Job = "job",
  NOT_CLEARED = "not-cleared",
  SCHEDULED = "scheduled",
  CLEARED = "cleared",
}
// utils/formDataUtils.ts
export const simplifyFormData = (formData: any) => {
  return Object.values(formData ?? {})
    .map(({ id, key, label, value, element, ...rest }: any) => ({
      id,
      key,
      label,
      value,
      element,
      ...rest
    }))
    .filter((value: any) => value?.key != "status");
};
