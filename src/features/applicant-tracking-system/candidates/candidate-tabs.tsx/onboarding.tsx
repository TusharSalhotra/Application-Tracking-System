import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { AsyncTable } from "@deepak-pahwa/citywide-commonmodules";
import { handleGlobalSearch, Actions } from "../../common-ats-functions/utils";
import { CITY_V2 } from "services/api-services/constants";
import { CalendarOutlined } from "@ant-design/icons";
import { deleteJobPost } from "services/api-services/ats-apis";
import Swal from "sweetalert2";
import { Errornotify, Successnotify } from "utils/notification";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import StatusSelection from "../common-candidate-functions/status-selection";
import { Move_Forward_Icon } from "utils/common-function";

const OnBoarding = ({
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
  defaultCurrent,
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
  defaultCurrent: number;
}) => {
  const [searchText, setSearchText] = useState("");
  const [openFilter, setIsOpenFilter] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidate, setCandidate] = useState<any>(); // Initialize loading as true

  const handleClick = (type: string, item: any) => {
    if (type === Actions.ONBOARDING) {
      window.location.href = `${CITY_V2}admin/ats/onboarding-detail/${item?.id}`;
      // handleDeleteJobPost();
    }
    if (type === Actions.ISDELETE) {
      setIsModalOpen(true);
      setCandidate(item);
      // handleDeleteCandidate(item?.id, fetchCandidateDetail);
    }
  };

  const finalColumns = columns?.filter(
    (col: any) => col?.group_by === `${ColumnGroupBy.ONBOARDING}`
  );

  finalColumns?.push({
    title: "Actions",
    key: "action",
    render: (value: any, item: any) => {
      const isPending = item?.intialStatus === "pending";

      return (
        <div style={{ display: "flex", gap: "8px" }}>
          {isPending ? (
            <Tooltip title="Onboarding">
              <div
                className="table-actions"
                onClick={() => handleClick(Actions.ONBOARDING, item)}
              >
                <CalendarOutlined />
              </div>
            </Tooltip>
          ) : (
            ""
          )}
          {isPending ? Move_Forward_Icon(handleClick, item) : "N/A"}
        </div>
      );
    },
  });
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
          defaultCurrent={defaultCurrent}
        />
      </div>
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

export default OnBoarding;
