// @ts-nocheck
import { AsyncTable, BaseButton } from "lib/citywide-commonmodules";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deleteSkillQualificationById,
  getSkillQualifications,
} from "services/api-services/ats-settings/api-services";
import { getFormFields } from "services/api-services/commonApi";
import Swal from "sweetalert2";
import { locationId } from "utils/common-function";
import { Errornotify, Successnotify } from "utils/notification";
import useModuleId from "utils/useModuleId";
import AddSkills from "./add-skill-qualification";

const SkillsListing = () => {
  const module_id = useModuleId("admin/ats/dashboard");
  const [defaultCurrent, setDefaultCurrent] = useState(1);
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { companyDetails } = useSelector((state: any) => state.auth);
  const [locationValue, setLocationValue] = useState<string>(
    String(locationId)
  );
  const [columns, setColumns] = useState<any>([]);
  const [skillType, setSkillType] = useState<any>();
  const [tableParams, setTableParams] = useState<any>({});
  const [searchText, setSearchText] = useState("");
  const [gridContent, setGridContent] = useState<any>();
  const [isopenCreateSkillsType, setIsopenCreateSkillsType] =
    useState<boolean>(false);
  const [agencyId, setAgencyId] = useState<number | null>();

  const { language_code } = useSelector(
    (state: any) => state.auth.companyDetails
  );
  const fetchGridData = async () => {
    setLoading(true);

    if (!module_id) return;
    const columnRes: any = await getFormFields(
      module_id,
      "Add",
      language_code || "en"
    ).finally(() => {
      setLoading(false);
    });
    console.log(columnRes, "columnRes");
    if (columnRes?.status === 200 || columnRes?.status === 201) {
      const { column } = columnRes?.data?.data?.grid;
      setGridContent({
        ...columnRes?.data.data,
        globalSearch: {
          title: "Search",
        },
      });

      const updatedColumns = [
        ...column, // Spread the existing columns
      ].filter((columnItem) => columnItem?.group_by === "skills");
      setColumns(updatedColumns);
    }
  };

  useEffect(() => {
    if (module_id) fetchGridData();
  }, [module_id, companyDetails?.id]);

  const fetchSkillQualifications = async () => {
    setLoading(true);
    const queryData = `?column_sort_key=${
      tableParams?.columnKey || null
    }&column_sort_value=${
      tableParams?.order === "descend"
        ? tableParams?.order?.slice(0, 4)?.toUpperCase()
        : tableParams?.order?.slice(0, 3)?.toUpperCase() || null
    }&column_search_key=${
      tableParams?.filters ? Object.keys(tableParams?.filters) : ""
    }&column_search_value=${searchText || null}&page=${
      globalSearch ? 1 : tableParams?.current || 1
    }&pageSize=${
      tableParams?.pageSize ? tableParams?.pageSize : 10
    }&company_id=${companyDetails?.id}&location_id=${
      locationValue || locationId
    }&search=${globalSearch || ""}`;
    let skills: any = await getSkillQualifications(queryData).finally(() => {
      setLoading(false);
    });
    const { data, count } = skills?.data.data;
    setSkillType({
      data:
        Array.isArray(data) &&
        data?.map((item: any) => {
          return {
            ...item,
            action: [
              {
                key: "edit",
              },
              {
                key: "isDelete",
              },
            ],
          };
        }),
      records: count,
    });
  };

  useEffect(() => {
    if (gridContent) {
      fetchSkillQualifications();
    }
  }, [
    gridContent,
    searchText,
    companyDetails,
    locationValue,
    isopenCreateSkillsType,
    tableParams,
    globalSearch,
  ]);

  const onHandleLocation = (evt: any) => {
    if (Array.isArray(evt)) {
      const multi_location = evt?.join(",");
      setLocationValue(multi_location);
    }
  };

  const handleTableChange = (tableProps: any) => {
    const { pagination, filters, sorter, extra, pageSize } = tableProps;
    setDefaultCurrent(0);
    setTableParams({ ...pagination, filters, ...sorter, ...extra, pageSize });
  };
  const handleEvent = (data: any, actionData: any) => {
    if (actionData?.key === "edit") {
      setAgencyId(data?.id);
      setIsopenCreateSkillsType(true);
      // window.location.href = `${CITY_V2}admin/update-department/${data?.id}`;
    }
    if (actionData?.key === "isDelete") {
      handleDeleteSettings(data);
    }
  };
  const handleDeleteSettings = async (deleteSettings?: any) => {
    if (deleteSettings) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will delete skill/qualification type",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        reverseButtons: false,
        customClass: {
          cancelButton: "red-cancel-button",
        },
      });

      if (result.isConfirmed) {
        const deleteRes: any = await deleteSkillQualificationById(
          deleteSettings?.id
        );
        if (deleteRes?.status === 200) {
          Successnotify("Skill/Qualification type deleted successfully");
          fetchSkillQualifications();
        } else {
          Errornotify("Something went wrong!");
        }
      }
    }
  };

  return (
    <div
      className="base-card-body c-pt-1"
      style={{
        paddingTop: 0,
      }}
    >
      {isopenCreateSkillsType ? (
        <AddSkills
          setIsopenCreateSkillsType={setIsopenCreateSkillsType}
          agencyId={agencyId}
          afterUpdate={() => {
            setAgencyId(null);
          }}
        />
      ) : (
        <AsyncTable
          searchText={searchText}
          isFilter={false}
          formButtons={
            <>
              <BaseButton
                // href={`${CITY_V2}admin/add-department`}
                onClick={() => setIsopenCreateSkillsType(true)}
                size="large"
                type="primary"
              >
                Add Skill/Qualification
              </BaseButton>
              {/* );
                })} */}
            </>
          }
          onHandleLocation={onHandleLocation}
          setSearchText={setSearchText}
          columnData={columns}
          tableData={skillType?.data}
          loading={loading}
          totalRecords={skillType?.records}
          rowsPerPage={tableParams?.pageSize ? tableParams?.pageSize : 10}
          handleSelect={handleTableChange}
          handleEvent={handleEvent}
          handleGlobalSearch={(evt) => {
            setDefaultCurrent(1);
            setGlobalSearch(evt?.target.value);
          }}
          globalSearch={{ title: "Search" }}
        />
      )}
    </div>
  );
};

export default SkillsListing;
