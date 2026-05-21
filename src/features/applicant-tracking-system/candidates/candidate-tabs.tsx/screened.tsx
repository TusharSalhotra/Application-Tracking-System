import React, { useEffect, useState } from "react";
import {
  AsyncTable,
  BaseButtonsForm,
} from "lib/ui-commonmodules";
import { Card, Flex, Tooltip } from "antd";
import { CITY_V2 } from "services/api-services/constants";
import { handleDeleteCandidate, submitInterviewDetails } from "./utils";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import { useSelector } from "react-redux";
import { handleGlobalSearch, Actions } from "../../common-ats-functions/utils";
import BaseDrawer from "components/Drower";
import InterviewSchedule from "./schedule-interview-page";
import {
  Delete_Icon,
  Move_Forward_Icon,
  View_Icon,
} from "utils/common-function";
import { useParams } from "react-router-dom";
import StatusSelection from "../common-candidate-functions/status-selection";

const Screened = ({
  columns,
  candidateData,
  loading,
  globalSearch,
  tableParams,
  paginationCount,
  setGlobalSearch,
  handleTableChange,
  setDefaultCurrent,
  fetchCandidateDetail,
}: {
  columns: any;
  candidateData: any;
  loading: any;
  globalSearch: any;
  tableParams: any;
  paginationCount: any;
  setGlobalSearch: any;
  handleTableChange: any;
  setDefaultCurrent: any;
  fetchCandidateDetail: any;
}) => {
  const [searchText, setSearchText] = useState("");
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const [openFilter, setIsOpenFilter] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [open, setOpen] = useState(false); // Set open to true to keep the DatePicker open
  const { companyDetails } = useSelector((state: any) => state.auth);
  const [isOffLine, setIsOffLine] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const { id } = useParams();
  const [candidateDetail, SetCandidateDetail] = useState<any>({});
  const [candidate, setCandidate] = useState<any>(); // Initialize loading as true
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (type: string, item?: any) => {
    if (type === Actions.VIEW) {
      window.location.href = `${CITY_V2}admin/ats/candidate-detail/${item?.id}`;
    }
    if (type === Actions.CALENDAR) {
      setOpen(true);
      SetCandidateDetail(item);
    }
    if (type === Actions.ISDELETE) {
      setIsModalOpen(true);
      setCandidate(item);
    }
  };

  const finalColumns = columns?.filter(
    (col) => col?.group_by === `${ColumnGroupBy.SCREENED}`
  );
  finalColumns?.push({
    title: "Actions",
    key: "action",
    render: (value: any, item: any) => (
      <div style={{ display: "flex", gap: "10px" }}>
        <Flex gap={8}>
          {View_Icon(handleClick, item)}
          <Tooltip title="Schedule Interview">
            <div
              className="table-actions"
              onClick={() => handleClick(Actions.CALENDAR, item)}
            >
              <svg
                width="14"
                height="18"
                viewBox="0 0 12 10"
                fill="inherit"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.49369 0.0361392C7.35225 0.0870574 7.2787 0.154948 7.21647 0.293559C7.16838 0.398224 7.16272 0.497231 7.16272 1.45336C7.16272 2.41232 7.16838 2.5085 7.21647 2.61599C7.2787 2.75177 7.38619 2.8423 7.53329 2.8819C7.60401 2.9017 8.17825 2.91019 9.16267 2.90453C10.8741 2.89604 10.7949 2.90453 10.9448 2.67823C11.0155 2.57356 11.024 2.53396 11.0353 2.25108L11.0438 1.94274L11.5219 2.41798L11.9999 2.89604V1.45336V0.0106802L11.5219 0.488745L11.0438 0.963981L11.0353 0.658472C11.0212 0.304874 10.9731 0.188894 10.7892 0.0757422L10.6846 0.0106802L9.14287 0.00502253C7.89255 -0.000634909 7.58138 0.00502253 7.49369 0.0361392Z"
                  fill="inherit"
                />
                <path
                  d="M2.63392 0.990568C2.09079 1.05563 1.61272 1.45732 1.43168 2.00893C1.38359 2.1532 1.37793 2.33424 1.36945 4.70194L1.36096 7.24219H6.20102H11.0382V5.55906V3.87593H9.27874C7.82474 3.87593 7.48529 3.86744 7.33819 3.8335C6.85164 3.71752 6.45561 3.36958 6.28022 2.89717C6.22365 2.74159 6.21799 2.67087 6.20667 1.84486L6.19536 0.96228L4.5094 0.965109C3.58156 0.967938 2.73575 0.979253 2.63392 0.990568ZM4.68762 2.04005C4.87714 2.12774 5.05819 2.31444 5.14871 2.51246C5.30712 2.85757 5.22226 3.31866 4.94786 3.58739C4.76116 3.77127 4.53486 3.85896 4.2633 3.86179C4.07094 3.86179 4.01154 3.85047 3.8701 3.77975C3.52216 3.61002 3.34394 3.33846 3.32131 2.95657C3.30434 2.64541 3.37789 2.45022 3.5957 2.23241C3.81635 2.01459 3.98608 1.94953 4.30573 1.96084C4.48677 1.96933 4.58012 1.98913 4.68762 2.04005ZM5.04687 4.86884C5.51645 4.96784 5.95774 5.35256 6.11615 5.80799C6.14727 5.89568 6.18121 6.03712 6.1897 6.12199L6.2095 6.2804H4.27178H2.33689L2.35669 6.10219C2.42741 5.5138 2.86588 5.02442 3.45144 4.88298C3.65511 4.83206 4.82623 4.82357 5.04687 4.86884Z"
                  fill="inherit"
                />
                <path
                  d="M0.413287 8.23903C0.384999 8.31258 0.464205 8.63789 0.557555 8.8359C0.73294 9.20364 1.04128 9.46955 1.43165 9.59402L1.63249 9.65625H6.20098H10.7695L10.9675 9.59402C11.3635 9.46955 11.6634 9.2093 11.8444 8.8359C11.9378 8.64072 12.017 8.31541 11.9887 8.23903C11.9745 8.20508 11.6662 8.19942 10.0595 8.19942H8.14436L7.88694 8.45402L7.62669 8.70861H6.20098H4.77528L4.51503 8.45402L4.25761 8.19942H2.34252C0.735769 8.19942 0.427431 8.20508 0.413287 8.23903Z"
                  fill="inherit"
                />
              </svg>
            </div>
          </Tooltip>
          {Move_Forward_Icon(handleClick, item)}
        </Flex>
      </div>
    ),
  });
  useEffect(() => {
    if (open) {
      BaseFormMethod.resetFields(); // Reset form fields when drawer is closed
      setIsOffLine(false); // Reset form fields when drawer is closed
      setIsOnline(false);
    }
  }, [open]);
  return (
    <Card className="employee-card base-card">
      <div className="base-card-body">
        <AsyncTable
          isFilter={false}
          handleFilter={() => setIsOpenFilter(!openFilter)}
          globalSearch={{ title: "Search" }}
          searchText={searchText}
          setSearchText={setSearchText}
          columnData={columns?.length > 0 ? finalColumns : []}
          tableData={candidateData}
          loading={loading} // Pass loading state to AsyncTable
          globalSearchValue={globalSearch}
          totalRecords={paginationCount}
          rowsPerPage={tableParams?.pageSize ? tableParams?.pageSize : 10}
          handleSelect={handleTableChange}
          handleGlobalSearch={(evt: any) =>
            handleGlobalSearch(evt, setDefaultCurrent, setGlobalSearch)
          }
          className="async-table"
        />
      </div>
      <BaseDrawer
        title="SCHEDULE INTERVIEW"
        open={open}
        onClose={() => {
          setOpen(false);
          BaseFormMethod.resetFields(); // Reset form fields when drawer is closed
          setIsOffLine(false); // Reset form fields when drawer is closed
          setIsOnline(false);
        }}
        width={1000}
      >
        <InterviewSchedule
          candidateDetail={candidateDetail}
          companyDetails={companyDetails}
          onFinish={(value: any) =>
            submitInterviewDetails(
              value,
              setLoader,
              candidateDetail,
              companyDetails,
              setOpen,
              fetchCandidateDetail,
              "schedule-interview",
              id,
              BaseFormMethod
            )
          }
          loader={loader}
          formInstance={BaseFormMethod}
          setIsOffLine={setIsOffLine}
          isOffLine={isOffLine}
          setIsOnline={setIsOnline}
          isOnline={isOnline}
        />
      </BaseDrawer>
      <StatusSelection
        globleCodes
        candidate={candidate}
        is_modal={true}
        fetchCandidateDetail={fetchCandidateDetail}
        setCandidate={setCandidate}
        title={"Move Applicant"}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Card>
  );
};

export default Screened;
