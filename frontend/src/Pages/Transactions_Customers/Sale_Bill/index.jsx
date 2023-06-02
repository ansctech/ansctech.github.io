import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Modal, Table } from "antd";
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
import AddSaleRecord from "./addSaleRecord";
import useVegetables from "../../../hooks/Masters/useVegetables";
import useUnits from "../../../hooks/Masters/useUnits";
import moment from "moment";
import dayjs from "dayjs";
import useSaleRecord from "../../../hooks/TransactionCustomers/useSaleRecord";
import { useNavigate } from "react-router-dom";
import useDate from "../../../hooks/global/useDate";
import { businessEntityActions } from "../../../store/Masters/businessEntity";
import { containerBalanceActions } from "../../../store/TransactionCustomers/containerBalance";

const SaleBill = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [duplicateData, setDuplicateData] = useState();
  const [date, setDate] = useState();

  const { t } = useTranslation();

  // Sale bill Hook
  const {
    saleBill: { saleBill },
    controllers,
    volatileState: { isLoading },
  } = useSaleBill();

  const {
    units: { units },
  } = useUnits();
  const {
    vegetables: { vegetables },
  } = useVegetables();
  const {
    businessEntity: { businessEntity },
  } = useBusinessEntity();

  const { convertDateToNormalFormat } = useDate();

  // Initialize Sale Record
  const {
    saleRecord: { isModal },
    controllers: { addSaleRecord },
    volatileState: { isLoading: saleRecordIsLoading },
  } = useSaleRecord();

  useEffect(() => {
    // Set date to today
    const today = new Date(Date.now());
    setDate(
      `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${(
        "0" + today.getDate()
      ).slice(-2)}`
    );
    form.setFieldsValue({ selected_date: dayjs(today.toISOString()) });
  }, []);

  useEffect(() => {
    setDuplicateData(
      saleBill.filter(({ bill_date }) => {
        if (!date) return true;

        let dataDate = new Date(bill_date);
        dataDate = `${dataDate.getFullYear()}-${(
          "0" +
          (dataDate.getMonth() + 1)
        ).slice(-2)}-${("0" + dataDate.getDate()).slice(-2)}`;

        return dataDate === date;
      })
    );
  }, [date, saleBill]);

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const editSaleBill = (bill) => {
    navigate(
      `./${bill.bill_id}/${convertDateToNormalFormat(bill.bill_date)}/${
        bill.entity_id_cust
      }`
    );
  };

  const deleteSaleBill = (billId) => {
    confirm({
      title: "Do you Want to delete this item?",
      autoFocusButton: "cancel",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await controllers.deleteSaleBill(billId);
        dispatch(businessEntityActions.update({ loaded: false }));
        dispatch(containerBalanceActions.update({ loaded: false }));
      },
    });
  };

  // Schema
  const columns = [
    {
      title: t(
        "table.transaction-customer.subHeaders.saleBill.labels.dateOfSale.text"
      ),
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
      title: t(
        "table.transaction-customer.subHeaders.saleBill.labels.customerName.text"
      ),
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
      title: t(
        "table.transaction-customer.subHeaders.saleBill.labels.amount.text"
      ),
      align: "right",
      render: (e) => Number(e.bill_amount).toFixed(2),
      sorter: (a, b) => a.bill_amount - b.bill_amount,
      ...TableSearch("bill_amount"),
    },
    {
      title: t(
        "table.transaction-customer.subHeaders.saleBill.labels.action.text"
      ),
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editSaleBill(record)} />
          <DeleteOutlined onClick={() => deleteSaleBill(record?.bill_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers mr-auto">
      <h4>{t("table.transaction-customer.subHeaders.saleBill.text")}</h4>
      <div className="" style={{ display: "flex", gap: "30px" }}>
        <Form form={form}>
          <Form.Item name="selected_date">
            <DatePicker
              onChange={(date, dateString) => {
                setDate(dateString);
              }}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            controllers.generateBill(date);
          }}
        >
          Generate Bill
        </Button>
        <AddSaleRecord
          units={units}
          modal={isModal}
          editItem={editItem}
          isLoading={saleRecordIsLoading}
          vegetable={vegetables}
          businessEntity={businessEntity}
          addSaleRecord={addSaleRecord}
        />
      </div>
    </div>
  );

  return (
    <Table
      columns={columns}
      dataSource={duplicateData}
      bordered
      scroll={{ x: 500 }}
      loading={isLoading}
      title={() => tableHeader}
      rowKey={"bill_id"}
    />
  );
};

export default SaleBill;
