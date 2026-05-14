// @ts-nocheck
import { BaseButton } from "@deepak-pahwa/citywide-commonmodules";
import { Flex, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { getAllCandidates } from "services/api-services/ats-apis";
import useModuleId from "utils/useModuleId";
import { Grid_Column } from "utils/types";
import { CITY_V2 } from "services/api-services/constants";
import { getTabItems, status_colors } from "./utils";
import { getFormFields } from "services/api-services/commonApi";
import { useSelector, useDispatch } from "react-redux";
import { formatKey, locationId } from "utils/common-function";
import { setActiveTab } from "redux/auth/slice";
import moment from "moment";
import { ColumnGroupBy } from "../../common-ats-functions/utils";

export default function Candidates() {
  const dispatch = useDispatch();
  const module_id = useModuleId("admin/ats/dashboard");
  const [columns, setColumns] = useState<Grid_Column[]>([]);
  const [loading, setLoading] = useState(false);
  const { companyDetails, activeTab } = useSelector((state: any) => state.auth);
  const [globalSearch, setGlobalSearch] = useState<any>("");
  const [tableParams, setTableParams] = useState<any>({});
  const [defaultCurrent, setDefaultCurrent] = useState(1);
  const [candidateData, setCandidateData] = useState<any>([]);
  const [paginationCount, setPaginationCount] = useState<any>([]);

  const onCandidateStatusTab = (key) => {
    dispatch(setActiveTab(key)); // Update Redux state
    setGlobalSearch("");
    setTableParams({ ...tableParams, current: 1, pageSize: 10 });
    setDefaultCurrent(1);
  };

  const handleTableChange = (tableProps: any) => {
    const { pagination, filters, sorter, extra, pageSize } = tableProps;
    setDefaultCurrent(pagination?.current);
    setTableParams({ ...pagination, filters, ...sorter, ...extra, pageSize });
  };
  const fetchGridData = async () => {
    const params = module_id || ""; // id of the form to be fetched
    if (!module_id) return;
    setLoading(true);
    const type = "Add ";
    if (params) {
      const columnRes: any = await getFormFields(
        params,
        type,
        companyDetails?.language_code || "en"
      ).finally(() => setLoading(false));
      if (columnRes?.status === 200 || columnRes?.status === 201) {
        const { column } = columnRes?.data?.data?.grid;
        const updateGridCol: Grid_Column[] =
          column &&
          column?.filter((columnItem: Grid_Column) => columnItem.default);
        setColumns(
          updateGridCol
            ?.map((item) => {
              return {
                ...item,
                dataindex: item?.key,
              };
            })
            .filter((value) => value?.key != "action")
        );
      }
    }
  };
  const formatDate = (dateString: string) => {
    return moment.utc(dateString).format("MM/DD/YYYY");
  };

  const fetchCandidateDetail = async () => {
    setLoading(true);
    const queryData = `?company_id=${companyDetails?.id || null}&location_id=${
      locationId || null
    }&pageNo=${
      defaultCurrent ? defaultCurrent : tableParams?.current || 1
    }&pageSize=${
      tableParams?.pageSize ? tableParams?.pageSize : 10
    }&column_sort_key=${tableParams?.columnKey || null}&column_sort_value=${
      tableParams?.order === "descend"
        ? tableParams?.order?.slice(0, 4)?.toUpperCase()
        : tableParams?.order?.slice(0, 3)?.toUpperCase() || null
    }&source_type=${activeTab === "archived" ? "" : activeTab}&search=${
      globalSearch || ""
    }`;

    try {
      const response = await getAllCandidates(queryData).finally(() => {
        setLoading(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setCandidateData(
          response?.data?.data?.data.map((candidate: any) => {
            return {
              ...candidate,
              intialStatus: candidate.status,
              status: (
                <div
                  className={`status-badge ${status_colors[candidate?.status]}`}
                >
                  {formatKey(
                    candidate.offer_status == "rejected" &&
                      activeTab === ColumnGroupBy.OFFERED
                      ? "Not Accepted"
                      : candidate?.status
                  )}
                </div>
              ),
              interviewer_name: candidate?.interviewer_name
                ? formatKey(candidate?.interviewer_name)
                : "",
              initial_status: candidate?.status,
              application_end_date: formatDate(candidate?.application_end_date),
              offer_role: candidate?.position ?? "",
              recruiter: candidate?.interviewer_name ?? "",
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
    fetchCandidateDetail();
  }, [
    companyDetails,
    locationId,
    module_id,
    tableParams,
    globalSearch,
    activeTab,
  ]);

  const createProps = (
    columns: any,
    candidateData: any,
    loading: any,
    globalSearch: any,
    tableParams: any,
    paginationCount: any,
    setGlobalSearch: any,
    handleTableChange: any,
    setDefaultCurrent: any,
    fetchCandidateDetail?: any,
    defaultCurrent?: number
  ) => ({
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
  });

  const sourcedProps = createProps(
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
    defaultCurrent
  );
  const screenedProps = createProps(
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
    defaultCurrent
  );
  const interviewsProps = createProps(
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
    defaultCurrent
  );
  const job_offersProps = createProps(
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
    defaultCurrent
  );
  const onboardingProps = createProps(
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
    defaultCurrent
  );
  const rejected_blacklistedProps = createProps(
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
    defaultCurrent
  );
  const archived = createProps(
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
    defaultCurrent
  );

  const items = getTabItems(
    sourcedProps,
    screenedProps,
    interviewsProps,
    job_offersProps,
    onboardingProps,
    rejected_blacklistedProps,
    archived
  );

  return (
    <div>
      <div className="base-card">
        <Flex justify="space-between" className="page-heading">
          <h1 className="heading-text">
            <a className="backIcon" href={`${CITY_V2}admin/ats/dashboard`}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            Applicants
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
              type="default"
              className="primary"
              href={`${CITY_V2}admin/ats/add-candidate`}
            >
              Add New Applicant
            </BaseButton>
          </Flex>
        </Flex>
        <div className="base-card-body">
          <Tabs
            items={items}
            activeKey={activeTab}
            defaultActiveKey="1"
            className="CHS-ant-tabs"
            onChange={onCandidateStatusTab}
          />
        </div>
      </div>
    </div>
  );
}
