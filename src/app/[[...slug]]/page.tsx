"use client";

import dynamic from "next/dynamic";

const AtsApp = dynamic(
  () => import("features/applicant-tracking-system/NextAtsApp"),
  {
    ssr: false,
  }
);

export default function Page() {
  return <AtsApp />;
}
