// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Flex, Form, Row, Spin } from "antd";
import {
  BaseButton,
  BaseButtonsForm,
} from "lib/ui-commonmodules";
import { Errornotify, Successnotify } from "utils/notification";
import { useSelector } from "react-redux";
import { renderForm } from "../utils-form";
import { CITY_V2 } from "services/api-services/constants";
import useModuleId from "utils/useModuleId";
import { EditorState } from "draft-js";
import { useWatch } from "antd/es/form/Form";
import { getFormFields } from "services/api-services/commonApi";
import {
  createSkillQualification,
  getSkillQualificationById,
  updateSkillQualification,
} from "services/api-services/ats-settings/api-services";

type Editortype = {
  question: EditorState;
};

const AddSkills = ({
  setIsopenCreateSkillsType,
  agencyId,
  afterUpdate,
}: {
  setIsopenCreateSkillsType: (value: boolean) => void;
  agencyId: any;
  afterUpdate: () => void;
}) => {
  const id = agencyId;
  const module_id = useModuleId("admin/ats/dashboard");
  const [loading, setLoading] = useState(false);
  const { globleCodes } = useSelector((state: any) => state.auth);

  const [focused, setFocused] = useState("");
  const [sourceTypeForm, setSourceTypeForm] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [evaluator, setEvaluator] = useState([]);
  const [certificate, setCertificate] = useState();
  const [courseCategory, setCourseCategory] = useState();
  const [BaseFormMethod] = BaseButtonsForm.useForm();

  const [editorData, setEditorData] = useState<Editortype[]>([
    {
      question: EditorState.createEmpty(),
    },
  ]);

  const onFinish = async (value: any) => {
    setLoading(true);

    const updateobj: any = {
      name: value?.name,
    };

    let response;
    if (id) {
      const queryParams = `${id}`;
      response = await updateSkillQualification(queryParams, updateobj).finally(
        () => setLoading(false)
      );
    } else {
      response = await createSkillQualification(updateobj).finally(() =>
        setLoading(false)
      );
    }

    if (response?.status === 201 || response?.status === 200) {
      if (id) {
        Successnotify("Skill/Qualification updated successfully");
        setLoading(false);
        setIsopenCreateSkillsType(false);
        afterUpdate();
      } else {
        Successnotify("Skill/Qualification added successfully");
        setLoading(false);
        setIsopenCreateSkillsType(false);
      }
    } else {
      if (response?.data?.err) {
        Errornotify(response?.data?.err?.errorMessage[0]?.message);
      } else {
        response?.data?.err?.errorMessage?.forEach((msg: any) => {
          Errornotify(msg?.message || "Something went wrong!");
        });
      }
    }
  };

  // return

  const onChange = (evt: any) => {};

  const handleSearch = (key: string, data: string) => {
    if (key === "instructor_id") {
      // fetchEmployees(data);
    } else if (key === "certificate_id") {
      //fetchCertificate(data);
    } else if (key === "course_evaluator") {
      //fetchEvaluator(data);
    } else if (key === "type") {
      //fetchCategoryList(data);
    }
  };

  const isValueFilled = (fieldName: any) => {
    const value = BaseFormMethod.getFieldValue(fieldName);
    return !!value;
  };

  const handleEditor = (editorState: any, editorIndex: number) => {
    setEditorData(
      editorData?.map((item: Editortype, index: number) => {
        if (index === editorIndex) {
          BaseFormMethod.setFieldsValue({
            [`Questions_${index}`]: editorState.getCurrentContent().hasText()
              ? editorState
              : undefined,
          });
          item = {
            ...item,
            question: editorState,
          };
        }
        return item;
      })
    );
  };

  const fetchSkillQualificationDetails = async () => {
    setLoading(true);
    const queryParam = `${id}`;

    try {
      const response = await getSkillQualificationById(queryParam).finally(
        () => {
          setLoading(false);
        }
      );
      const { data } = response?.data;

      for (const key in data) {
        if (key === "name") {
          BaseFormMethod.setFieldValue(key, data[key]);
        } else if (key === "type" && data[key]) {
          BaseFormMethod.setFieldValue(key, parseInt(data[key]));
        } else {
          BaseFormMethod.setFieldValue(key, data[key]);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSkillQualificationDetails();
    }
  }, [id]);

  const instructor = Form.useWatch("instructor_type", BaseFormMethod);
  const chapter = Form.useWatch("is_chapter", BaseFormMethod);
  const assessment = Form.useWatch("is_assessment", BaseFormMethod);
  const type_ = useWatch("type", BaseFormMethod);

  const handelReset = () => {
    BaseFormMethod.setFieldValue("instructor_id", null);
    BaseFormMethod.setFieldValue("instructor_name", null);
  };

  const getArray = (type: string) => {
    switch (type) {
      case "instructor_id":
        return employee;
      case "certificate_id":
        return certificate;
      case "course_evaluator":
        return evaluator;
      case "type":
        return courseCategory;

      default:
        return [];
    }
  };
  const { language_code } = useSelector(
    (state: any) => state.auth.companyDetails
  );

  const fetchSourceTypeForm = async () => {
    setLoading(true);

    const columnRes: any = await getFormFields(
      module_id,
      "Add",
      language_code || "en"
    ).finally(() => setLoading(false));
    if (columnRes?.status === 200 || columnRes?.status === 201) {
      const { form } = columnRes?.data?.data;
      setSourceTypeForm(form[2]?.fields);
    }
  };
  useEffect(() => {
    if (type_ === "all") {
      const allCategories = getArray("type")?.filter(
        (el: any) => el.id !== "all"
      );
      BaseFormMethod.setFieldValue(
        "type",
        allCategories?.map((el: any) => el.label).join(",")
      );
    }
  }, [type_]);
  useEffect(() => {
    if (module_id) fetchSourceTypeForm();
  }, [module_id]);

  return (
    <div className="base-card">
      <div className="page-heading">
        <h1 className="heading-text">
          <a className="backIcon" href={`${CITY_V2}admin/ats/candidates`}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </a>
          {id ? "Update Skill/Qualification" : "Add Skill/Qualification"}
        </h1>
        <BaseButton
          type="default"
          className="secondary"
          onClick={() => {
            setIsopenCreateSkillsType(false);
            afterUpdate(); // Call afterUpdate when back button is clicked
          }}
        >
          Back
        </BaseButton>
      </div>
      <div className="base-card-body">
        {loading ? (
          <div className="center-loader">
            <Spin />
          </div>
        ) : (
          <BaseButtonsForm
            onFinish={onFinish}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            form={BaseFormMethod}
          >
            <div className="form-container">
              <Row gutter={[8, 8]}>
                {sourceTypeForm?.map((field: any) =>
                  renderForm({
                    field,
                    onChange,
                    handleSearch,
                    focused,
                    setFocused,
                    isValueFilled,
                    instructor,
                    employee,
                    handleEditor,
                    editorData,
                    chapter,
                    assessment,
                    globleCodes,
                    arrayOfData: getArray(field.key),
                    handelReset,
                  })
                )}
              </Row>
            </div>
            <Flex justify="end" gap={8}>
              {id ? (
                ""
              ) : (
                <BaseButton
                  type="primary"
                  htmlType="reset"
                  className="common-btn secondary"
                >
                  Clear
                </BaseButton>
              )}
              <BaseButton type="primary" htmlType="submit">
                {id ? "Update" : "Save"}
              </BaseButton>
            </Flex>
          </BaseButtonsForm>
        )}
      </div>
    </div>
  );
};

export default AddSkills;
