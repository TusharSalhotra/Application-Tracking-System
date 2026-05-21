// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Card, Flex } from "antd";
import { AsyncTable, BaseButton } from "lib/ui-commonmodules";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CITY_V2 } from "services/api-services/constants";
import { DownloadOutlined } from "@ant-design/icons";
import { locationId } from "utils/common-function";
import { deleteJobPost, getJobPostings } from "services/api-services/ats-apis";
import { useSelector } from "react-redux";
import { getFormFields } from "services/api-services/commonApi";
import { Grid_Column } from "utils/types";
import useModuleId from "utils/useModuleId";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Errornotify, Successnotify } from "utils/notification";
import { ActionType, formatDate, Keys, StatusColors } from "./utils";
import { handleGlobalSearch, Actions } from "../common-ats-functions/utils";
import { ColumnGroupBy } from "../common-ats-functions/utils";

const JobPosting = () => {
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<any>({});
  const [globalSearch, setGlobalSearch] = useState<any>("");
  const [defaultCurrent, setDefaultCurrent] = useState(1);
  const [openFilter, setIsOpenFilter] = useState<boolean>(true);
  const [columnTypeData, setColumnTypeData] = useState<any>([]);
  const [jopPosting, setJobPosting] = useState<any>([]);
  const [paginationCount, setPaginationCount] = useState<any>([]);
  const [columns, setColumns] = useState<Grid_Column[]>([]);
  const module_id = useModuleId("admin/ats/dashboard");

  const handleTableChange = (tableProps: any) => {
    const { pagination, filters, sorter, extra, pageSize } = tableProps;
    setDefaultCurrent(pagination?.current);
    setTableParams({ ...pagination, filters, ...sorter, ...extra, pageSize });
  };

  const handleChangeColumnType = async (
    evt: CheckboxChangeEvent,
    data: any
  ) => {
    if (evt?.target?.checked) {
      const update_col = [...columns];
      update_col.splice(columns?.length - 2, 0, {
        ...data,
        viewable: true,
      });
      setColumns([...update_col]);
    } else {
      setColumns(columns?.filter((col) => col?.key !== data?.key));
    }
  };
  const { companyDetails } = useSelector((state: any) => state.auth);

  const fetchGridData = async () => {
    const params = module_id || "";
    const type = id ? ActionType.UPDATE : ActionType.ADD;
    setLoading(true);
    if (params) {
      const columnRes: any = await getFormFields(
        params,
        type,
        companyDetails?.language_code || "en"
      ).finally(() => setLoading(false));
      if (columnRes?.status === 200 || columnRes?.status === 201) {
        const { column } = columnRes?.data?.data?.grid;

        const keysToAlwaysInclude = [
          Keys.BADGE_NUMBER,
          Keys.FIRST_NAME,
          Keys.LAST_NAME,
        ];
        const alwaysIncludeColumns = column?.filter((item: any) =>
          keysToAlwaysInclude.includes(item.key)
        );
        const otherColumns = column?.filter(
          (item: any) => !keysToAlwaysInclude.includes(item.key)
        );

        const reorderedColumns = alwaysIncludeColumns.concat(otherColumns);
        const updateGridCol: Grid_Column[] =
          reorderedColumns &&
          reorderedColumns?.filter(
            (columnItem: Grid_Column) => columnItem.default
          );
        setColumns(updateGridCol);

        setColumnTypeData(
          reorderedColumns &&
            reorderedColumns
              ?.map((item: Grid_Column) => {
                return {
                  ...item,
                  viewable: item?.default ? true : false,
                };
              })
              .filter(
                (columnItem: any) =>
                  columnItem?.key !== "first_name" &&
                  columnItem?.key !== "last_name"
              )
        );
      }
    }
  };

  const fetchJobPosting = async () => {
    setLoading(true);
    const column_key = tableParams?.filters
      ? Object.keys(tableParams?.filters)
      : null;
    const queryData = `?company_id=${companyDetails?.id || null}&location_id=${
      locationId || null
    }&pageNo=${globalSearch ? 1 : tableParams?.current || 1}&pageSize=${
      tableParams?.pageSize ? tableParams?.pageSize : 10
    }&${companyDetails?.id}&column_sort_key=${
      tableParams?.columnKey || null
    }&column_sort_value=${
      tableParams?.order === "descend"
        ? tableParams?.order?.slice(0, 4)?.toUpperCase()
        : tableParams?.order?.slice(0, 3)?.toUpperCase() || null
    }&search=${globalSearch || ""}`;

    try {
      const response = await getJobPostings(queryData).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setJobPosting(
          response?.data?.data?.data.map((jobpost: any) => {
            return {
              ...jobpost,
              status: (
                <div
                  className={`status-badge ${StatusColors[jobpost?.status]}`}
                >
                  {jobpost?.status}
                </div>
              ),
              description: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobpost?.description ?? "",
                  }}
                ></div>
              ),
              application_end_date: formatDate(jobpost?.application_end_date),
              action: [{ key: Actions.EDIT }, { key: Actions.ISDELETE }],
            };
          })
        );
        setPaginationCount(response?.data?.data?.count);
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    fetchGridData();
  }, [companyDetails, locationId, module_id]);
  useEffect(() => {
    fetchJobPosting();
  }, [companyDetails, locationId, module_id, tableParams, globalSearch]);
  const handleDownload = async () => {};

  const handleDeleteJobPost = async (jobPostId?: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete this job post.",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      reverseButtons: false,
      customClass: {
        cancelButton: "red-cancel-button",
      },
    });

    if (result.isConfirmed) {
      const res: any = await deleteJobPost(jobPostId);
      if (res?.status === 201 || res?.status === 200) {
        fetchJobPosting();
        Successnotify("Job post deleted successfully");
      } else {
        res?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
    }
  };

  const handleEvent = (data: any, actionData: any) => {
    if (actionData.key === Actions.ISDELETE) {
      handleDeleteJobPost(data.id);
    } else if (actionData?.key === Actions.EDIT) {
      window.location.href = `${CITY_V2}admin/ats/edit-job-post/${data?.id}`;
    } else if (actionData?.key === Actions.VIEW) {
      window.location.href = `${CITY_V2}job-detail-page/${data?.id}`;
    }
  };

  return (
    <Card className="employee-card base-card">
      <Flex justify="space-between" className="page-heading">
        <h1 className="heading-text">
          <a className="backIcon" href={`${CITY_V2}admin/ats/dashboard`}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </a>
          Job Posting
        </h1>
        <Flex gap={8}>
          <BaseButton
            type="default"
            className="secondary"
            href={`${CITY_V2}admin/ats/dashboard`}
          >
            Back
          </BaseButton>
          <BaseButton
            onClick={() => {
              const anchor = document.createElement("a");
              anchor.href = `add-job-post`;
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
            }}
            type="primary"
            className="fs-normal"
          >
            Add New Job
          </BaseButton>
        </Flex>
      </Flex>
      <div className="base-card-body">
        <AsyncTable
          isFilter={false}
          handleFilter={() => setIsOpenFilter(!openFilter)}
          globalSearch={{ title: "Search" }}
          searchText={searchText}
          setSearchText={setSearchText}
          columnData={columns.filter(
            (column) => column?.group_by === ColumnGroupBy.Job
          )}
          tableData={jopPosting}
          loading={loading}
          handleChangeColumnType={handleChangeColumnType}
          columnType={columnTypeData.filter(
            (column) => column?.group_by === ColumnGroupBy.Job
          )}
          handleEvent={handleEvent}
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
    </Card>
  );
};

export default JobPosting;
