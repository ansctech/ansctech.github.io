import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
// import AddAccount from "./addAccount";
import { useDispatch } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import TableSearch from "../../../components/Table/tableSearch";
import { saleBillActions } from "../../../store/TransactionFarmers/saleBill";
import { useTranslation } from "react-i18next";
import useSaleBill from "../../../hooks/TransactionFarmers/useSaleBill";
import useBusinessEntity from "../../../hooks/Masters/useBusinessEntity";

const SaleBill = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;
  const dispatch = useDispatch();

  const { t } = useTranslation();

  // Sale bill Hook
  const {
    saleBill: { saleBill, isModal },
    controllers,
    volatileState: { isLoading },
  } = useSaleBill();

  const {
    businessEntity: { businessEntity },
  } = useBusinessEntity();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const editAccountItem = (item) => {
    setEditItem(item);
    dispatch(saleBillActions.update({ isModal: true }));
  };

  const deleteAccountItem = (accountId) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        controllers.deleteSaleBill(accountId);
      },
    });
  };

  // Schema
  const columns = [
    {
      title: "Date",
      render: (e) => (
        <>
          {new Date(e.bill_date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}
        </>
      ),
      sorter: (a, b) => a.bill_date.localeCompare(b.bill_date),
      ...TableSearch("bill_date"),
    },
    {
      title: "Customer Name",
      render: (e) => (
        <>
          {businessEntity.find((entity) => {
            return Number(entity.entity_id) === Number(e?.entity_id_cust);
          })?.entityname_eng || e.entity_id_cust}
        </>
      ),
      sorter: (a, b) => a.entity_id_cust.localeCompare(b.entity_id_cust),
      ...TableSearch("entity_id_cust"),
    },
    {
      title: "Amount",
      dataIndex: "bill_amount",
      sorter: (a, b) => a.bill_amount - b.bill_amount,
      ...TableSearch("bill_amount"),
    },
    {
      title: "Action",
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editAccountItem(record)} />
          <DeleteOutlined onClick={() => deleteAccountItem(record?.bill_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Sale Bill</h4>
      {/* <AddAccount
        modal={isModal}
        editItem={editItem}
        {...{
          ...controllers,
          isLoading,
        }}
      /> */}
    </div>
  );

  return (
    <Table
      columns={columns}
      dataSource={saleBill}
      bordered
      scroll={{ x: 500 }}
      loading={isLoading}
      title={() => tableHeader}
      rowKey={"bill_id"}
    />
  );
};

export default SaleBill;
