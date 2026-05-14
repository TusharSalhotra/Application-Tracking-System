const axios = require("axios");
const antd = require("antd");

const {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Skeleton,
  Table,
  message,
} = antd;

const AxiosInstance = axios.create();

function normalizeTableProps(props) {
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
    ...rest
  } = props || {};

  const resolvedColumnData = columns || columnData || column || [];
  const resolvedColumns = resolvedColumnData.map((item) => {
    const key = item.key || item.dataIndex;
    return {
      title: item.title || item.name || item.label || key,
      dataIndex: item.dataIndex || key,
      key,
      render:
        key === "action"
          ? (_, record) =>
              ReactSafe.createElement(
                "div",
                { style: { display: "flex", gap: 8 } },
                (record.action || []).map((action) =>
                  ReactSafe.createElement(
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
        ? {
            total: props?.totalRecords,
            pageSize: props?.rowsPerPage || 10,
          }
        : pagination,
    onChange: handleSelect,
    ...rest,
  };
}

function AsyncTable(props) {
  return ReactSafe.createElement(Table, normalizeTableProps(props));
}

const ReactSafe = require("react");

const BaseButton = Button;
const BaseButtonsForm = Form;
const BaseCard = Card;
const BaseCheckbox = Checkbox;
const BaseCol = Col;
const BaseDatePicker = DatePicker;
const BaseInputBox = Input;
const BaseRadio = Radio;
const BaseRow = Row;
const BaseSkeleton = Skeleton;
const SelectBox = Select;
const Option = Select.Option;

function successNotify(messageText) {
  message.success(messageText || "Success");
}

function errorNotify(messageText) {
  message.error(messageText || "Something went wrong");
}

module.exports = {
  AsyncTable,
  AxiosInstance,
  BaseButton,
  BaseButtonsForm,
  BaseCard,
  BaseCheckbox,
  BaseCol,
  BaseDatePicker,
  BaseInputBox,
  BaseRadio,
  BaseRow,
  BaseSkeleton,
  Option,
  SelectBox,
  errorNotify,
  successNotify,
};
