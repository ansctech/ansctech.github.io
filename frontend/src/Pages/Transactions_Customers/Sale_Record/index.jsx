import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Modal, Table } from "antd";
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
import useVegetables from "../../../hooks/Masters/useVegetables";
import { useTranslation } from "react-i18next";
import useBusinessEntity from "../../../hooks/Masters/useBusinessEntity";
import moment from "moment";

const SaleRecord = () => {
  const [editItem, setEditItem] = useState("");
  const navigate = useNavigate();
  const { confirm } = Modal;

  const [form] = Form.useForm();
  const [duplicateData, setDuplicateData] = useState();
  const [date, setDate] = useState();

  const { t } = useTranslation();

  const {
    units: { units },
  } = useUnits();
  const {
    vegetables: { vegetables },
  } = useVegetables();
  const {
    businessEntity: { businessEntity },
  } = useBusinessEntity();
  const {
    saleRecord: { saleRecord, isModal },
    controllers,
    volatileState: { isLoading },
  } = useSaleRecord();

  useEffect(() => {
    // Set date to today
    const today = new Date(Date.now());
    form.setFieldsValue({ selected_date: moment(today.toISOString()) });
    setDate(
      `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${(
        "0" + today.getDate()
      ).slice(-2)}`
    );
  }, []);

  useEffect(() => {
    setDuplicateData(
      saleRecord.filter(({ sale_date }) => {
        if (!date) return true;

        let dataDate = new Date(sale_date);
        dataDate = `${dataDate.getFullYear()}-${(
          "0" +
          (dataDate.getMonth() + 1)
        ).slice(-2)}-${("0" + dataDate.getDate()).slice(-2)}`;

        return dataDate === date;
      })
    );
  }, [date, saleRecord]);

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
          {businessEntity.find((entity) => {
            return Number(entity.entity_id) === Number(e?.entity_id_cust);
          })?.entityname_eng || e.entity_id_cust}
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
        <Form form={form}>
          <Form.Item name="selected_date">
            <DatePicker
              onChange={(_, dateString) => setDate(dateString)}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
        <Button type="primary">Generate Bill</Button>
        <AddSaleRecord
          units={units}
          modal={isModal}
          editItem={editItem}
          isLoading={isLoading}
          vegetable={vegetables}
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
      scroll={{ x: 800 }}
      columns={columns}
      loading={isLoading}
      dataSource={duplicateData}
      title={() => tableHeader}
    />
  );
};

export default SaleRecord;
