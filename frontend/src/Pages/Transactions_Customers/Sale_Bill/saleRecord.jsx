import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Modal, Table } from "antd";
import AddSaleRecord from "./addSaleRecord";
import { useNavigate, useParams } from "react-router-dom";
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
import useDate from "../../../hooks/global/useDate";
import { saleRecordActions } from "../../../store/TransactionCustomers/saleRecord";
import useSaleBill from "../../../hooks/TransactionFarmers/useSaleBill";
import { containerBalanceActions } from "../../../store/TransactionCustomers/containerBalance";

const SaleRecord = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { date, customer, billId } = useParams();

  const { convertDateToNormalFormat } = useDate();

  const navigate = useNavigate();

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

  const {
    controllers: { generateBill },
  } = useSaleBill();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const deleteSaleRecordItem = async (e) => {
    confirm({
      title: "Do you Want to delete this item?",
      autoFocusButton: "cancel",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await controllers.deleteSaleRecord(e?.entry_id, e);
        generateBill(date);
        dispatch(containerBalanceActions.update({ loaded: false }));
      },
    });
  };

  const columns = [
    {
      title: "SI#",
      render: (a, b, num) => <>{num + 1}</>,
    },
    {
      title: "Vegetable",
      render: (e) => (
        <>
          {vegetables.find((veg) => {
            return Number(veg.item_id) === Number(e?.item_id);
          })?.item_name_eng || e?.item_id}
        </>
      ),
    },
    {
      title: "Qty",
      dataIndex: "sale_qty",
      align: "right",
    },
    {
      title: "Unit",
      render: (e) => (
        <>
          {units.find((unit) => {
            return Number(unit.container_id) === Number(e?.unit_container_id);
          })?.container_name_eng || e?.unit_container_id}
        </>
      ),
    },
    {
      title: "Rate",
      dataIndex: "item_rate",
      align: "right",
    },
    {
      title: "Kg/Unit",
      dataIndex: "kg_per_container",
      align: "right",
    },
    {
      title: "Amount",
      align: "right",
      render: (e) => Number(e.sale_amount).toFixed(2),
    },
    {
      title: "Delete",
      align: "center",
      render: (e) => (
        <DeleteOutlined
          onClick={() => deleteSaleRecordItem(e)}
          className="table-btn"
        />
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers mr-auto">
      <div className="" style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="primary"
          onClick={() => {
            navigate("/customers/sale-bill");
          }}
        >
          Back To Sale Bill
        </Button>
        <h4 style={{ marginLeft: 40 }}>
          Bill Date: <span style={{ fontWeight: 400 }}>{date}</span>
        </h4>
      </div>
      <h4>
        Customer:{" "}
        <span style={{ fontWeight: 400 }}>
          {businessEntity.find((entity) => {
            return Number(entity.entity_id) === Number(customer);
          })?.entityname_eng || customer}
        </span>
      </h4>
    </div>
  );

  return (
    <Table
      bordered
      rowKey={"id"}
      scroll={{ x: 800 }}
      columns={columns}
      loading={isLoading}
      dataSource={saleRecord.filter(
        (record) =>
          record.entity_id_cust === customer &&
          convertDateToNormalFormat(record.sale_date) === date
      )}
      title={() => tableHeader}
    />
  );
};

export default SaleRecord;
