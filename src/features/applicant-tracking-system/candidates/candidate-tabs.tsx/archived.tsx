import React, { useState } from "react";
import { Card, Flex } from "antd";
import { AsyncTable } from "lib/citywide-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import { deleteJobPost } from "services/api-services/ats-apis";
import { Actions, handleGlobalSearch } from "../../common-ats-functions/utils";
import Swal from "sweetalert2";
import { Errornotify, Successnotify } from "utils/notification";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import StatusSelection from "../common-candidate-functions/status-selection";
import { Move_Forward_Icon } from "utils/common-function";

const Archived = ({
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
  const [candidate, setCandidate] = useState<any>();

  const handleClick = (type: string, item: any) => {
    if (type === Actions.ISDELETE) {
      setIsModalOpen(true);
      setCandidate(item);
      // handleDeleteCandidate(item?.id, fetchCandidateDetail);
    }
  };

  const finalColumns = columns?.filter(
    (col: any) => col?.group_by === `${ColumnGroupBy.Archived}`
  );
  finalColumns?.push({
    title: "Actions",
    key: "action",
    render: (value: any, item: any) => (
      <Flex gap={8}>{Move_Forward_Icon(handleClick, item)}</Flex>
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

export default Archived;
