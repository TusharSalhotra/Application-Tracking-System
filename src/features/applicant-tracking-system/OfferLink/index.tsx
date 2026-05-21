// @ts-nocheck
import { BaseButton, BaseCard } from "lib/citywide-commonmodules";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  acceptRejectOfferLink,
  getJobPostingDetails,
  getOfferDetails,
} from "services/api-services/ats-apis";

import { Card, Flex, Layout, Spin, Typography } from "antd";
import moment from "moment";
import Header from "../marketing/header/header";
import OfferModal from "./offerModal";
const { Footer } = Layout;
const { Text } = Typography;

type OfferData = {
  logo: string;
  offered: boolean;
  accepted: boolean;
  rejected: boolean;
  offer_sent_at: string;
  offer_expire_at: string;
};

const OfferLink = () => {
  const [viewLoader, setViewLoader] = useState<boolean>(true);
  const [offerStatusData, setOfferStatus] = useState<OfferData>();
  const [offerLinkExpired, setOfferLinkExpired] = useState<boolean>(false);
  const [selectedLocationId, setSelectedLocationId] = useState<any>();
  const [logo, setLogo] = useState<any>();
  const { offerid, candidateid } = useParams();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [offerLoader, setOfferLoader] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [submitType, setSubmitType] = useState<string>("");
  const location = useLocation(); // Gets the full URL including the query string
  const params = new URLSearchParams(location.search); // Parse query string
  const [jobLogo, setJobLogo] = useState<any>();

  const applied = params.has("applied");
  const handleOffer = async (type: string) => {
    setSubmitType(type);
    setOfferLoader(true);
    const payload: any = {
      offer_id: offerid,
      candidate_id: candidateid,
      status: type,
    };

    if (type === "rejected") {
      payload.reason = rejectReason;
    }

    try {
      const response = await acceptRejectOfferLink(payload).finally(() => {
        setOfferLoader(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        if (type === "accepted") {
          setShowSuccessModal(true);
          setIsAccepted(true);
        }
        if (type === "rejected") {
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    }
  };

  const fetchJobOffer = async () => {
    if (applied) {
      setViewLoader(false); // Stop the loader if candidateid is "applied"
      return; // Exit the function early
    }

    const queryData = `/${offerid}`;

    try {
      const response = await getOfferDetails(queryData).finally(() => {
        setViewLoader(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        const currentTimeInLA = moment().tz(response?.data?.data?.timezone);
        const expiryTimeInLA = moment(offerStatusData?.offer_expire_at).tz(
          response?.data?.data?.timezone
        );

        const isExpired = currentTimeInLA.isAfter(expiryTimeInLA);
        setOfferLinkExpired(isExpired);
        setOfferStatus(response?.data?.data);
        setLogo(response?.data?.data.logo);
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    fetchJobOffer();
  }, [selectedLocationId]);

  const fetchJobPostingDetails = async () => {
    setViewLoader(true);
    const queryData = `?uuid=${candidateid}&job_id=${offerid}`;

    try {
      const response = await getJobPostingDetails(queryData).finally(() => {
        setViewLoader(false);
      });
      if (response?.status === 201 || response?.status === 200) {
        setJobLogo(response?.data?.data.logo);
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    if (applied) {
      fetchJobPostingDetails();
    }
  }, [offerid, candidateid]);

  const handleChangeReason = (event: any) => {
    setRejectReason(event?.target.value ?? "");
  };

  const handleRejectOffer = async () => {
    setShowSuccessModal(false);
    handleOffer("rejected");
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const renderStatus = (label: string) => {
    return (
      <Flex justify="center" align="center">
        <Typography className="message-container-expired ">{label}</Typography>
      </Flex>
    );
  };

  enum StatusName {
    ACCEPTED_MESSAGE = "The offer has been accepted",
    REJECTED_MESSAGE = "Offer has been rejected!",
    EXPIRED_MESSAGE = "Offered link has been expired!",
    CONNECTIVITY_MESSAGE = "No internet connection. Please check your network.",
    ACCEPT_BUTTON_NAME = "Accept Offer",
    REJECT_BUTTON_NAME = "Reject Offer",
  }

  const action_available =
    !viewLoader &&
    !offerLinkExpired &&
    !offerStatusData?.accepted &&
    !offerStatusData?.rejected &&
    isOnline;
  const handelBack = () => {
    window.location.href = `/chs-jobs/${candidateid}`;
  };
  return (
    <>
      <Flex justify="space-between" align="center">
        {/* Logo Section */}
        <Header
          logo={applied ? jobLogo : logo}
          applied={applied}
          handelBack={handelBack}
        />
      </Flex>

      <div className="offer-link-page">
        {viewLoader || offerLoader ? (
          <div className="offer-center-loader">
            <Spin />
          </div>
        ) : offerLinkExpired ? (
          <Flex justify="center" align="center">
            <Typography className="message-container-expired">
              {StatusName?.EXPIRED_MESSAGE}
            </Typography>
          </Flex>
        ) : offerStatusData?.accepted ? (
          <Flex justify="center" align="center">
            <Typography className="message-container-accepted">
              {StatusName.ACCEPTED_MESSAGE}
            </Typography>
          </Flex>
        ) : offerStatusData?.accepted || applied ? (
          <div>
            <h3>Thank you for applying!</h3>
            <p>
              We have received your application and will review it shortly.
              You’ll hear from us soon.
            </p>
          </div>
        ) : offerStatusData?.rejected ? (
          // renderStatus(StatusName.REJECTED_MESSAGE)
          <div>
            <h3>Thank you for your confirmation</h3>
            <p>
              We have successfully recorded your decision to reject the offer.
            </p>
          </div>
        ) : !isOnline ? (
          <div>
            <h3>Thank you for accepting the offer.</h3>
            <p>
              We’re excited to have you on board and look forward to working
              with you.
            </p>
            <p>
              Next steps and additional details will be shared with you shortly.
              If you have any questions, please feel free to reach out to us.
            </p>
          </div>
        ) : (
          <Card className="status-container">
            {action_available ? (
              <Typography
                className="c-mb-4 c-text-center"
                style={{
                  fontSize: "28px",
                }}
              >
                To confirm your decision, please select an option from the
                choices below.
              </Typography>
            ) : (
              ""
            )}
            <Flex justify="center" align="center" gap={10}>
              <BaseButton
                onClick={() => {
                  handleOffer("accepted");
                }}
                disabled={offerLoader}
              >
                {StatusName?.ACCEPT_BUTTON_NAME}
              </BaseButton>
              <BaseButton
                className="danger"
                disabled={offerLoader}
                onClick={() => {
                  setShowSuccessModal(true);
                  setIsAccepted(false);
                }}
              >
                {StatusName?.REJECT_BUTTON_NAME}
              </BaseButton>
            </Flex>
          </Card>
        )}
      </div>

      <OfferModal
        openModal={showSuccessModal}
        success={isAccepted}
        handleReject={handleRejectOffer}
        onChange={handleChangeReason}
        setShowSuccessModal={setShowSuccessModal}
        submitType={submitType}
      />

      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          color: "#000",
          padding: "10px 0",
        }}
      >
        <Text>
          © {new Date().getFullYear()} Dummy ATS Demo. All Rights Reserved.
        </Text>
      </Footer>
    </>
  );
};

export default OfferLink;
