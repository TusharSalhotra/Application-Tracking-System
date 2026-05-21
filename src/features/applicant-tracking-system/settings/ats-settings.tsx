import React from "react";
import { BaseButton } from "lib/citywide-commonmodules";
import { Card, Flex, TabsProps } from "antd";
import { CITY_V2 } from "services/api-services/constants";

import { Tabs } from "antd/lib";
import Settings from "./index";
import SourceType from "./source-type/source-type-listing";
import SkillsListing from "./skills-qualification/skills-listing";

export default function AtsSettings() {
  const onChange = (key: string) => {};
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Job Post Settings",

      children: <Settings />,
    },
    {
      key: "2",
      label: "Source Type",

      children: <SourceType />,
    },
    {
      key: "3",
      label: "Skill/Qualification",

      children: <SkillsListing />,
    },
  ];
  return (
    <div>
      <div className="base-card">
        <Flex justify="space-between" className="page-heading">
          <h1 className="heading-text">
            <a className="backIcon" href={`${CITY_V2}admin/ats/dashboard`}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            Settings
          </h1>
          <BaseButton
            type="default"
            className="secondary"
            href={`${CITY_V2}admin/ats/dashboard`}
          >
            Back
          </BaseButton>
        </Flex>

        <div className="base-card-body">
          <Tabs
            className="CHS-ant-tabs"
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            destroyInactiveTabPane
          />
        </div>
      </div>
    </div>
  );
}
