// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Col, Flex, Modal, Progress, Row, Space } from "antd";
import dayjs from "dayjs";
import { CandidateInfoProps } from "./utils";
import { ColumnGroupBy } from "../../common-ats-functions/utils";
import { formatKey } from "utils/common-function";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { DIGITALOCEAN_SPACES_ENDPOINT_ACCESS } from "services/api-services/constants";
import { BaseCard } from "lib/ui-commonmodules";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import moment from "moment";

const filterKeys = ["type", "password"];

const permitKeys = [
  "driver_license",
  "guard_card",
  "firearms",
  "baton",
  "ecd",
  "oc",
  "other_permit",
  "reference",
  "refrence",
  "residence",
  "mailing",
];

function removeSuffix(str: String, suffix: String) {
  return str?.replace(new RegExp(`_${suffix}$`), "");
}

const CandidateInfo: React.FC<CandidateInfoProps> = ({
  candidate,
  simplifiedData,
  offer,
  showHeading,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permitData, setPermitData] = useState([]);
  const [residencData, setResidencData] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [mailingData, setMailingData] = useState([]);
  const handleOpenModal = (fileUrl: string) => {
    setPdfUrl(fileUrl);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };
  useEffect(() => {
    let permitData: any[] = [];

    Object.values(candidate?.form_data || {}).forEach((item: any) => {
      const uniqKey = item?.content?.toLowerCase() || "";

      if (
        permitKeys?.some((key) =>
          key === "residence" ||
          key === "driver_license" ||
          key === "guard_card" ||
          key === "other_permit"
            ? item?.key?.includes(key)
            : uniqKey.includes(key)
        )
      ) {
        // Find the corresponding permit key
        const permitOriginalKey =
          permitKeys.find((key) =>
            key === "residence" ||
            key === "driver_license" ||
            key === "guard_card" ||
            key === "other_permit"
              ? item?.key.includes(key)
              : uniqKey.includes(key)
          ) || "";

        const keyWithoutSuffix = removeSuffix(item.key, permitOriginalKey);

        // Find existing permit entry or create a new one
        let existingPermit = permitData.find(
          (p) => p.permitKey === permitOriginalKey
        );

        if (!existingPermit) {
          existingPermit = {
            permitKey: permitOriginalKey,
            name:
              permitOriginalKey === "residence"
                ? "Residence"
                : item?.field_name,
          };
          permitData.push(existingPermit);
        }

        // Assign properties dynamically
        existingPermit[keyWithoutSuffix] = item?.value;

        if (!existingPermit.type) {
          existingPermit.type = keyWithoutSuffix;
        }
      }
    });

    const residenceArr: any = [];

    const mailingArr: any = [];

    const referenceData: any = [];

    Object.values(candidate?.form_data || {}).forEach((item: any) => {
      if (item?.key?.includes("residence")) {
        residenceArr.push({
          name: item?.label,
          value: item?.value,
        });
      }
      if (item?.key?.includes("mailing")) {
        mailingArr.push({
          name: item?.label,
          value: item?.value,
        });
      }
      if (item?.key?.includes("reference")) {
        referenceData.push({
          name: item?.label,
          value: item?.value,
        });
      }
    });
    setResidencData(residenceArr ?? []);
    setMailingData(mailingArr ?? []);
    setReferenceData(referenceData ?? []);
    setPermitData(permitData ?? []);
  }, [candidate?.form_data]);

  const filterFields = simplifiedData?.length
    ? simplifiedData
        ?.map((item) => ({
          ...item,
          key:
            item.key === "location_id"
              ? "location"
              : item.key === "beat_id"
              ? "beat"
              : item.key === "client_site"
              ? "Site"
              : item.key,
        }))
        ?.filter(
          (item) =>
            !filterKeys.includes(item?.key?.toLowerCase()) &&
            item.key.toLowerCase() !== "password" &&
            item.key.toLowerCase() !== "confirm_password"
        )
    : [];
  return (
    <>
      {showHeading && <h3 className="sub-heading-text">Interviewee details</h3>}
      <>
        <div className="basic-info">
          <Flex justify="space-between" className="blacklisted-rejected">
            {!showHeading && (
              <h3>
                {formatKey(candidate?.first_name ?? "")}
                &nbsp;
                {formatKey(candidate?.last_name ?? "")}
              </h3>
            )}

            {(candidate?.status === ColumnGroupBy.BLACKLIST ||
              candidate?.status == ColumnGroupBy.REJECTED) && (
              <div className="reason">
                {offer ? (
                  <>
                    {candidate?.status != "rejected" ? (
                      <>
                        Reason for
                        <span className="status">{` ${candidate?.status} `}</span>
                        <strong>{` ${candidate?.reason ?? "N/A"}`}</strong>
                      </>
                    ) : (
                      <>
                        <span className="status">{"Not Accepted"}</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Reason for
                    <span className="status">{` ${candidate?.status}`}</span>
                    <strong>{` ${candidate?.reason ?? "N/A"}`}</strong>
                  </>
                )}
              </div>
            )}
          </Flex>
        </div>
        <Row className="candidate-info-wrapper" gutter={[10, 10]}>
          {filterFields?.map((value: any, index: any) => {
            const hasPermitkeys = permitKeys.some((item) =>
              value?.key.includes(item)
            );
            const formattedValue =
              typeof value?.value === "object" && value?.value?.blocks
                ? value?.value?.blocks
                    .map((block: any) => block?.text)
                    .join(" ")
                : Array.isArray(value?.value)
                ? value?.value.join(", ")
                : value?.value;
            return (!hasPermitkeys &&
              value?.key !== "available_times" &&
              value?.key !== "upload" &&
              value?.key !== "file_upload") ||
              value?.key === "location" ? (
              <Col
                span={24}
                sm={12}
                md={8}
                lg={6}
                className="candidate-information"
                key={value?.key}
              >
                <strong>{formatKey(value?.key ?? "")} </strong>
                {value?.key.includes("email") ? (
                  <a
                    href={`mailto:${formattedValue}`}
                    rel="noopener noreferrer"
                  >
                    {formattedValue}
                  </a>
                ) : value?.key === "location" ? (
                  value?.init_value
                ) : value?.key?.includes("date") ? (
                  moment.utc(value?.value).format("MM/DD/YYYY")
                ) : (
                  formattedValue
                )}
              </Col>
            ) : null;
          })}

          {permitData?.length
            ? permitData?.map((value) =>
                value?.permitKey === "residence" ? (
                  <>
                    <Col
                      span={24}
                      className="candidate-information new-section"
                    >
                      <h3 className="candidate-section">Residence Address</h3>
                      <Row>
                        {residencData.map((item) => {
                          return (
                            <Col
                              span={24}
                              sm={12}
                              md={8}
                              lg={6}
                              key={item?.value}
                              className="candidate-information"
                            >
                              <strong>{item?.name}:</strong> {item?.value}
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>

                    <Col
                      span={24}
                      className="candidate-information new-section"
                    >
                      <h3 className="candidate-section">Mailing Address</h3>
                      <Row>
                        {mailingData.map((item) => {
                          return (
                            <Col
                              span={24}
                              sm={12}
                              md={8}
                              lg={6}
                              key={item?.value}
                              className="candidate-information"
                            >
                              <strong>{item?.name}:</strong> {item?.value}
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </>
                ) : (
                  value?.permitKey !== "reference" &&
                  value?.permitKey !== "refrence" && (
                    <>
                      <Col
                        span={24}
                        className="candidate-information new-section"
                        key={value?.permitKey}
                      >
                        <h3 className="candidate-section">
                          {formatKey(value?.name ?? "")}
                        </h3>
                        <Row>
                          {Object.entries(value).map(([key, val]) => {
                            if (
                              key !== "permitKey" &&
                              key !== "name" &&
                              key !== "type" &&
                              val
                            ) {
                              return (
                                <Col
                                  span={24}
                                  sm={12}
                                  md={8}
                                  lg={6}
                                  key={key}
                                  className="candidate-information"
                                >
                                  <strong>{formatKey(key)}:</strong> {val}
                                </Col>
                              );
                            }
                            return null;
                          })}
                        </Row>
                      </Col>
                    </>
                  )
                )
              )
            : null}

          {referenceData?.length ? (
            <Col span={24} className="candidate-information new-section">
              <h3 className="candidate-section">Reference</h3>
              <Row>
                {referenceData?.map((item: any) => {
                  let formattedValue = item?.value;

                  if (item?.name.toLowerCase().includes("email")) {
                    formattedValue = (
                      <a href={`mailto:${item?.value}`} className="email-link">
                        {item?.value}
                      </a>
                    );
                  }

                  return (
                    <Col
                      span={24}
                      sm={12}
                      md={8}
                      lg={6}
                      key={item?.value}
                      className="candidate-information"
                    >
                      <strong>{item?.name}:</strong> {formattedValue}
                    </Col>
                  );
                })}
              </Row>
            </Col>
          ) : null}

          {filterFields?.map((value: any, index: any) => {
            // Available Times Case
            if (
              value?.key === "available_times" &&
              Array.isArray(value?.value) &&
              value?.value?.length
            ) {
              return (
                <Col
                  span={24}
                  className="candidate-information new-section"
                  style={{ flexDirection: "column" }}
                  key={value?.id}
                >
                  <h3 className="candidate-section">
                    {formatKey(value?.key ?? "")}
                  </h3>
                  <Row>
                    {value?.value.map((shift: any, index: number) => {
                      const shiftDay = shift?.shift_day ?? null; // Null if not available
                      const startTime = shift?.shift_day_start_time
                        ? moment.utc(shift.shift_day_start_time).format("HH:mm")
                        : null;
                      const endTime = shift?.shift_day_end_time
                        ? moment.utc(shift.shift_day_end_time).format("HH:mm")
                        : "N/A";

                      if (!shiftDay) return null;

                      return (
                        <Col
                          xl={6}
                          lg={6}
                          md={8}
                          sm={12}
                          xs={24}
                          key={index}
                          className="candidate-information"
                        >
                          <strong>{shiftDay}: </strong>
                          <Flex gap={10}>
                            {startTime ? (
                              <span>
                                Start time: <strong>{startTime}</strong>
                              </span>
                            ) : (
                              ""
                            )}

                            {endTime ? (
                              <span>
                                End time: <strong>{endTime}</strong>
                              </span>
                            ) : (
                              ""
                            )}
                          </Flex>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              );
            }
          })}
          {(candidate?.status === ColumnGroupBy.BLACKLIST ||
            candidate?.status == ColumnGroupBy.REJECTED) && (
            <Col
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              // className="candidate-information"
              className="candidate-info"
            >
              <span className="candidate-fontstyle">
                <span className="status">
                  {candidate?.status
                    ? candidate.status.charAt(0).toUpperCase() +
                      candidate.status.slice(1)
                    : ""}
                </span>{" "}
                Notes -
              </span>
              <strong className="candidate-boldstyle">
                {candidate?.notes ? ` ${formatKey(candidate.notes)}` : "N/A"}
              </strong>{" "}
            </Col>
          )}
        </Row>
      </>
      {candidate?.file && (
        <div className="candidate-doc">
          <Flex justify="space-between">
            <p className="candidate-name">
              {candidate?.first_name} {candidate?.last_name} Resume
            </p>
            <Flex gap={10} align="center">
              <a
                href={`${DIGITALOCEAN_SPACES_ENDPOINT_ACCESS}${candidate?.file}`}
                download
              >
                <DownloadOutlined className="view-icon" />
              </a>
              <a>
                <EyeOutlined
                  className="view-icon"
                  onClick={() =>
                    handleOpenModal(
                      `${DIGITALOCEAN_SPACES_ENDPOINT_ACCESS}${candidate?.file}`
                    )
                  }
                />
              </a>
            </Flex>
          </Flex>
          <Progress percent={100} showInfo={false} strokeColor="#375EF9" />
        </div>
      )}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
        centered
        className="common-modal modal-with-card "
      >
        <BaseCard title="View Resume">
          {pdfUrl && pdfUrl.endsWith(".pdf") ? (
            <Worker workerUrl="/pdf.worker.min.js">
              <Viewer
                initialPage={1}
                fileUrl={pdfUrl || []}
                defaultScale={1.4}
              />
            </Worker>
          ) : pdfUrl && pdfUrl.endsWith(".doc") ? (
            <embed
              id="embed-id"
              type="application/pdf"
              onClick={() => {
                alert("inner");
              }}
              src={`${encodeURIComponent(
                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS + pdfUrl
              )}&embedded=true`}
              original-url={`${encodeURIComponent(
                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS + pdfUrl
              )}&embedded=true`}
              // background-color="4283586137"
              style={{ width: "950px", height: "1000px" }}
            />
          ) : pdfUrl && pdfUrl.endsWith(".docx") ? (
            <embed
              id="embed-id"
              type="application/pdf"
              onClick={() => {
                alert("inner");
              }}
              src={`${encodeURIComponent(
                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS + pdfUrl
              )}&embedded=true`}
              original-url={`${encodeURIComponent(
                DIGITALOCEAN_SPACES_ENDPOINT_ACCESS + pdfUrl
              )}&embedded=true`}
              // background-color="4283586137"
              style={{ width: "950px", height: "1000px" }}
            />
          ) : (
            ""
          )}
        </BaseCard>
      </Modal>
    </>
  );
};

export default CandidateInfo;
