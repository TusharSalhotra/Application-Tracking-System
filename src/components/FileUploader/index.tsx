// @ts-nocheck
import { UploadOutlined } from "@ant-design/icons";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { Button, Flex, Upload } from "antd";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DIGITALOCEAN_SPACES_ENDPOINT_ACCESS } from "services/api-services/constants";
import { Edit_Icon, locationId } from "utils/common-function";
import { Errornotify, Successnotify } from "utils/notification";
import { uploadCv } from "services/api-services/ats-apis";
import { BaseButton } from "lib/citywide-commonmodules";

type Props = {
  pdfPath: any;
  accept: string;
  title: string;
  fetchFileUrl: any;
  setLoader: (value: boolean) => void;
  handleClick?: any;
  is_edit?: boolean;
  is_custom_edit?: boolean;
  pdfSize?: number;
  type?: string;
  jobDetails?: any;
};

export default function FileUploader({
  pdfPath,
  accept = ".pdf , .doc",
  title,
  fetchFileUrl,
  setLoader,
  handleClick,
  is_edit = true,
  is_custom_edit = true,
  jobDetails
}: Props) {
  const [pdfLoader, setPdfLoader] = useState(false);
  const [uploadfile, onFileUploadComplete] = useState("");
  const { companyDetails } = useSelector((state: any) => state.auth);

  const uploadRef = useRef<HTMLDivElement | null>(null);

  const beforeUpload = async (file: File) => {
    const isPdf =
      file.type === "application/pdf" || file.type === "application/msword";
    const isSizeValid = file.size <= 50 * 1024 * 1024;

    if (accept.includes(".pdf") && !isPdf) {
      Errornotify("You can only upload PDF");
      return false;
    }
    if (!isPdf && accept.includes(".pdf , .doc") ) {
      Errornotify("You can only upload PDF or DOC files!");
      return false;
    }

    if (!isSizeValid) {
      Errornotify(
        `File size must be less than or equal to 50 MB!`
      );
      return false;
    }

    setPdfLoader(true);
    setLoader(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "certificate");
      formData.append("company_id", companyDetails?.id ?? jobDetails?.[0]?.job_company_id);
      formData.append("location_id", `${jobDetails?.[0]?.job_location_id ?? locationId }`);

      const response = await uploadCv(formData).finally(() => {
        setPdfLoader(false);
        setLoader(false);
      });

      if (response.status === 200) {
        const fileLink = response.data.data[0].file_url;
        onFileUploadComplete(fileLink);
        fetchFileUrl(fileLink);
        Successnotify(`File uploaded successfully`);
        return false;
      } else {
        Errornotify("File upload failed.");
        return false;
      }
    } catch (error) {
      Errornotify("An error occurred during the upload.");
      return false;
    } finally {
      setLoader(false);
      setPdfLoader(false);
    }
  };

  const handleFileClick = () => {
    const fileInput = document.querySelector(".ant-upload input[type='file']");
    if (fileInput) {
      (fileInput as HTMLElement).click();
    }
  };

  return (
    <div>
      <Upload
        ref={uploadRef}
        name="file"
        beforeUpload={beforeUpload}
        maxCount={1}
        accept={accept}
        showUploadList={false}
        disabled={pdfLoader}
      >
        {pdfPath || uploadfile ? (
          <Flex gap={8} className="c-relative">
            <div
              className="certificate-upload"
              // onClick={handleFileClick} ~
              style={{ cursor: "pointer" }}
            >
              {uploadfile && uploadfile.endsWith(".pdf") || pdfPath  ? (
                <Worker workerUrl="/pdf.worker.min.js">
                  <Viewer
                    fileUrl={
                      uploadfile
                        ? `${DIGITALOCEAN_SPACES_ENDPOINT_ACCESS}${uploadfile}`
                        : pdfPath ?? []
                    }
                    defaultScale={0.2}
                    initialPage={0}
                  />
                </Worker>
              ) : uploadfile && uploadfile.endsWith(".doc") ? (
                <embed
                  id="embed-id"
                  type="application/pdf"
                  onClick={() => {
                    alert("inner");
                  }}
                  src={`${encodeURIComponent(
                    DIGITALOCEAN_SPACES_ENDPOINT_ACCESS + uploadfile
                  )}&embedded=true`}
                  original-url={`${encodeURIComponent(
                    DIGITALOCEAN_SPACES_ENDPOINT_ACCESS + uploadfile
                  )}&embedded=true`}
                  background-color="4283586137"
                  style={{ width: "200px", height: "250px" }}
                />
              ) : (
                ""
              )}
              {is_edit && (
                <>
                  {Edit_Icon(
                    is_custom_edit ? handleClick : handleFileClick,
                    ""
                  )}
                </>
              )}
            </div>
          </Flex>
        ) : (
          <BaseButton
            className="secondary"
            loading={pdfLoader}
            icon={<UploadOutlined />}
          >
            {title}
          </BaseButton>
        )}
      </Upload>
    </div>
  );
}
