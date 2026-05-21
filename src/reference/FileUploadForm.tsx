import React from "react";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BaseButton, BaseButtonsForm } from "lib/citywide-commonmodules";

export function FileUploadForm({
  field,
  onChange,
  onSelectFiles,
}: {
  field: any;
  onChange?: (data: any) => void;
  onSelectFiles?: (data: any) => void;
  open?: boolean;
}) {
  const requiredRule = field?.validations?.find(
    (item: any) => item?.type === "required"
  );

  return (
    <BaseButtonsForm.Item
      label={field?.name}
      name={field?.key}
      rules={[
        {
          required: Boolean(requiredRule),
          message: requiredRule?.message,
        },
      ]}
    >
      <Upload
        beforeUpload={() => false}
        maxCount={field?.is_multiple ? undefined : 1}
        onChange={(info) => {
          onChange?.(info);
          onSelectFiles?.(info);
        }}
      >
        <BaseButton icon={<UploadOutlined />}>
          {field?.placeholder || "Upload"}
        </BaseButton>
      </Upload>
    </BaseButtonsForm.Item>
  );
}
