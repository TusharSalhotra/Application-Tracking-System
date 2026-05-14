// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  ReactFormBuilder,
  ToolbarItem,
  ElementStore,
} from "react-form-builder2";
import { useSelector } from "react-redux";
import { customToolbarItems, intial_Form } from "./utils";
import { locationId } from "utils/common-function";
import {
  addNewForm,
  getFormById,
  updateSettingsApi,
} from "services/api-services/ats-apis";
import { Layout, Card, Input, Form, Flex, Checkbox } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  BaseButton,
  BaseButtonsForm,
  BaseCol,
  BaseInputBox,
  BaseRow,
} from "@deepak-pahwa/citywide-commonmodules";
import { CITY_V2 } from "services/api-services/constants";
import { Errornotify, Successnotify } from "utils/notification";
import CommonLoader from "components/spinner";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

export const FormBuilder = () => {
  const { id, formId } = useParams();
  const [formData, setFormData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [data, setData] = useState<any>(intial_Form);
  const [focused, setFocused] = useState("");
  const [formName, setFormName] = useState<any>();
  const [isEmployeeFields, setIsEmployeeFields] = useState<boolean>(false);
  const [BaseFormMethod] = BaseButtonsForm.useForm();
  const { companyDetails } = useSelector((state: any) => state.auth);

  const handleSaveOrUpdate = async () => {
    const formQuestions = { questions: data };
    if (formId) {
      const payload = {
        posting_form: formQuestions,
        company_id: companyDetails.id,
        location_id: Number(locationId),
        name: formName,
        isEmployeeFields: isEmployeeFields,
      };
      const response = await updateSettingsApi(Number(formId), payload);
      if (response.status === 200 || response.status === 201) {
        Successnotify("Form updated successfully");
        navigate("/admin/ats/settings");
      } else {
        throw new Error("Failed to update form");
      }
    } else {
      const payload = {
        setting_id: id,
        company_id: companyDetails?.id,
        location_id: Number(locationId),
        name: formName,
        posting_form: formQuestions,
        isEmployeeFields: isEmployeeFields,
      };
      const response = await addNewForm(payload);
      if (response.status === 200 || response.status === 201) {
        Successnotify("Form saved successfully");
        navigate("/admin/ats/settings");
      } else {
        response?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
    }
  };

  const getFormDataById = async () => {
    setLoading(true);
    const response = await getFormById(formId).finally(() => {
      setLoading(false);
    });
    if (response.status === 200 || response.status === 201) {
      setFormData(response.data.data.posting_form.questions || intial_Form);
      BaseFormMethod.setFieldValue("formName", response?.data?.data?.name);
      BaseFormMethod.setFieldValue(
        "isEmployeeFields",
        response?.data?.data?.is_employee_fields
      );
      setFormName(response?.data?.data?.name);
      setIsEmployeeFields(response?.data?.data?.is_employee_fields);
    } else {
      response?.data?.err?.errorMessage?.forEach((msg: any) => {
        Errornotify(msg?.message || "Something went wrong!");
      });
    }
  };
  useEffect(() => {
    if (formId) {
      getFormDataById();
    }
  }, [formId]);

  useEffect(() => {
    const subscription = ElementStore.subscribe((state: any) => {
      setData(state.data); // Update the form data when ElementStore changes
    });
    // Cleanup on component unmount
    return () => {
      if (typeof subscription === "function") {
        subscription(); // Unsubscribe if the return value is a function
      } else {
        console.warn("Subscription did not return an unsubscribe function.");
      }
    };
  }, [companyDetails, locationId]);

  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName); // Replace 'fieldName' with your field name
    return !!value; // Returns true if value is filled, false otherwise
  };

  useEffect(() => {
    const items = document.getElementsByClassName("SortableItem rfb-item");

    // Loop through the HTMLCollection using a traditional for loop
    for (let i = 0; i < items?.length; i++) {
      const item = items[i];
      // You can now manipulate the item as needed
      const label = item.querySelector(".form-label span");
      if (
        (label && label?.textContent?.trim() === "First name") ||
        label?.textContent?.trim() === "Last name" ||
        label?.textContent?.trim() === "Email"
      ) {
        const toolbarButtons = item.querySelector(".toolbar-header-buttons");
        if (toolbarButtons) {
          toolbarButtons.remove();
        }
      }
    }
  }, [loading]);
  const builder_data = formData;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Card className="employee-card base-card">
        <div className="page-heading">
          <h1 className="heading-text">
            <a className="backIcon" href={`${CITY_V2}admin/ats/settings`}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            {formId ? "Update Job form" : "Create Job Form"}
          </h1>
          <BaseButton
            type="default"
            className="secondary"
            href={`${CITY_V2}admin/ats/settings`}
          >
            Back
          </BaseButton>
        </div>

        <div className="base-card-body">
          <div className="form-builder-custom">
            {!loading ? (
              <>
                <Form
                  layout="vertical"
                  form={BaseFormMethod}
                  onFinish={handleSaveOrUpdate}
                >
                  <BaseRow gutter={16}>
                    <BaseCol span={8}>
                      <BaseButtonsForm.Item
                        label="Form Name"
                        name="formName"
                        key="formName"
                        className={`floating-label-input ${
                          isValueFilled("formName") || focused === "formName"
                            ? "focused "
                            : ""
                        }`}
                        rules={[
                          {
                            required: true,
                            message: "Form name field is required",
                          },
                        ]}
                      >
                        <BaseInputBox
                          onBlur={(e: any) => {
                            if (!e.target.value) {
                              setFocused("");
                            }
                          }}
                          onFocus={() => setFocused("formName")}
                          onChange={(e) => setFormName(e.target.value)}
                        />
                      </BaseButtonsForm.Item>
                    </BaseCol>
                    <BaseCol span={12}>
                      <BaseButtonsForm.Item
                        layout="horizontal"
                        label="Add current employee form"
                        name="isEmployeeFields"
                        key="isEmployeeFields"
                        valuePropName="checked"
                      >
                        <Checkbox
                          className="c-m-0 p-0"
                          onChange={(e: CheckboxChangeEvent) =>
                            setIsEmployeeFields(e.target.checked)
                          }
                          checked={isEmployeeFields}
                        />
                      </BaseButtonsForm.Item>
                    </BaseCol>
                  </BaseRow>
                  <div className={isEmployeeFields ? "disabled-builder" : ""}>
                    <ReactFormBuilder
                      data={formId ? builder_data : intial_Form || []}
                      toolbarItems={customToolbarItems}
                      disabled={isEmployeeFields} // This disables the form builder when true
                    />
                  </div>

                  <Flex gap={8} justify="flex-end" className="c-mt-2">
                    <BaseButton type="primary" htmlType="submit">
                      {formId ? "Update Form" : "Save Form"}
                    </BaseButton>
                  </Flex>
                </Form>
              </>
            ) : (
              <CommonLoader />
            )}
          </div>
        </div>
      </Card>
    </Layout>
  );
};
