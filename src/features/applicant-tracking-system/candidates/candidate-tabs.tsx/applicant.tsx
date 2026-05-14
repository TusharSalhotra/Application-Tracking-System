import React, { useState } from "react";
import { Card, Flex, Modal, RadioChangeEvent } from "antd";
import { AsyncTable } from "@deepak-pahwa/citywide-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import { handleGlobalSearch, Actions } from "../../common-ats-functions/utils";
import StatusSelection from "../common-candidate-functions/status-selection";
import { Move_Forward_Icon, View_Icon } from "utils/common-function";

const Sourced = ({
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
    }
  };

  const finalColumns = columns?.filter(
    (col: any) => col?.group_by === `${ColumnGroupBy.SOURCED}`
  );
  finalColumns?.push({
    title: "Actions",
    key: "action",
    render: (value: any, item: any) => (
      <Flex gap={8}>
        {View_Icon(handleClick, item)}
        {Move_Forward_Icon(handleClick, item)}
      </Flex>
    ),
  });

  return (
    <>
      <AsyncTable
        isFilter={false}
        handleFilter={() => setIsOpenFilter(!openFilter)}
        globalSearch={{ title: "Search" }}
        searchText={searchText}
        setSearchText={setSearchText}
        columnData={columns?.length > 0 ? finalColumns : []}
        tableData={candidateData}
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
    </>
  );
};

export default Sourced;
