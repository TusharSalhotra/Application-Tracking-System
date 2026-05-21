import { MenuProps, Tooltip } from "antd";
import React, { MouseEventHandler, useState } from "react";
import {
  FileOutlined,
  DashboardOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MoneyCollectOutlined,
  PaperClipOutlined,
  AreaChartOutlined,
  FilePptOutlined,
  ApartmentOutlined,
  RotateRightOutlined,
  FilePdfOutlined,
  PieChartOutlined,
  AuditOutlined,
  DownloadOutlined,
  RightSquareOutlined,
  RightSquareFilled,
  RightOutlined,
} from "@ant-design/icons";
import moment, { Moment } from "moment";
import "moment-timezone";
import { ICompany_Details, RootState } from "./types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Antically from "../assets/Fonts/Antically-Regular.woff";
import Cedarville from "../assets/Fonts/Cedarville-Cursive.woff";
import Manrope from "../assets/Fonts/Manrope-Regular.woff";
import StyleScript from "../assets/Fonts/StyleScript-Regular.woff";
import { AxiosInstance } from "lib/ui-commonmodules";
import { UPLOAD_PDF } from "services/api-services/constants";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Initialize the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

type MenuItem = Required<MenuProps>["items"][number];

// const get_store_Data = store

export const location_date_format = "MM/DD/YY";

export const getDateTime = (e: any) => {
  var momentObject = moment.utc(e.milliseconds);
  var localTime = momentObject.utcOffset(e.timezoneOffsetHours * 60);
  return localTime.format("DD MMM YYYY hh:mm a");
};

const obj: any = {
  Dashboard: <DashboardOutlined />,
  Agent: <UserOutlined />,
  "Leave Management": <ClockCircleOutlined />,
  Payroll: <MoneyCollectOutlined />,
  "Report-Management": <PaperClipOutlined />,
  Retention: <AreaChartOutlined />,
  Policy: <FilePptOutlined />,
  "Document-Management": <FilePdfOutlined />,
  "Shift-Management": <PieChartOutlined />,
  "Tracking Policy": <AuditOutlined />,
  Leaves: <ClockCircleOutlined />,
  "Work Break": <ApartmentOutlined />,
  Holiday: <RotateRightOutlined />,
  Scheduling: <RotateRightOutlined />,
  Attendance: <PieChartOutlined />,
};

export function MenuArray(value: any) {
  return value?.map((item: any) => {
    if (item?.isSideBar) {
      return {
        screen_id: item.screen_id ?? item.sub_screen_id,
        path: `/${item.path}`,
        title: item?.title,
        children: item?.children ? MenuArray(item?.children ?? "") : null,
        isSidebar: item?.isSideBar,
        key: item.path,
        icon: obj[item?.title],
        label: <span className="menu-text"> {item?.title} </span>,
        className: "menu-items",
        routes: item?.routes,
      };
    } else {
      return {
        path: `/${item.path}`,
      };
    }
  });
}

function flattenMenuItems(menuItems: any) {
  let flattenedArray: any = [];
  menuItems.forEach((item: any) => {
    flattenedArray.push(item);
    if (item.children && Array.isArray(item.children)) {
      flattenedArray = flattenedArray.concat(flattenMenuItems(item.children));
    }
  });
  return flattenedArray;
}
export const getModuleId = (modluleName: any, moduleArray: any) => {
  const getArr = flattenMenuItems(moduleArray);
  return getArr
    .filter((item: any) => item.path)
    .find((item: any) => item.path.includes(modluleName))?.screen_id;
};
export const CommonFunction = (globleCodes: any, type: any, Values: any) => {
  if (globleCodes) {
    return globleCodes[type].find((x: any) => x?.id == Values)?.value;
  }
};

