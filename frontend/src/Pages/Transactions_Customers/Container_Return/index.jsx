import React from "react";
import { DatePicker, Form, Modal, Table } from "antd";
import AddContainerReturn from "./addContainerReturn";
import TableSearch from "../../../components/Table/tableSearch";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useContainerReturn from "../../../hooks/TransactionCustomers/useContainerReturn";
import useUnits from "../../../hooks/Masters/useUnits";
import useBusinessEntity from "../../../hooks/Masters/useBusinessEntity";
import { useState } from "react";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { containerReturnActions } from "../../../store/TransactionCustomers/containerReturn";
import dayjs from "dayjs";
import containerBalance from "../../../store/TransactionCustomers/containerBalance";
import { useTranslation } from "react-i18next";

const ContainerReturn = () => {
  const { confirm } = Modal;

  const { t } = useTranslation();

  const {
    containerReturn: { containerReturn, isModal },
    controllers,
    volatileState: { isLoading },
  } = useContainerReturn();

  const [editItem, setEditItem] = useState();
  const dispatch = useDispatch();

  const [duplicateData, setDuplicateData] = useState();
  const [form] = Form.useForm();
  const [date, setDate] = useState();

  const {
    businessEntity: { businessEntity },
  } = useBusinessEntity();

  const {
    units: { units },
  } = useUnits();

  const deleteItem = (record) => {
    confirm({
      title: "Do you Want to delete this item?",
      autoFocusButton: "cancel",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await controllers.deleteContainerReturn(record?.cont_txn_id, record);
        dispatch(containerBalance.update({ loaded: false }));
      },
    });
  };

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
      containerReturn.filter(({ cont_txn_date }) => {
        if (!date) return true;

        let dataDate = new Date(cont_txn_date);
        dataDate = `${dataDate.getFullYear()}-${(
          "0" +
          (dataDate.getMonth() + 1)
        ).slice(-2)}-${("0" + dataDate.getDate()).slice(-2)}`;

        return dataDate === date;
      })
    );
  }, [date, containerReturn]);

  const editContainerReturnItem = (item) => {
    setEditItem(item);
    dispatch(containerReturnActions.update({ isModal: true }));
  };

  const columns = [
    {
      title: t(
        "table.transaction-customer.subHeaders.containerReturn.labels.dateOfReceipt.text"
      ),
      render: (e) => (
        <>
          {new Date(e.cont_txn_date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}
        </>
      ),
      sorter: (a, b) => a.cont_txn_date.localeCompare(b.cont_txn_date),
      ...TableSearch("cont_txn_date"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.containerReturn.labels.customerName.text"
      ),
      render: (e) => (
        <>
          {businessEntity.find((entity) => {
            return Number(entity.entity_id) === Number(e?.entity_id);
          })?.entityname_eng || e.entity_id}
        </>
      ),
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      ...TableSearch("customer"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.containerReturn.labels.containerType.text"
      ),
      render: (e) => (
        <>
          {units.find((unit) => {
            return unit.container_id === Number(e?.container_id);
          })?.container_name_eng || e.container_id}
        </>
      ),
      sorter: (a, b) => a.container_id.localeCompare(b.container_id),
      ...TableSearch("container_id"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.containerReturn.labels.qty.text"
      ),
      dataIndex: "qty_received",
      align: "right",
      sorter: (a, b) => a.qty_received - b.qty_received,
      ...TableSearch("qty_received"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.containerReturn.labels.action.text"
      ),
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editContainerReturnItem(record)} />
          <DeleteOutlined onClick={() => deleteItem(record)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Container Return</h4>
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
        <AddContainerReturn
          modal={isModal}
          editItem={editItem}
          isLoading={isLoading}
          units={units}
          businessEntity={businessEntity}
          {...controllers}
        />
      </div>
    </div>
  );

  return (
    <Table
      bordered
      rowKey={"id"}
      scroll={{ x: 768 }}
      columns={columns}
      loading={isLoading}
      title={() => tableHeader}
      dataSource={duplicateData?.filter((data) => data.qty_received)}
    />
  );
};

export default ContainerReturn;
