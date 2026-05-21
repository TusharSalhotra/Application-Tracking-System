// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./job-card";
import { jobData, Form } from "./utils"; // Import the JSON data
import { useDispatch, useSelector } from "react-redux";
import { ElementStore } from "react-form-builder2";
import {
  DeleteOutlined,
  EditOutlined,
  EditTwoTone,
  FileOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { setEditFormBuilderList } from "redux/auth/slice";
import {
  addSettingsApi,
  deleteFormBuilderForms,
  getFormBuilderApi,
  updateSettingsApi,
} from "services/api-services/ats-apis";
import { locationId } from "utils/common-function";
import {
  BaseButton,
  BaseCard,
  BaseInputBox,
  successNotify,
} from "lib/ui-commonmodules";
import { Errornotify, Successnotify } from "utils/notification";
import { Card, Col, Flex, Row, Spin, Tooltip } from "antd";
import { CITY_V2 } from "services/api-services/constants";
import Swal from "sweetalert2";

type SavedForm = {
  name: string;
  data: any[];
};
const Settings = () => {
  const [color, setColor] = useState("#032d60");
  const { companyDetails, userDetails } = useSelector(
    (state: any) => state.auth
  );
  const [settingsUrl, setSettingsUrl] = useState<any>("");
  const [settingsId, setSettingsId] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  const [settingForm, setSettingForm] = useState<any>([]);
  const [timePeriod, setTimePeriod] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleColorChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setColor(event.target.value);
  };
  const handleCoolingPeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Restrict input to numeric values with a length of 3 or less
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setTimePeriod(value);
    }
  };
  const getReferralUrl = () => {
    return `${CITY_V2}chs-jobs/${settingsUrl ?? ""}`;
  };
  const handleCopyLink = () => {
    const referralUrl = getReferralUrl();
    navigator.clipboard.writeText(referralUrl).then(
      () => {
        Successnotify("Link copied to clipboard!");
      },
      (err) => {}
    );
  };
  const preventInvalidKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent ".", "e", "+", and "-" from being entered
    if ([".", "e", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
  };
  const openSavedForm = (id: number) => {
    window.location.href = `${CITY_V2}admin/ats/update-form/${id}`;
    return;
  };

  const fetchSettings = async () => {
    setLoading(true);
    const queryParam = `/${companyDetails?.id}/${locationId}`;
    try {
      const response = await getFormBuilderApi(queryParam);
      setSettingForm(response.data.data.settingForm ?? []);
      setSettingsUrl(
        response?.data?.data?.link ?? response?.data?.data?.setting.link
      );
      setColor(response?.data?.data?.setting?.color_code || "#ff5a3d");
      setSettingsId(response?.data?.data?.setting?.id || "");
      setSettings(response?.data?.data?.setting || "");
      setTimePeriod(response?.data?.data?.setting?.time_period || "");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const updateSettings = async () => {
    setLoading(true);
    if (settingsId) {
      const payload: any = {
        company_id: companyDetails?.id,
        location_id: Number(locationId),
        created_by: Number(userDetails?.id),
        link: settingsUrl,
        color_code: color,
        posting_form: settings?.posting_form,
        time_period: Number(timePeriod),
      };
      const response: any = await updateSettingsApi(
        Number(settingsId),
        payload
      ).finally(() => {
        setLoading(false);
      });

      if (response?.status === 201 || response?.status === 200) {
        Successnotify("Settings updated successfully");
      } else {
        response?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
    } else {
      const payload: any = {
        company_id: companyDetails?.id,
        location_id: Number(locationId),
        created_by: Number(userDetails?.id),
        link: settingsUrl,
        color_code: color,
        time_period: Number(timePeriod),
      };
      const response: any = await addSettingsApi(payload).finally(() => {
        setLoading(false);
      });

      if (response?.status === 201 || response?.status === 200) {
        if (settingsId) {
          window.location.href = `${CITY_V2}admin/ats/form-builder/${settingsId}`;
        }
      } else {
        response?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
    }
  };
  useEffect(() => {
    fetchSettings();
  }, [companyDetails, locationId]);

  const CreateForm = (settingsId: any) => {
    if (settingsId) {
      window.location.href = `${CITY_V2}admin/ats/form-builder/${settingsId}`;
    } else {
      // Uncomment if impact update is required on create form builder button
      // updateSettings();
    }
  };
  const handleDelete = async (id: any) => {
    // Implement delete logic here
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This action will delete the form.`,
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      reverseButtons: false,
      customClass: {
        cancelButton: "red-cancel-button",
      },
    });

    if (result.isConfirmed) {
      const params = `course/${id}`;
      const res = await deleteFormBuilderForms(id);
      if (res?.status === 200) {
        Successnotify("Form deleted successfully!");
        fetchSettings();
      } else {
        res?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
    }
  };

  return (
    <div className="base-card-body">
      {loading ? (
        <div className="w-full tableLoader">
          <Spin />
        </div>
      ) : (
        <div className="settings-container">
          <h3>Link</h3>
          <div className="link-container">
            <BaseInputBox
              type="text"
              value={getReferralUrl()}
              readOnly
              className="link-input"
            />
            <BaseButton onClick={handleCopyLink}>Copy Link</BaseButton>
          </div>

          <div className="theme-section">
            <h3>Theme</h3>
            <label>Select a color you want for the template:</label>
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="color-picker"
            />
          </div>
          <div className="theme-section">
            <h3>Reapplication period (Months)</h3>
            <BaseInputBox
              type="number"
              value={timePeriod}
              onChange={handleCoolingPeriod}
              onKeyDown={preventInvalidKeys}
              className="cooling-period"
            />
          </div>
          <BaseButton className="c-ml-auto" onClick={updateSettings}>
            Save Settings
          </BaseButton>
          <Card className="created-forms c-mt-4">
            <h2 className="c-mb-2">Job Forms</h2>
            <div className="saved-forms c-mb-5">
              <Flex className="saved-forms-row">
                {settingForm?.map((form) => (
                  <Flex className="saved-forms-item" key={form.id}>
                    <FileTextOutlined className="file-icon" />
                    <Tooltip title={form.name}>
                      <span className="form-name"> {form.name}</span>
                    </Tooltip>
                    <Flex className="form-actions">
                      <EditOutlined onClick={() => openSavedForm(form.id)} />
                      <DeleteOutlined
                        className="c-cursor-pointer"
                        onClick={() => handleDelete(form.id)}
                      />
                    </Flex>
                  </Flex>
                ))}
                <Flex
                  className={`saved-forms-item add-new c-cursor-pointer ${
                    loading ? "c-cursor-blocked" : ""
                  }`}
                  onClick={() => CreateForm(settingsId)}
                >
                  <PlusOutlined />
                  Add new
                </Flex>
              </Flex>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;