export function serializeDateWithoutUTC(date_: any) {
  if (!date_) return;
  const date = new Date(date_);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
export const locationId = localStorage.getItem("current-branch-id") || 1;

export const moduleId = localStorage.getItem("module-id") || "";

export const loadPdf = async (pdfPath: any) => {
  try {
    const response = await fetch(pdfPath);
    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    console.log("error: ", error);
  }
};

export const downloadUpdatedPdf = (pdfBytes: any, candidateDetail: any) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = candidateDetail?.serial_number
    ? `${candidateDetail?.serial_number}_${candidateDetail?.agent}_.pdf`
    : `${candidateDetail?.agent ?? "Assigned_Certificate"}_.pdf`;
  link.click();
};

export const parseHtmlToStyledText = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = doc.body.childNodes;

  const fragments: {
    text: string;
    bold: boolean;
    italic: boolean;
    fontFamily: string;
  }[] = [];

  elements.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      fragments.push({
        text: node.textContent || "",
        bold: false,
        italic: false,
        fontFamily: "default", // Default font family
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const computedStyle = window.getComputedStyle(el); // Compute styles dynamically
      fragments.push({
        text: el.textContent || "",
        bold: el.tagName === "STRONG" || computedStyle.fontWeight === "bold",
        italic: el.tagName === "EM" || computedStyle.fontStyle === "italic",
        fontFamily: computedStyle.fontFamily || "default",
      });
    }
  });

  return fragments;
};

export const getFontFileName = (fontFamily: string) => {
  if (fontFamily?.includes("Style Script")) {
    return StyleScript;
  } else if (fontFamily?.includes("Antically")) {
    return Antically;
  } else if (fontFamily?.includes("Cedarville")) {
    return Cedarville;
  } else {
    return Manrope;
  }
};

export const get_date_time_zone_based = (
  date: any,
  companyDetails?: ICompany_Details,
  format?: string
) => {
  const get_timeZone = companyDetails?.locations.find(
    (item) => `${item?.id}` === locationId
  );
  if (get_timeZone?.timezone) {
    return moment.tz(date, get_timeZone?.timezone).format(format);
  }
};

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function getCamelCaseString(input: any): string {

  if (input) {
    const str = String(input)
      .replace(/_/g, " ")        
      .toLowerCase()
      .replace(/\s+/g, " ")      
      .trim();                  

    return str
      .split(" ")
      .map(word => word[0]?.toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "";
}
export const get_dayJs_timezone_time = (
  date: any,
  companyDetails?: ICompany_Details,
  format?: string
) => {
  const get_timeZone = companyDetails?.locations?.find(
    (item) => `${item?.id}` === locationId
  );
  if (get_timeZone?.timezone) {
    return dayjs(date).tz(get_timeZone?.timezone).format(format);
  }
};

export function createDateFromTimeString(timeString: string) {
  // Parse the time string using Moment.js
  const time = moment(timeString, "HH:mm:ss");

  // Create a new Date object from the parsed time
  const date = time.toDate();

  return date;
}

export const getMenuArr = localStorage.getItem("menu");

/*********Function for get user role name************/
export const getRoleNameById = (roles: any, id: any) => {
  if (id == "1") {
    return "admin";
  } else {
    const role = roles.find((role: { id: any }) => role?.id == id);
    return role ? role.name : null;
  }
};
export function hasCountryCode(number: any) {
  return number?.startsWith("+1");
}

export const API_URLS: any = {};
export const get_user_data = localStorage?.getItem("userDetails");

function getRandomColor() {
  // Generate a random hex color code
  const letters = "89ABCDEF"; // Higher range for lighter colors
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 8)];
  }
  return color;
}

