import { BaseSkeleton } from "lib/ui-commonmodules";
import React from "react";

export default function Loader() {
  return (
    <div className="loaderLayout">
      {/* <BaseSkeleton.Button className="headerSkeleton" active={true} size="large" block /> */}
      <BaseSkeleton.Button
        className="contentSkeleton"
        active={true}
        size="large"
        block
      />
      <BaseSkeleton.Button
        className="footerSkeleton"
        active={true}
        size="large"
        block
      />
    </div>
  );
}
