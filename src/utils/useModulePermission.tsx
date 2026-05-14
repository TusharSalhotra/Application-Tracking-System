import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMenuArr } from "./common-function";
import { useSelector } from "react-redux";
import { Sub_Menu_Items } from "./types";

const DEFAULT_PERMISSION = {
  id: "ats-dashboard",
  title: "Dashboard",
  path: "admin/ats/dashboard",
  routes: [{ path: "/admin/ats/dashboard" }],
  children: [],
  is_create: true,
  is_read: true,
  is_update: true,
  is_delete: true,
};

export default function useModulePermission(constant_route?: string) {
  const currentUrl = useLocation();
  const [getId, setModuleId] = useState<Sub_Menu_Items | any>(
    DEFAULT_PERMISSION
  );

  const { menuList } = useSelector((state: any) => state?.auth) || {};

  useEffect(() => {
    const menuItem = getMenuArr ? JSON.parse(getMenuArr) : menuList;

    const getUrlData: any = menuItem?.find((item: any) =>
      (constant_route ? constant_route : currentUrl?.pathname).includes(
        item?.path
      )
    );

    let check_inner_routes: any = {};

    menuItem?.forEach((item: any) =>
      item?.routes?.forEach((routes: any) => {
        if (
          currentUrl?.pathname === routes?.path ||
          routes?.path.includes(
            constant_route ? constant_route : currentUrl?.pathname.split("/")[2]
          )
        ) {
          check_inner_routes = item;
        }
      })
    );

    setModuleId(
      getUrlData || (check_inner_routes?.id ? check_inner_routes : DEFAULT_PERMISSION)
    );
  }, [getMenuArr, menuList]);

  return getId;
}
