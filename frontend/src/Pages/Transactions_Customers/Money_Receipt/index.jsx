import React, { useState } from "react";
import { Table, Modal, Form, DatePicker } from "antd";
import AddMoneyReceipt from "./addMoneyReceipt";
import { useDispatch } from "react-redux";
import TableSearch from "../../../components/Table/tableSearch";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  EditOutlined,
} from "@ant-design/icons";
import useMoneyReceipt from "../../../hooks/TransactionCustomers/useMoneyReceipt";
import { moneyReceiptActions } from "../../../store/TransactionCustomers/moneyReceipt";
import useBusinessEntity from "../../../hooks/Masters/useBusinessEntity";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import dayjs from "dayjs";
import { businessEntityActions } from "../../../store/Masters/businessEntity";

const MoneyReceipt = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;
  const dispatch = useDispatch();

  const [duplicateData, setDuplicateData] = useState();
  const [form] = Form.useForm();
  const [date, setDate] = useState();

  const { t } = useTranslation();

  const {
    moneyReceipt: { moneyReceipt, isModal },
    controllers,
    volatileState: { isLoading },
  } = useMoneyReceipt();

  const {
    businessEntity: { businessEntity },
  } = useBusinessEntity();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  useEffect(() => {
    // Set date to today
    const today = new Date(Date.now());
    form.setFieldsValue({ selected_date: dayjs(today.toISOString()) });
    setDate(
      `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${(
        "0" + today.getDate()
      ).slice(-2)}`
    );
  }, []);

  useEffect(() => {
    setDuplicateData(
      moneyReceipt.filter(({ receipt_date }) => {
        if (!date) return true;

        let dataDate = new Date(receipt_date);
        dataDate = `${dataDate.getFullYear()}-${(
          "0" +
          (dataDate.getMonth() + 1)
        ).slice(-2)}-${("0" + dataDate.getDate()).slice(-2)}`;

        return dataDate === date;
      })
    );
  }, [date, moneyReceipt]);

  const deleteItem = (id) => {
    confirm({
      title: "Do you Want to delete this item?",
      autoFocusButton: "cancel",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await controllers.deleteMoneyReceipt(id);
        dispatch(businessEntityActions.update({ loaded: false }));
      },
    });
  };

  const editMoneyReceipt = (item) => {
    setEditItem(item);
    dispatch(moneyReceiptActions.update({ isModal: true }));
  };

  const colums = [
    {
      title: t(
        "table.transaction-customer.subHeaders.moneyReceipt.labels.dateOfReceipt.text"
      ),
      render: (e) => (
        <>
          {new Date(e.receipt_date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}
        </>
      ),
      sorter: (a, b) => a.receipt_date.localeCompare(b.receipt_date),
      ...TableSearch("receipt_date"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.moneyReceipt.labels.customerName.text"
      ),
      render: (e) => (
        <>
          {businessEntity.find((entity) => {
            return Number(entity.entity_id) === Number(e?.entity_id);
          })?.entityname_eng || e.entity_id}
        </>
      ),
      sorter: (a, b) => a.entity_id.localeCompare(b.entity_id),
      ...TableSearch("entity_id"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.moneyReceipt.labels.amount.text"
      ),
      dataIndex: "amount",
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      ...TableSearch("amount"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.moneyReceipt.labels.remarks.text"
      ),
      dataIndex: "remarks",
      sorter: (a, b) => a.remarks.localeCompare(b.remarks),
      ...TableSearch("remarks"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.moneyReceipt.labels.action.text"
      ),
      width: 100,
      align: "center",
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editMoneyReceipt(record)} />
          <DeleteOutlined onClick={() => deleteItem(record?.receipt_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>{t("table.transaction-customer.subHeaders.moneyReceipt.text")}</h4>
      <div className="" style={{ display: "flex", gap: "30px" }}>
        <Form form={form}>
          <Form.Item name="selected_date">
            <DatePicker
              onChange={(_, dateString) => setDate(dateString)}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
        <AddMoneyReceipt
          editItem={editItem}
          isLoading={isLoading}
          modal={isModal}
          businessEntity={businessEntity}
          {...controllers}
        />
      </div>
    </div>
  );

  return (
    <Table
      bordered
      columns={colums}
      title={() => tableHeader}
      dataSource={duplicateData}
      loading={isLoading}
      rowKey={"id"}
      scroll={{ x: 768 }}
    />
  );
};

export default MoneyReceipt;
