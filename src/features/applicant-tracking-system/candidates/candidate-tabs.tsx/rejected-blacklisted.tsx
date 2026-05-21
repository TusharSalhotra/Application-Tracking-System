import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { AsyncTable } from "lib/citywide-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import { handleGlobalSearch, Actions } from "../../common-ats-functions/utils";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import { Move_Forward_Icon, View_Icon } from "utils/common-function";
import StatusSelection from "../common-candidate-functions/status-selection";
const Blacklisted = ({
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
    if (type === Actions.VIEW) {
      window.location.href = `${CITY_V2}admin/ats/candidate-detail/${item?.id}`;
    }
    if (type === Actions.ISDELETE) {
      setIsModalOpen(true);
      setCandidate(item);
      // handleDeleteCandidate(item?.id, fetchCandidateDetail);
    }
  };

  // const handleEvent = (data: any, actionData: any) => {

  const finalColumns = columns?.filter(
    (col: any) => col?.group_by === `${ColumnGroupBy.BLACKLIST}`
  );
  finalColumns?.push({
    title: "Actions",
    key: "action",
    render: (text, item: any) => (
      <div style={{ display: "flex", gap: "8px" }}>
        {View_Icon(handleClick, item)}
        {Move_Forward_Icon(handleClick, item)}
      </div>
    ),
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
          tableData={candidateData.map((candidate: any) => ({
            ...candidate,
            rejection_notes:
              candidate.rejection_notes === null
                ? "N/A"
                : candidate.rejection_notes,
          }))}
          loading={loading}
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

export default Blacklisted;