export function getRandomColorsArray(numColors: number) {
  // Create an array of random colors
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(getRandomColor());
  }
  return colors;
}
export const createDateTime = (shiftDate: string, time: Moment) => {
  return dayjs(`${shiftDate} ${time?.format("HH:mm")}`);
};
export const Random_Colors = [
  "#69cbc7",
  "#EC8AAC",
  "#51b36d",
  "#E89CDC",
  "#FDED9F",
  "#65a98d",
  "#5277a4",
  "#ABAABB",
  "#9DBDD8",
  "#8CC898",
  "#F8C8DC",
  "#955c97",
  "#DCC8AE",
  "#a7ae48",
  "#CF9CFA",
  "#DCB9BF",
  "#FB9EAE",
  "#6ec39a",
  "#BEAADA",
  "#A8B8EA",
  "#8eaa56",
  "#de82a3",
  "#5c8951",
  "#9999BD",
  "#62c963",
  "#697d4a",
  "#ac7ea2",
  "#94ea66",
  "#6dc2cf",
  "#037f26",
  "#6a8cc3",
  "#ed51a4",
  "#29B4AF ",
  "#BF2384 ",
  "#BBAA8E",
  "#5C81B3 ",
  "#007804",
  "#ED9BAD",
  "#E99E9F",
  "#F05DA4 ",
  "#AAB8AD",
  "#ffb691",
  "#85acbd",
  "#BCAD8A",
  "#8da1ff",
  "#EE8CEE",
  "#7e6dfd",
  "#82afaf",
  "#DE8FBF",
  "#CE9DB9",
  "#507ff7",
  "#b8bf78",
  "#69aa7e",
  "#f8e179",
  "#93a1b8",
  "#98799b",
  "#c605f1",
  "#BF9B9B",
  "#889CBB",
  "#ABBE8F",
  "#AB8DBA",
  "#9C988E",
  "#ff9fd6",
  "#f8c3ba",
  "#ff7f7f",
  "#DF888D",
  "#4e4e86",
  "#ffb871",
  "#BBA9FB",
  "#58b898",
  "#9998ED",
  "#BC8FFB",
  "#EB8DBC",
  "#BE9EBD",
  "#BABBFC",
  "#D889EA",
  "#AAC999",
  "#fcabe8",
  "#A89ADA",
  "#7c9595",
  "#47ed97",
  "#ED8DFF",
  "#6a5198",
  "#d8d27f",
  "#8DCD9E",
  "#FEBA99",
  "#D9ABAF",
  "#fcb1d3",
  "#97e4be",
  "#e594e5",
  "#aba1f7",
  "#F9CDA9",
  "#88CEAC",
  "#78a480",
  "#6794f5",
  "#3435D6 ",
  "#AAAAD9",
  "#D99FB9",
  "#976270",
  "#B88BEC",
];
export const Random_User_Colors = [
  "#8eaa56",
  "#de82a3",
  "#5c8951",
  "#9999BD",
  "#62c963",
  "#697d4a",
  "#ac7ea2",
  "#94ea66",
  "#6dc2cf",
  "#037f26",
  "#6a8cc3",
  "#ed51a4",
  "#29B4AF ",
  "#BF2384 ",
  "#BBAA8E",
  "#5C81B3 ",
  "#007804",
  "#ED9BAD",
  "#E99E9F",
  "#F05DA4 ",
  "#AAB8AD",
  "#ffb691",
  "#85acbd",
  "#BCAD8A",
  "#8da1ff",
  "#EE8CEE",
  "#7e6dfd",
  "#82afaf",
  "#DE8FBF",
  "#CE9DB9",
  "#507ff7",
  "#b8bf78",
  "#69aa7e",
  "#f8e179",
  "#93a1b8",
  "#98799b",
  "#c605f1",
  "#BF9B9B",
  "#889CBB",
  "#ABBE8F",
  "#AB8DBA",
  "#9C988E",
  "#ff9fd6",
  "#f8c3ba",
  "#ff7f7f",
  "#DF888D",
  "#4e4e86",
  "#ffb871",
  "#BBA9FB",
  "#58b898",
  "#9998ED",
  "#BC8FFB",
  "#EB8DBC",
  "#BE9EBD",
  "#BABBFC",
  "#D889EA",
  "#AAC999",
  "#fcabe8",
  "#A89ADA",
  "#7c9595",
  "#47ed97",
  "#ED8DFF",
  "#6a5198",
  "#d8d27f",
  "#8DCD9E",
  "#FEBA99",
  "#D9ABAF",
  "#fcb1d3",
  "#97e4be",
  "#e594e5",
  "#aba1f7",
  "#F9CDA9",
  "#88CEAC",
  "#78a480",
  "#6794f5",
  "#3435D6 ",
  "#AAAAD9",
  "#D99FB9",
  "#976270",
  "#B88BEC",
  "#69cbc7",
  "#EC8AAC",
  "#51b36d",
  "#E89CDC",
  "#FDED9F",
  "#65a98d",
  "#5277a4",
  "#ABAABB",
  "#9DBDD8",
  "#8CC898",
  "#F8C8DC",
  "#955c97",
  "#DCC8AE",
  "#a7ae48",
  "#CF9CFA",
  "#DCB9BF",
  "#FB9EAE",
  "#6ec39a",
  "#BEAADA",
  "#A8B8EA",
];

