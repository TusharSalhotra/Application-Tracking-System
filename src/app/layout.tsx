import type { Metadata } from "next";
import type { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-form-builder2/dist/app.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/Fonts/stylesheet.css";
import "../styles/index.scss";
import "../styles/global.scss";
import "../custom.scss";
import "../components/loader/style.css";
import "../components/Drower/style.scss";
import "../components/FileUploader/style.scss";
import "../features/applicant-tracking-system/dashboard/style.scss";
import "../features/applicant-tracking-system/app-shell.scss";
import "../features/applicant-tracking-system/settings/style.scss";
import "../features/applicant-tracking-system/create-job-form/style.scss";
import "../features/applicant-tracking-system/job-posting/style.scss";
import "../features/applicant-tracking-system/candidates/add-candidate/styles.scss";
import "../features/applicant-tracking-system/candidates/candidate-tabs.tsx/styles.scss";
import "../features/applicant-tracking-system/marketing/style.scss";
import "../features/applicant-tracking-system/marketing/header/style.scss";
import "../features/applicant-tracking-system/marketing/marketing-form/style.scss";
import "../features/applicant-tracking-system/OfferLink/style.scss";

export const metadata: Metadata = {
  title: "Applicant Tracking System",
  description: "Applicant tracking system",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
