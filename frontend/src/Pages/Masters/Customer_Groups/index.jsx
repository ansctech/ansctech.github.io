import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import AddCustomer from "./addCustomer";
import { useDispatch } from "react-redux";
import TableSearch from "../../../components/Table/tableSearch";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useCustomerGroups from "../../../hooks/Masters/useCustomerGroups";
import { customerGroupsActions } from "../../../store/Masters/customerGroups";
import { useTranslation } from "react-i18next";

const CustomerGroups = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;
  const dispatch = useDispatch();

  const { t } = useTranslation();

  //   Customer Groups Hook
  const {
    customerGroups: { customerGroups, isModal },
    controllers,
    volatileState: { isLoading },
  } = useCustomerGroups();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const editCustomerItem = (item) => {
    setEditItem(item);
    dispatch(customerGroupsActions.update({ isModal: true }));
  };

  const deleteCustomerItem = (customerId) => {
    confirm({
      title: "Do you Want to delete this item?",
      autoFocusButton: "cancel",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        controllers.deleteCustomerGroup(customerId);
      },
    });
  };

  //   Schema
  const columns = [
    {
      title: t("table.masters.subHeaders.customerGroups.labels.name.text"),
      dataIndex: "cust_group_name_eng",
      sorter: (a, b) =>
        a.cust_group_name_eng.localeCompare(b.cust_group_name_eng),
      ...TableSearch("cust_group_name_eng"),
    },
    {
      title: t(
        "table.masters.subHeaders.customerGroups.labels.nameLocalLang.text"
      ),
      dataIndex: "cust_group_name_local_lang",
      sorter: (a, b) =>
        a.cust_group_name_local_lang.localeCompare(
          b.cust_group_name_local_lang
        ),
      ...TableSearch("cust_group_name_local_lang"),
    },
    {
      title: t("table.masters.subHeaders.customerGroups.labels.action.text"),
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editCustomerItem(record)} />
          <DeleteOutlined
            onClick={() => deleteCustomerItem(record?.cust_group_id)}
          />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>{t("table.masters.subHeaders.customerGroups.text")}</h4>
      <AddCustomer
        modal={isModal}
        editItem={editItem}
        isLoading={isLoading}
        {...controllers}
      />
    </div>
  );

  return (
    <Table
      bordered
      rowKey={"id"}
      columns={columns}
      scroll={{ x: 500 }}
      loading={isLoading}
      title={() => tableHeader}
      dataSource={customerGroups}
    />
  );
};

export default CustomerGroups;
