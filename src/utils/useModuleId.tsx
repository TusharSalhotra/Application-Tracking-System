import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMenuArr } from "./common-function";
import { useSelector } from "react-redux";

const DEFAULT_MODULE_ID = "ats-dashboard";

export default function useModuleId(constant_route?: string) {
  const currentUrl = useLocation();
  const [getId, setModuleId] = useState(DEFAULT_MODULE_ID);

  const { menuList } = useSelector((state: any) => state?.auth) || {};

  useEffect(() => {
    const menuItem = getMenuArr ? JSON.parse(getMenuArr) : menuList;

    const getUrlData: any = menuItem?.find((item: any) =>
      (constant_route ? constant_route : currentUrl?.pathname).includes(
        item?.path
      )
    );

    let check_inner_routes = "";

    menuItem?.forEach((item: any) =>
      item?.routes?.forEach((routes: any) => {
        if (
          currentUrl?.pathname === routes?.path ||
          routes?.path.includes(
            constant_route ? constant_route : currentUrl?.pathname.split("/")[2]
          )
        ) {
          check_inner_routes = item?.id;
        }
      })
    );

    const moduleId = getUrlData?.id || check_inner_routes || DEFAULT_MODULE_ID;
    setModuleId(moduleId);
    localStorage.setItem("module-id", moduleId);
  }, [getMenuArr, menuList]);

  return getId;
}
