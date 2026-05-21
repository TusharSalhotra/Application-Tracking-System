// @ts-nocheck
import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { BaseButtonsForm } from "lib/citywide-commonmodules";

type Editortype = {
  description: EditorState;
};
export const TextEditor = ({
  field,
  onChange,
  languageCode,
  isEditAgent,
  focused,
  setFocused,
  isValueFilled,
  editorData,
}: {
  field: any;
  onChange?: (data: any) => void;
  languageCode?: any;
  isEditAgent?: any;
  focused?: any;
  setFocused?: any;
  isValueFilled?: any;
  editorData?: Editortype[];
}) => {
  return editorData?.map((item: Editortype, index: number) => {
    const getErrorMessage = field?.validations?.find(
      (item: any) => item?.type === "required"
    );

    return (
      <BaseButtonsForm.Item
        label={field?.name}
        key={`Questions_${index}`}
        name={`Questions_${index}`}
        rules={[
          {
            required: getErrorMessage ? true : false,
            validator() {
              if (item.description?.getCurrentContent().hasText()) {
                return Promise.resolve();
              } else {
                return Promise.reject(getErrorMessage);
              }
            },
          },
        ]}
        className={`floating-label-input ${"focused"}`}
      >
        <Editor
          stripPastedStyles={true}
          editorState={item?.description}
          onEditorStateChange={(newState: EditorState) =>
            onChange && onChange(newState, index)
          }
          onFocus={() => setFocused(field?.id)}
          onBlur={() => setFocused("")}
          wrapperClassName="wysiwyg-wrapper"
          editorClassName="wysiwyg-editor"
          toolbarClassName="wysiwyg-toolbar"
        />
      </BaseButtonsForm.Item>
    );
  });
};
