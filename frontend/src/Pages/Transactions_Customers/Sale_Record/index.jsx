import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AddSaleRecord from "./addSaleRecord";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TableSearch from "../../../components/Table/tableSearch";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useSaleRecord from "../../../hooks/TransactionCustomers/useSaleRecord";
import useUnits from "../../../hooks/Masters/useUnits";
import useCustomerGroups from "../../../hooks/Masters/useCustomerGroups";
import useVegetables from "../../../hooks/Masters/useVegetables";
import { useTranslation } from "react-i18next";

const SaleRecord = () => {
  const [editItem, setEditItem] = useState("");
  const navigate = useNavigate();
  const { confirm } = Modal;

  const { t } = useTranslation();

  const {
    units: { units },
  } = useUnits();
  const {
    vegetables: { vegetables },
  } = useVegetables();
  const {
    customerGroups: { customerGroups },
  } = useCustomerGroups();
  const {
    saleRecord: { saleRecord, isModal },
    controllers,
    volatileState: { isLoading },
  } = useSaleRecord();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const editAccountItem = (item) => {
    navigate("/customers/added-sale-record/" + item.entry_id);
  };

  const deleteAccountItem = (id) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        controllers.deleteSaleRecord(id);
      },
    });
  };

  const columns = [
    {
      title: t("table.masters.subHeaders.saleRecord.labels.dateOfSale.text"),
      align: "left",
      sorter: (a, b) => a.sale_date.localeCompare(b.sale_date),
      render: (e) => (
        <>
          {new Date(e.sale_date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}
        </>
      ),
      ...TableSearch("sale_date"),
    },
    {
      title: t("table.masters.subHeaders.saleRecord.labels.customerName.text"),
      render: (e) => (
        <>
          {customerGroups.find((cust) => {
            console.log(cust, e);
            return cust.cust_group_id === Number(e?.entity_id_cust);
          })?.cust_group_name_eng || e.entity_id_cust}
        </>
      ),
      sorter: (a, b) => a.entity_id_cust.localeCompare(b.entity_id_cust),
      ...TableSearch("entity_id_cust"),
    },
    {
      title: t("table.masters.subHeaders.saleRecord.labels.amount.text"),
      align: "right",
      dataIndex: "sale_amount",
      sorter: (a, b) => a.sale_amount - b.sale_amount,
    },
    {
      title: t("table.masters.subHeaders.saleRecord.labels.totalItems.text"),
      align: "right",
      sorter: (a, b) => a.sale_qty - b.sale_qty,
      render: (e) => <>{e.sale_qty}</>,
    },
    {
      title: "Action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editAccountItem(record)} />
          <DeleteOutlined onClick={() => deleteAccountItem(record?.entry_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers mr-auto">
      <h4>{t("table.masters.subHeaders.saleRecord.text")}</h4>
      <div className="" style={{ display: "flex", gap: "30px" }}>
        <Button type="primary">Generate Bill</Button>
        <Button type="primary">Show record</Button>
        <AddSaleRecord
          units={units}
          modal={isModal}
          editItem={editItem}
          isLoading={isLoading}
          vegetable={vegetables}
          customers={customerGroups}
          {...controllers}
        />
      </div>
    </div>
  );

  return (
    <Table
      bordered
      rowKey={"id"}
      scroll={{ x: 800 }}
      columns={columns}
      loading={isLoading}
      dataSource={saleRecord}
      title={() => tableHeader}
    />
  );
};

export default SaleRecord;