export const Is_Online = localStorage.getItem("online");

export const getToken = localStorage.getItem("token") || "demo-token";
export const statusMap: any = {
  isovertime: "isOvertime=true",
  completed: "isCompleted=true",
  active: "isPresent=true",
  "is-active": "isPresent=false",
  leave: "isLeave=true",
  isDot: "isDot=true",
  onBreak: "onBreak=true"
};
//select option for payment status
export const paymentStatusOptions = [
  { key: "paid", value: "paid", label: "Paid" },
  { key: "unpaid", value: "unpaid", label: "Unpaid" },
];
// Function to concat date from one string and time from another without changing the time
export const combineDateAndTime = (dateString: any, timeString: any) => {
  const datePart = dateString ? dateString?.split("T")[0] : "";
  const timePart = timeString ? timeString?.format("HH:mm:ss[Z]") : "";
  return `${datePart}T${timePart}`;
};

export const time_stamp_format = "YYYY-MM-DDTHH:mm:ss[Z]";

export const Edit_Icon = (handleAction: any, data: any) => {
  return (
    <a
      className="cursor-pointer edit-pdf-icon"
      onClick={(evt) => {
        evt.stopPropagation();
        if (handleAction) {
          handleAction("edit", data);
        }
      }}
    >
      <Tooltip title="Update">
        <div className="actionicons editPencil">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="inherit"
          >
            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
          </svg>
        </div>
      </Tooltip>
    </a>
  );
};

export const Delete_Icon = (handleAction: any, data: any) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        if (handleAction) {
          handleAction("isDelete", data);
        }
      }}
    >
      <Tooltip title="Delete">
        <div className="actionicons deleteIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="#dc4c64"
          >
            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
          </svg>
        </div>
      </Tooltip>
    </div>
  );
};

export const Move_Forward_Icon = (handleAction: any, data: any) => {
  return (
    <div
      onClick={() => {
        if (handleAction) {
          handleAction("isDelete", data);
        }
      }}
    >
      <Tooltip title="Status Change">
        <RightOutlined className="actionicons deleteIcon" />
      </Tooltip>
    </div>
  );
};

export const View_Icon = (handleAction: any, data: any) => {
  return (
    <a
      className="cursor-pointer"
      onClick={() => {
        if (handleAction) {
          handleAction("view", data);
        }
      }}
    >
      <Tooltip title="View">
        <div className="actionicons viewIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            fill="#032d60"
          >
            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
          </svg>
        </div>
      </Tooltip>
    </a>
  );
};

export const PDF_Icon = (
  handleAction: any,
  data: any,
  title = "Pdf Update"
) => {
  return (
    <a
      className="actionicons editPencil"
      onClick={() => {
        if (handleAction) {
          handleAction("pdf", data);
        }
      }}
    >
      <Tooltip title={title}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" />
        </svg>
      </Tooltip>
    </a>
  );
};

