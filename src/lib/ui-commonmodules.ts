/**
 * Local shim replacing "lib/ui-commonmodules".
 * All antd wrappers are aliased directly; AsyncTable and AxiosInstance
 * are re-implemented here so call-sites need no changes.
 */

import React from "react";
import axios from "axios";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Skeleton,
  Table,
} from "antd";

// ── Antd aliases ───────────────────────────────────────────────────────────────
export const BaseButton = Button;
export const BaseButtonsForm = Form;
export const BaseCard = Card;
export const BaseCheckbox = Checkbox;
export const BaseCol = Col;
export const BaseDatePicker = DatePicker;
export const BaseInputBox = Input;
export const BaseRadio = Radio;
export const BaseRow = Row;
export const BaseSkeleton = Skeleton;
export const SelectBox = Select;
export const Option = Select.Option;

// ── Axios instance ─────────────────────────────────────────────────────────────
export const AxiosInstance = axios.create();

// ── AsyncTable ─────────────────────────────────────────────────────────────────
function normalizeTableProps(props: any) {
  const {
    data,
    dataSource,
    tableData,
    columns,
    columnData,
    column,
    loading,
    rowKey,
    pagination,
    handleSelect,
    handleEvent,
    totalRecords,
    rowsPerPage,
    ...rest
  } = props || {};

  const resolvedColumnData = columns || columnData || column || [];
  const resolvedColumns = resolvedColumnData.map((item: any) => {
    const key = item.key || item.dataIndex;
    return {
      title: item.title || item.name || item.label || key,
      dataIndex: item.dataIndex || key,
      key,
      render:
        key === "action"
          ? (_: any, record: any) =>
              React.createElement(
                "div",
                { style: { display: "flex", gap: 8 } },
                (record.action || []).map((action: any) =>
                  React.createElement(
                    Button,
                    {
                      key: action.key,
                      size: "small",
                      onClick: () => handleEvent && handleEvent(record, action),
                    },
                    action.label || action.key
                  )
                )
              )
          : item.render,
    };
  });

  return {
    columns: resolvedColumns,
    dataSource: dataSource || tableData || data || [],
    loading,
    rowKey: rowKey || "id",
    pagination:
      pagination === undefined
        ? { total: totalRecords, pageSize: rowsPerPage || 10 }
        : pagination,
    onChange: handleSelect,
    ...rest,
  };
}

export function AsyncTable(props: any) {
  return React.createElement(Table, normalizeTableProps(props));
}

// ── Notification helpers ────────────────────────────────────────────────────────
export function successNotify(messageText?: string) {
  message.success(messageText || "Success");
}

export function errorNotify(messageText?: string) {
  message.error(messageText || "Something went wrong");
}