export const formatKey = (key: any) => {
  return key
    ?.replace(/_/g, " ") // Replace underscores with spaces
    ?.replace(/\b\w/g, (char: string) => char.toUpperCase()); // Capitalize the first letter of each word
};
export const analyticsFilterOptions = [
  { key: "weekly", value: "Weekly", label: "Weekly" },
  { key: "monthly", value: "Monthly", label: "Monthly" },
  { key: "quarterly", value: "Quarterly", label: "Quarterly" },
  { key: "yearly", value: "Yearly", label: "Yearly" },
];

export const revenueFilterOptions = [
  { key: "currentMonth", value: "currentMonth", label: "Current Month" },
  { key: "lastMonth", value: "lastMonth", label: "Last Month" },
  { key: "last3Months", value: "last3Months", label: "Last 3 Months" },
  { key: "last6Months", value: "last6Months", label: "Last 6 Months" },
];
export async function getCurrentPositionAsync(options: any) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export const getCurrentLocationAndRedirect = async (
  destinationLat: string,
  destinationLon: string,
  userDetails: any,
  setLocationLoader: (data: boolean) => void
) => {
  setLocationLoader(true);
  if (navigator.geolocation) {
    try {
      // Attempt to retrieve current position
      const position: any = await getCurrentPositionAsync({
        timeout: 15000, // Adjusted timeout for Safari
        maximumAge: 0,
        enableHighAccuracy: true,
      }).finally(() => {
        setLocationLoader(false);
      });

      console.info(position);

      const currentLat = position?.coords?.latitude;
      const currentLon = position?.coords?.longitude;

      const url = `/map-directions?origin=${currentLat ?? ""},${
        currentLon ?? ""
      }&destination=${destinationLat ?? ""},${destinationLon ?? ""}`;
      console.info(url);
      // Redirect user
      window.location.href = url;
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationLoader(false);
      // Use fallback location if geolocation fails
      const currentLat = userDetails?.last_location_lat || "0";
      const currentLon = userDetails?.last_location_lon || "0";

      const url = `/map-directions?origin=${currentLat ?? ""},${
        currentLon ?? ""
      }&destination=${destinationLat ?? ""},${destinationLon ?? ""}`;
      window.location.href = url;
    }
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

export const date_format = localStorage.getItem("dateFormat") ?? "MM-DD-YYYY";
interface DownloadIconProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>; // Optional click handler
  title?: string; // Optional tooltip or accessible title
  className?: string; // Optional additional CSS classes
}

export const DownloadIcon: React.FC<DownloadIconProps> = ({
  onClick,
  title = "Download",
  className = "",
}) => {
  return (
    <a
      className={`actionicons editPencil ${className}`}
      onClick={onClick}
      title={title}
      aria-label={title}
      role="button"
    >
      <DownloadOutlined />
    </a>
  );
};

export function getCleanedUrl(url: string) {
  const unwantedPart = "mock-assets/";
  return url.replace(unwantedPart, "");
}

interface TruncateTextProps {
  text: string;
  maxWords: number;
}

export const formatDescription = (text: string) => {
  return text?.replace(/\n/g, "<br />");
};

export const TruncateText: React.FC<TruncateTextProps> = ({
  text,
  maxWords,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const words = text?.split(" ");
  const truncatedText = words.slice(0, maxWords).join(" ") + "...";

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p className={`text ${isExpanded ? "expanded" : ""}`}>
        {isExpanded ? (
          <div dangerouslySetInnerHTML={{ __html: formatDescription(text) }} />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: formatDescription(truncatedText),
            }}
          />
        )}
      </p>
      <a className="primary-text view-more-text" onClick={handleToggle}>
        {isExpanded ? "View Less" : "View More"}
      </a>
    </div>
  );
};


export function textTransformed(text: string) {
  // Replace underscores with spaces
  let newText = text?.replace(/_/g, " ");

  // Capitalize each word
  newText = newText?.replace(/\b\w/g, function (char) {
    return char?.toUpperCase();
  });
  return newText;
}
